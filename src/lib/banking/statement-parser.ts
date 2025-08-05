// Serviço para importação e parsing de extratos bancários
export interface StatementEntry {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  document?: string;
  balance: number;
  category?: string;
}

export interface StatementFile {
  bankCode: string;
  accountNumber: string;
  startDate: string;
  endDate: string;
  entries: StatementEntry[];
}

export class StatementParser {
  // Parse OFX (formato padrão dos bancos brasileiros)
  static parseOFX(content: string): StatementFile {
    const lines = content.split('\n');
    const entries: StatementEntry[] = [];
    let bankCode = '';
    let accountNumber = '';
    let startDate = '';
    let endDate = '';

    let currentEntry: Partial<StatementEntry> = {};
    let inTransaction = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Extrair informações da conta
      if (trimmed.includes('<BANKID>')) {
        bankCode = trimmed.replace(/<\/?BANKID>/g, '');
      }
      if (trimmed.includes('<ACCTID>')) {
        accountNumber = trimmed.replace(/<\/?ACCTID>/g, '');
      }
      if (trimmed.includes('<DTSTART>')) {
        startDate = trimmed.replace(/<\/?DTSTART>/g, '');
      }
      if (trimmed.includes('<DTEND>')) {
        endDate = trimmed.replace(/<\/?DTEND>/g, '');
      }

      // Parse das transações
      if (trimmed === '<STMTTRN>') {
        inTransaction = true;
        currentEntry = {};
      } else if (trimmed === '</STMTTRN>') {
        if (currentEntry.date && currentEntry.amount !== undefined) {
          entries.push({
            date: this.formatDate(currentEntry.date!),
            description: currentEntry.description || 'Transação sem descrição',
            amount: Math.abs(currentEntry.amount),
            type: currentEntry.amount > 0 ? 'credit' : 'debit',
            document: currentEntry.document,
            balance: currentEntry.balance || 0,
            category: this.categorizeTransaction(currentEntry.description || '')
          });
        }
        inTransaction = false;
      } else if (inTransaction) {
        if (trimmed.includes('<DTPOSTED>')) {
          currentEntry.date = trimmed.replace(/<\/?DTPOSTED>/g, '');
        } else if (trimmed.includes('<TRNAMT>')) {
          currentEntry.amount = parseFloat(trimmed.replace(/<\/?TRNAMT>/g, ''));
        } else if (trimmed.includes('<MEMO>')) {
          currentEntry.description = trimmed.replace(/<\/?MEMO>/g, '');
        } else if (trimmed.includes('<CHECKNUM>')) {
          currentEntry.document = trimmed.replace(/<\/?CHECKNUM>/g, '');
        }
      }
    }

    return {
      bankCode,
      accountNumber,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      entries
    };
  }

  // Parse CSV (formato alternativo)
  static parseCSV(content: string, bankCode: string): StatementFile {
    const lines = content.split('\n');
    const entries: StatementEntry[] = [];
    
    // Skip header
    const dataLines = lines.slice(1).filter(line => line.trim());

    for (const line of dataLines) {
      const columns = line.split(';').map(col => col.replace(/"/g, '').trim());
      
      if (columns.length >= 4) {
        const [date, description, , amount] = columns;
        const numAmount = parseFloat(amount.replace(',', '.'));
        
        entries.push({
          date: this.formatDate(date),
          description: description || 'Transação sem descrição',
          amount: Math.abs(numAmount),
          type: numAmount > 0 ? 'credit' : 'debit',
          balance: 0, // CSV geralmente não tem saldo
          category: this.categorizeTransaction(description || '')
        });
      }
    }

    return {
      bankCode,
      accountNumber: 'N/A',
      startDate: entries[0]?.date || '',
      endDate: entries[entries.length - 1]?.date || '',
      entries
    };
  }

  // Categorização automática baseada na descrição
  private static categorizeTransaction(description: string): string {
    const desc = description.toLowerCase();
    
    // Receitas
    if (desc.includes('pix') || desc.includes('transferencia') || desc.includes('deposito')) {
      if (desc.includes('condominio') || desc.includes('taxa')) {
        return 'Receita Condominial';
      }
      return 'Receita Geral';
    }
    
    // Despesas
    if (desc.includes('pagamento') || desc.includes('debito') || desc.includes('saque')) {
      if (desc.includes('luz') || desc.includes('energia') || desc.includes('copel') || desc.includes('elektro')) {
        return 'Despesa Energia';
      }
      if (desc.includes('agua') || desc.includes('sanepar') || desc.includes('sabesp')) {
        return 'Despesa Água';
      }
      if (desc.includes('limpeza') || desc.includes('faxina')) {
        return 'Despesa Limpeza';
      }
      if (desc.includes('manutencao') || desc.includes('reparo')) {
        return 'Despesa Manutenção';
      }
      if (desc.includes('seguranca') || desc.includes('portaria')) {
        return 'Despesa Segurança';
      }
      return 'Despesa Operacional';
    }

    // Taxas bancárias
    if (desc.includes('tarifa') || desc.includes('taxa') || desc.includes('anuidade')) {
      return 'Taxa Bancária';
    }

    return 'Outros';
  }

  // Formatar data para padrão ISO
  private static formatDate(dateStr: string): string {
    if (dateStr.length === 8) {
      // YYYYMMDD
      return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    }
    if (dateStr.includes('/')) {
      // DD/MM/YYYY
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return dateStr;
  }

  // Validar arquivo de extrato
  static validateFile(file: File): { isValid: boolean; error?: string; bankCode?: string } {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;

    // Validar tamanho (máximo 10MB)
    if (fileSize > 10 * 1024 * 1024) {
      return { isValid: false, error: 'Arquivo muito grande. Máximo 10MB.' };
    }

    // Identificar banco pelo nome do arquivo
    let bankCode = '';
    if (fileName.includes('bb') || fileName.includes('brasil')) {
      bankCode = '001';
    } else if (fileName.includes('itau')) {
      bankCode = '341';
    } else if (fileName.includes('caixa') || fileName.includes('cef')) {
      bankCode = '104';
    } else if (fileName.includes('santander')) {
      bankCode = '033';
    } else if (fileName.includes('bradesco')) {
      bankCode = '237';
    }

    // Validar formato
    if (fileName.endsWith('.ofx') || fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
      return { isValid: true, bankCode };
    }

    return { isValid: false, error: 'Formato não suportado. Use OFX, CSV ou TXT.' };
  }
}
