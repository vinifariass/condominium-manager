// Serviço para geração de boletos bancários via API dos bancos
export interface BoletoData {
  id?: string;
  amount: number;
  dueDate: string;
  payer: {
    name: string;
    document: string; // CPF ou CNPJ
    email?: string;
    phone?: string;
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  description: string;
  instructions?: string;
  apartmentNumber?: string;
  referenceMonth?: string;
  beneficiary: {
    name: string;
    document: string;
    account: {
      bankCode: string;
      agency: string;
      accountNumber: string;
    };
  };
  finePercentage?: number;
  interestPercentage?: number;
  discountAmount?: number;
  discountDueDate?: string;
}

export interface BoletoResponse {
  success: boolean;
  data?: {
    boletoId: string;
    digitableLine: string;
    barcode: string;
    pdfUrl?: string;
    qrCode?: string;
    dueDate: string;
    amount: number;
    status: 'generated' | 'registered' | 'paid' | 'expired' | 'cancelled';
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface BankCredentials {
  bankCode: string;
  apiKey: string;
  clientId?: string;
  clientSecret?: string;
  certificatePath?: string;
  environment: 'sandbox' | 'production';
}

export class BoletoService {
  private credentials: BankCredentials;

  constructor(credentials: BankCredentials) {
    this.credentials = credentials;
  }

  // Método principal para gerar boleto
  async generateBoleto(boletoData: BoletoData): Promise<BoletoResponse> {
    try {
      switch (this.credentials.bankCode) {
        case '001': // Banco do Brasil
          return await this.generateBoletoBB(boletoData);
        case '341': // Itaú
          return await this.generateBoletoItau(boletoData);
        case '104': // Caixa Econômica
          return await this.generateBoletoCaixa(boletoData);
        case '033': // Santander
          return await this.generateBoletoSantander(boletoData);
        case '237': // Bradesco
          return await this.generateBoletoBradesco(boletoData);
        default:
          return {
            success: false,
            error: {
              code: 'BANK_NOT_SUPPORTED',
              message: 'Banco não suportado para geração de boletos'
            }
          };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GENERATION_ERROR',
          message: 'Erro ao gerar boleto',
          details: error
        }
      };
    }
  }

  // Geração para Banco do Brasil
  private async generateBoletoBB(boletoData: BoletoData): Promise<BoletoResponse> {
    const endpoint = this.credentials.environment === 'production' 
      ? 'https://api.bb.com.br/cobrancas/v2/boletos'
      : 'https://api.hm.bb.com.br/cobrancas/v2/boletos';

    const token = await this.getBBToken();
    if (!token) {
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Erro na autenticação com Banco do Brasil'
        }
      };
    }

