// Serviço para conciliação bancária automática
import { StatementEntry } from './statement-parser';

export interface ReconciliationRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    amountRange?: { min: number; max: number };
    descriptionKeywords?: string[];
    dateRange?: { start: string; end: string };
    type?: 'credit' | 'debit';
  };
  actions: {
    category: string;
    autoApprove: boolean;
    createEntry?: boolean;
  };
}

export interface ReconciliationMatch {
  statementEntry: StatementEntry;
  systemEntry?: any; // Entrada do sistema
  matchScore: number;
  status: 'perfect_match' | 'probable_match' | 'no_match' | 'duplicate';
  suggestedAction: 'approve' | 'review' | 'reject';
  rule?: ReconciliationRule;
}

export interface ReconciliationResult {
  totalEntries: number;
  perfectMatches: number;
  probableMatches: number;
  noMatches: number;
  duplicates: number;
  matches: ReconciliationMatch[];
  summary: {
    totalAmount: number;
    reconciledAmount: number;
    pendingAmount: number;
  };
}

export class BankReconciliationService {
  private static defaultRules: ReconciliationRule[] = [
    {
      id: 'pix-condominio',
      name: 'PIX Taxa Condomínio',
      description: 'PIX recebidos para pagamento de taxa condominial',
      conditions: {
        type: 'credit',
        descriptionKeywords: ['pix', 'condominio', 'taxa'],
        amountRange: { min: 100, max: 5000 }
      },
      actions: {
        category: 'Receita Condominial',
        autoApprove: true,
        createEntry: true
      }
    },
    {
      id: 'boleto-pagamento',
      name: 'Boleto Pago',
      description: 'Boletos pagos por moradores',
      conditions: {
        type: 'credit',
        descriptionKeywords: ['boleto', 'pagamento', 'cobranca']
      },
      actions: {
        category: 'Receita Condominial',
        autoApprove: true,
        createEntry: true
      }
    },
    {
      id: 'despesa-energia',
      name: 'Conta de Energia',
      description: 'Pagamento de conta de energia elétrica',
      conditions: {
        type: 'debit',
        descriptionKeywords: ['copel', 'elektro', 'energia', 'luz', 'cemig']
      },
      actions: {
        category: 'Despesa Energia',
        autoApprove: true,
        createEntry: true
      }
    },
    {
      id: 'despesa-agua',
      name: 'Conta de Água',
      description: 'Pagamento de conta de água',
      conditions: {
        type: 'debit',
        descriptionKeywords: ['sanepar', 'sabesp', 'agua', 'saneamento']
      },
      actions: {
        category: 'Despesa Água',
        autoApprove: true,
        createEntry: true
      }
    },
    {
      id: 'manutencao',
      name: 'Manutenção Predial',
      description: 'Despesas com manutenção do prédio',
      conditions: {
        type: 'debit',
        descriptionKeywords: ['manutencao', 'reparo', 'reforma', 'pintura', 'elevador']
      },
      actions: {
        category: 'Despesa Manutenção',
        autoApprove: false,
        createEntry: true
      }
    },
    {
      id: 'taxa-bancaria',
      name: 'Taxas Bancárias',
      description: 'Tarifas e taxas bancárias',
      conditions: {
        type: 'debit',
        descriptionKeywords: ['tarifa', 'taxa', 'anuidade', 'bancaria'],
        amountRange: { min: 0, max: 100 }
      },
      actions: {
        category: 'Taxa Bancária',
        autoApprove: true,
        createEntry: true
      }
    }
  ];

  // Executa conciliação completa
  static async reconcile(
    statementEntries: StatementEntry[],
    systemEntries: any[] = [],
    customRules: ReconciliationRule[] = []
  ): Promise<ReconciliationResult> {
    const rules = [...this.defaultRules, ...customRules];
    const matches: ReconciliationMatch[] = [];
    
    let perfectMatches = 0;
    let probableMatches = 0;
    let noMatches = 0;
    let duplicates = 0;

    for (const statementEntry of statementEntries) {
      // Verificar duplicatas
      const isDuplicate = this.checkDuplicate(statementEntry, systemEntries);
      if (isDuplicate) {
        matches.push({
          statementEntry,
          matchScore: 1.0,
          status: 'duplicate',
          suggestedAction: 'reject'
        });
        duplicates++;
        continue;
      }

      // Tentar match com entradas do sistema
      const systemMatch = this.findSystemMatch(statementEntry, systemEntries);
      
      // Aplicar regras de conciliação
      const ruleMatch = this.applyRules(statementEntry, rules);

      let match: ReconciliationMatch;

      if (systemMatch && systemMatch.score >= 0.9) {
        // Match perfeito com entrada do sistema
        match = {
          statementEntry,
          systemEntry: systemMatch.entry,
          matchScore: systemMatch.score,
          status: 'perfect_match',
          suggestedAction: 'approve',
          rule: ruleMatch || undefined
        };
        perfectMatches++;
      } else if (systemMatch && systemMatch.score >= 0.6) {
        // Match provável
        match = {
          statementEntry,
          systemEntry: systemMatch.entry,
          matchScore: systemMatch.score,
          status: 'probable_match',
          suggestedAction: 'review',
          rule: ruleMatch || undefined
        };
        probableMatches++;
      } else if (ruleMatch && ruleMatch.actions.autoApprove) {
        // Regra com aprovação automática
        match = {
          statementEntry,
          matchScore: 0.8,
          status: 'probable_match',
          suggestedAction: 'approve',
          rule: ruleMatch
        };
        probableMatches++;
      } else {
        // Sem match
        match = {
          statementEntry,
          matchScore: 0,
          status: 'no_match',
          suggestedAction: 'review',
          rule: ruleMatch || undefined
        };
        noMatches++;
      }

      matches.push(match);
    }

    // Calcular resumo financeiro
    const totalAmount = statementEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const reconciledAmount = matches
      .filter(m => m.status === 'perfect_match' || (m.status === 'probable_match' && m.suggestedAction === 'approve'))
      .reduce((sum, m) => sum + m.statementEntry.amount, 0);
    const pendingAmount = totalAmount - reconciledAmount;

    return {
      totalEntries: statementEntries.length,
      perfectMatches,
      probableMatches,
      noMatches,
      duplicates,
      matches,
      summary: {
        totalAmount,
        reconciledAmount,
        pendingAmount
      }
    };
  }