    const payload = {
      numeroConvenio: this.credentials.clientId,
      numeroCarteira: 17, // Carteira padrão para cobrança
      numeroVariacaoCarteira: 35,
      codigoModalidade: 1,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: boletoData.dueDate,
      valorOriginal: boletoData.amount,
      valorAbatimento: boletoData.discountAmount || 0,
      quantidadeDiasProtesto: 0,
      quantidadeDiasNegativacao: 0,
      orgaoNegativador: 10,
      indicadorAceiteTituloVencido: 'N',
      numeroDiasLimiteRecebimento: 30,
      codigoAceite: 'N',
      codigoTipoTitulo: 2,
      descricaoTipoTitulo: 'DM',
      indicadorPermissaoRecebimentoParcial: 'N',
      numeroTituloBeneficiario: `${Date.now()}`,
      textoCampoUtilizacaoCliente: boletoData.description,
      numeroTituloCliente: boletoData.id || `CON${Date.now()}`,
      mensagemBloquetoOcorrencia: boletoData.instructions || 'Pagamento de taxa condominial',
      desconto: boletoData.discountAmount ? {
        tipo: 1,
        dataExpiracao: boletoData.discountDueDate || boletoData.dueDate,
        porcentagem: 0,
        valor: boletoData.discountAmount
      } : undefined,
      jurosMora: boletoData.interestPercentage ? {
        tipo: 2,
        porcentagem: boletoData.interestPercentage,
        valor: 0
      } : undefined,
      multa: boletoData.finePercentage ? {
        tipo: 2,
        porcentagem: boletoData.finePercentage,
        valor: 0
      } : undefined,
      pagador: {
        tipoInscricao: boletoData.payer.document.length === 11 ? 1 : 2,
        numeroInscricao: this.formatDocument(boletoData.payer.document),
        nome: boletoData.payer.name,
        endereco: boletoData.payer.address ? {
          logradouro: boletoData.payer.address.street,
          numero: boletoData.payer.address.number,
          complemento: boletoData.payer.address.complement || '',
          bairro: boletoData.payer.address.neighborhood,
          cidade: boletoData.payer.address.city,
          codigoUF: boletoData.payer.address.state,
          cep: this.formatCEP(boletoData.payer.address.zipCode)
        } : undefined,
        telefone: boletoData.payer.phone || '',
        email: boletoData.payer.email || ''
      },
      beneficiarioFinal: {
        tipoInscricao: boletoData.beneficiary.document.length === 11 ? 1 : 2,
        numeroInscricao: this.formatDocument(boletoData.beneficiary.document),
        nome: boletoData.beneficiary.name
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-BB-API-Version': '2'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: {
            boletoId: result.numero,
            digitableLine: result.linhaDigitavel,
            barcode: result.codigoBarras,
            pdfUrl: result.urlPdf,
            qrCode: result.qrCode,
            dueDate: result.dataVencimento,
            amount: result.valorOriginal,
            status: 'generated'
          }
        };
      } else {
        return {
          success: false,
          error: {
            code: result.codigo || 'BB_ERROR',
            message: result.mensagem || 'Erro no Banco do Brasil',
            details: result
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com Banco do Brasil',
          details: error
        }
      };
    }
  }

  // Geração para Itaú
  private async generateBoletoItau(boletoData: BoletoData): Promise<BoletoResponse> {
    const endpoint = this.credentials.environment === 'production'
      ? 'https://api.itau.com.br/cash_management/v2/boletos'
      : 'https://devportal.itau.com.br/api/cash_management/v2/boletos';

    const token = await this.getItauToken();
    if (!token) {
      return {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Erro na autenticação com Itaú'
        }
      };
    }

    const payload = {
      etapa_processo_boleto: 'efetivacao',
      codigo_carteira: '109',
      codigo_produto: '09',
      codigo_ocorrencia: '01',
      numero_nosso_numero: String(Date.now()),
      digito_nosso_numero: '0',
      valor_titulo: boletoData.amount,
      codigo_especie: '01',
      flag_aceite: 'N',
      data_vencimento: boletoData.dueDate,
      data_emissao: new Date().toISOString().split('T')[0],
      codigo_pagador: this.formatDocument(boletoData.payer.document),
      nome_pagador: boletoData.payer.name,
      endereco_pagador: boletoData.payer.address ? 
        `${boletoData.payer.address.street}, ${boletoData.payer.address.number}` : '',
      bairro_pagador: boletoData.payer.address?.neighborhood || '',
      cep_pagador: this.formatCEP(boletoData.payer.address?.zipCode || ''),
      cidade_pagador: boletoData.payer.address?.city || '',
      uf_pagador: boletoData.payer.address?.state || '',
      texto_seu_numero: boletoData.id || `CON${Date.now()}`,
      texto_mensagem_bloqueto: boletoData.instructions || 'Pagamento de taxa condominial',
      data_limite_pagamento: this.addDays(boletoData.dueDate, 30),
      codigo_multa: boletoData.finePercentage ? '4' : '0',
      valor_multa: boletoData.finePercentage || 0,
      codigo_juros: boletoData.interestPercentage ? '1' : '0',
      valor_juros: boletoData.interestPercentage || 0,
      codigo_desconto: boletoData.discountAmount ? '1' : '0',
      valor_desconto: boletoData.discountAmount || 0,
      data_desconto: boletoData.discountDueDate || boletoData.dueDate
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Itau-Correlationid': String(Date.now()),
          'X-Itau-Flowid': String(Date.now())
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: {
            boletoId: result.numero_nosso_numero,
            digitableLine: result.linha_digitavel,
            barcode: result.codigo_barras,
            dueDate: result.data_vencimento,
            amount: result.valor_titulo,
            status: 'generated'
          }
        };
      } else {
        return {
          success: false,
          error: {
            code: result.codigo || 'ITAU_ERROR',
            message: result.mensagem || 'Erro no Itaú',
            details: result
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com Itaú',
          details: error
        }
      };
    }
  }

  // Placeholder para outros bancos
  private async generateBoletoCaixa(boletoData: BoletoData): Promise<BoletoResponse> {
    // Implementar API da Caixa
    return {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'API da Caixa ainda não implementada'
      }
    };
  }

  private async generateBoletoSantander(boletoData: BoletoData): Promise<BoletoResponse> {
    // Implementar API do Santander
    return {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'API do Santander ainda não implementada'
      }
    };
  }

  private async generateBoletoBradesco(boletoData: BoletoData): Promise<BoletoResponse> {
    // Implementar API do Bradesco
    return {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'API do Bradesco ainda não implementada'
      }
    };
  }

  // Autenticação Banco do Brasil
  private async getBBToken(): Promise<string | null> {
    const endpoint = this.credentials.environment === 'production'
      ? 'https://oauth.bb.com.br/oauth/token'
      : 'https://oauth.hm.bb.com.br/oauth/token';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.credentials.clientId}:${this.credentials.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials&scope=cobrancas.boletos-info cobrancas.boletos-requisicao'
      });

      const result = await response.json();
      return result.access_token || null;
    } catch (error) {
      console.error('Erro na autenticação BB:', error);
      return null;
    }
  }

  // Autenticação Itaú
  private async getItauToken(): Promise<string | null> {
    const endpoint = this.credentials.environment === 'production'
      ? 'https://sts.itau.com.br/api/oauth/token'
      : 'https://devportal.itau.com.br/api/oauth/token';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Itau-Correlationid': String(Date.now()),
          'X-Itau-Flowid': String(Date.now())
        },
        body: `grant_type=client_credentials&client_id=${this.credentials.clientId}&client_secret=${this.credentials.clientSecret}&scope=cash_management`
      });

      const result = await response.json();
      return result.access_token || null;
    } catch (error) {
      console.error('Erro na autenticação Itaú:', error);
      return null;
    }
  }

  // Utilitários
  private formatDocument(document: string): string {
    return document.replace(/\D/g, '');
  }

  private formatCEP(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  private addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Consultar status do boleto
  async getBoletoStatus(boletoId: string): Promise<{ status: string; paidAt?: string; paidAmount?: number }> {
    // Implementar consulta de status baseada no banco
    switch (this.credentials.bankCode) {
      case '001':
        return this.getBBBoletoStatus(boletoId);
      case '341':
        return this.getItauBoletoStatus(boletoId);
      default:
        return { status: 'unknown' };
    }
  }

  private async getBBBoletoStatus(boletoId: string): Promise<{ status: string; paidAt?: string; paidAmount?: number }> {
    // Implementar consulta BB
    return { status: 'generated' };
  }

  private async getItauBoletoStatus(boletoId: string): Promise<{ status: string; paidAt?: string; paidAmount?: number }> {
    // Implementar consulta Itaú
    return { status: 'generated' };
  }

  // Cancelar boleto
  async cancelBoleto(boletoId: string): Promise<{ success: boolean; error?: string }> {
    // Implementar cancelamento baseado no banco
    switch (this.credentials.bankCode) {
      case '001':
        return this.cancelBBBoleto(boletoId);
      case '341':
        return this.cancelItauBoleto(boletoId);
      default:
        return { success: false, error: 'Banco não suportado' };
    }
  }

  private async cancelBBBoleto(boletoId: string): Promise<{ success: boolean; error?: string }> {
    // Implementar cancelamento BB
    return { success: true };
  }

  private async cancelItauBoleto(boletoId: string): Promise<{ success: boolean; error?: string }> {
    // Implementar cancelamento Itaú
    return { success: true };
  }
}