  // Verificar se é duplicata
  private static checkDuplicate(statementEntry: StatementEntry, systemEntries: any[]): boolean {
    return systemEntries.some(entry => 
      entry.date === statementEntry.date &&
      Math.abs(entry.amount - statementEntry.amount) < 0.01 &&
      this.calculateStringSimilarity(entry.description, statementEntry.description) > 0.8
    );
  }

  // Encontrar match no sistema
  private static findSystemMatch(statementEntry: StatementEntry, systemEntries: any[]): { entry: any; score: number } | null {
    let bestMatch: { entry: any; score: number } | null = null;

    for (const systemEntry of systemEntries) {
      const score = this.calculateMatchScore(statementEntry, systemEntry);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { entry: systemEntry, score };
      }
    }

    return bestMatch && bestMatch.score > 0.5 ? bestMatch : null;
  }

  // Calcular score de compatibilidade
  private static calculateMatchScore(statementEntry: StatementEntry, systemEntry: any): number {
    let score = 0;

    // Comparar valores (peso 40%)
    const amountDiff = Math.abs(statementEntry.amount - systemEntry.amount);
    const amountScore = amountDiff < 0.01 ? 1 : Math.max(0, 1 - (amountDiff / Math.max(statementEntry.amount, systemEntry.amount)));
    score += amountScore * 0.4;

    // Comparar datas (peso 30%)
    const dateDiff = Math.abs(new Date(statementEntry.date).getTime() - new Date(systemEntry.date).getTime());
    const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
    const dateScore = daysDiff <= 1 ? 1 : Math.max(0, 1 - (daysDiff / 7));
    score += dateScore * 0.3;

    // Comparar descrições (peso 30%)
    const descriptionScore = this.calculateStringSimilarity(
      statementEntry.description.toLowerCase(),
      systemEntry.description.toLowerCase()
    );
    score += descriptionScore * 0.3;

    return score;
  }

  // Aplicar regras de conciliação
  private static applyRules(statementEntry: StatementEntry, rules: ReconciliationRule[]): ReconciliationRule | null {
    for (const rule of rules) {
      if (this.matchesRule(statementEntry, rule)) {
        return rule;
      }
    }
    return null;
  }

  // Verificar se entrada combina com regra
  private static matchesRule(entry: StatementEntry, rule: ReconciliationRule): boolean {
    const { conditions } = rule;

    // Verificar tipo
    if (conditions.type && entry.type !== conditions.type) {
      return false;
    }

    // Verificar valor
    if (conditions.amountRange) {
      if (entry.amount < conditions.amountRange.min || entry.amount > conditions.amountRange.max) {
        return false;
      }
    }

    // Verificar palavras-chave na descrição
    if (conditions.descriptionKeywords) {
      const description = entry.description.toLowerCase();
      const hasKeyword = conditions.descriptionKeywords.some(keyword => 
        description.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) {
        return false;
      }
    }

    // Verificar data
    if (conditions.dateRange) {
      const entryDate = new Date(entry.date);
      const startDate = new Date(conditions.dateRange.start);
      const endDate = new Date(conditions.dateRange.end);
      if (entryDate < startDate || entryDate > endDate) {
        return false;
      }
    }

    return true;
  }

  // Calcular similaridade entre strings
  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // Calcular distância de Levenshtein
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Criar entrada no sistema baseada na conciliação
  static createSystemEntry(match: ReconciliationMatch): any {
    const { statementEntry, rule } = match;
    
    return {
      id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: statementEntry.date,
      type: statementEntry.type,
      amount: statementEntry.amount,
      description: statementEntry.description,
      category: rule?.actions.category || statementEntry.category || 'Outros',
      status: 'completed',
      reconciled: true,
      source: 'bank_statement',
      rule: rule?.id,
      autoCreated: true,
      createdAt: new Date().toISOString()
    };
  }
}
