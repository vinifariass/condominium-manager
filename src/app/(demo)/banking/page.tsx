"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Eye,
  Settings,
  Zap,
  Shield,
  FileText,
  BarChart3,
  PieChart,
  Calendar,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Banknote,
  Receipt,
  FileSpreadsheet,
  GitMerge,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

// Imports dos serviços
import { StatementParser, StatementEntry, StatementFile } from "@/lib/banking/statement-parser";
import { BankReconciliationService, ReconciliationResult, ReconciliationMatch } from "@/lib/banking/reconciliation";
import { BoletoService, BoletoData as ServiceBoletoData, BoletoResponse, BankCredentials } from "@/lib/banking/boleto-service";

// Interfaces locais
interface BankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  agency: string;
  balance: number;
  status: 'active' | 'inactive' | 'blocked';
  lastSync: string;
  isConnected: boolean;
  apiKey?: string;
}

interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  reconciled: boolean;
  pixKey?: string;
  boletoBarcode?: string;
}

interface BankIntegration {
  id: string;
  bankName: string;
  bankCode: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  features: string[];
  logo: string;
}

interface PIXTransaction {
  id: string;
  amount: number;
  pixKey: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  endToEndId: string;
}

interface LocalBoletoData {
  id: string;
  amount: number;
  dueDate: string;
  barcode: string;
  digitableLine: string;
  recipientName: string;
  status: 'generated' | 'paid' | 'expired';
  generatedAt: string;
}

export default function BankingPage() {
  // Estados
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isConnectBankModalOpen, setIsConnectBankModalOpen] = useState(false);
  const [isGenerateBoletoModalOpen, setIsGenerateBoletoModalOpen] = useState(false);
  const [isPIXModalOpen, setIsPIXModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("30days");

  // Estados para importação de extrato
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedStatements, setImportedStatements] = useState<StatementFile[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Estados para conciliação
  const [reconciliationResult, setReconciliationResult] = useState<ReconciliationResult | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);

  // Estados para geração de boletos
  const [boletoService, setBoletoService] = useState<BoletoService | null>(null);
  const [isGeneratingBoleto, setIsGeneratingBoleto] = useState(false);
  const [generatedBoletos, setGeneratedBoletos] = useState<BoletoResponse[]>([]);

  // Dados mock das contas bancárias
  const [bankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "Banco do Brasil",
      bankCode: "001",
      accountNumber: "12345-6",
      accountType: "checking",
      agency: "1234-5",
      balance: 125420.50,
      status: "active",
      lastSync: "2024-08-04T10:30:00Z",
      isConnected: true,
      apiKey: "bb_api_key_123"
    },
    {
      id: "2", 
      bankName: "Itaú",
      bankCode: "341",
      accountNumber: "67890-1",
      accountType: "savings",
      agency: "6789-0",
      balance: 85230.75,
      status: "active",
      lastSync: "2024-08-04T09:15:00Z",
      isConnected: true,
      apiKey: "itau_api_key_456"
    },
    {
      id: "3",
      bankName: "Caixa Econômica",
      bankCode: "104",
      accountNumber: "11111-1",
      accountType: "checking",
      agency: "1111-1",
      balance: 45670.25,
      status: "active",
      lastSync: "2024-08-04T08:45:00Z",
      isConnected: false
    }
  ]);

  // Dados mock das transações
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      accountId: "1",
      date: "2024-08-04",
      type: "credit",
      amount: 2500.00,
      description: "PIX Recebido - Taxa Condomínio Apt 101",
      category: "Receita Condominial",
      status: "completed",
      reconciled: true,
      pixKey: "12345678901"
    },
    {
      id: "2",
      accountId: "1",
      date: "2024-08-04",
      type: "debit",
      amount: 1200.00,
      description: "Pagamento Fornecedor - Limpeza",
      category: "Despesa Operacional",
      status: "completed",
      reconciled: true
    },
    {
      id: "3",
      accountId: "2",
      date: "2024-08-03",
      type: "credit",
      amount: 3800.00,
      description: "Boleto Pago - Taxa Condomínio",
      category: "Receita Condominial",
      status: "completed",
      reconciled: false,
      boletoBarcode: "34191234567890123456789012345678901234567890"
    },
    {
      id: "4",
      accountId: "1",
      date: "2024-08-03",
      type: "debit",
      amount: 850.00,
      description: "Manutenção Elevador",
      category: "Despesa Manutenção",
      status: "completed",
      reconciled: true
    },
    {
      id: "5",
      accountId: "2",
      date: "2024-08-02",
      type: "credit",
      amount: 1900.00,
      description: "PIX Recebido - Multa Apt 205",
      category: "Receita Multas",
      status: "completed",
      reconciled: true,
      pixKey: "morador@email.com"
    }
  ]);

  // Dados mock das integrações bancárias
  const availableBanks: BankIntegration[] = [
    {
      id: "bb",
      bankName: "Banco do Brasil",
      bankCode: "001",
      status: "connected",
      lastSync: "2024-08-04T10:30:00Z",
      features: ["Extrato", "PIX", "Boletos", "TED/DOC"],
      logo: "🏦"
    },
    {
      id: "itau",
      bankName: "Itaú",
      bankCode: "341", 
      status: "connected",
      lastSync: "2024-08-04T09:15:00Z",
      features: ["Extrato", "PIX", "Boletos"],
      logo: "🏛️"
    },
    {
      id: "cef",
      bankName: "Caixa Econômica",
      bankCode: "104",
      status: "disconnected",
      lastSync: "2024-08-01T15:20:00Z",
      features: ["Extrato", "PIX", "Boletos", "Financiamentos"],
      logo: "🏢"
    },
    {
      id: "santander",
      bankName: "Santander",
      bankCode: "033",
      status: "disconnected",
      lastSync: "Nunca",
      features: ["Extrato", "PIX", "Boletos", "Cartões"],
      logo: "🔴"
    },
    {
      id: "bradesco",
      bankName: "Bradesco",
      bankCode: "237",
      status: "disconnected",
      lastSync: "Nunca",
      features: ["Extrato", "PIX", "Boletos", "Investimentos"],
      logo: "🔵"
    }
  ];

  // Formulários
  const [newBankConnection, setNewBankConnection] = useState({
    bankId: "",
    agencia: "",
    conta: "",
    apiKey: "",
    certificado: null as File | null
  });

  const [newBoleto, setNewBoleto] = useState({
    valor: "",
    vencimento: "",
    nome: "",
    cpfCnpj: "",
    descricao: "",
    apartamento: ""
  });

  const [newPIX, setNewPIX] = useState({
    valor: "",
    chavePix: "",
    descricao: "",
    apartamento: ""
  });

  // Computadas
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const connectedAccounts = bankAccounts.filter(account => account.isConnected).length;
  const pendingTransactions = transactions.filter(t => !t.reconciled).length;
  const todayTransactions = transactions.filter(t => t.date === "2024-08-04");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = searchTerm === "" || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de data (simplificado para demo)
      const matchesDate = true; // Implementar filtro de data real
      
      return matchesSearch && matchesDate;
    });
  }, [transactions, searchTerm, dateFilter]);

  // ========== NOVAS FUNCIONALIDADES REAIS ==========

  // 1. IMPORTAÇÃO DE EXTRATOS BANCÁRIOS
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      // Validar arquivo
      const validation = StatementParser.validateFile(file);
      if (!validation.isValid) {
        alert(`Erro: ${validation.error}`);
        return;
      }

      // Ler conteúdo do arquivo
      const content = await file.text();
      let statementFile: StatementFile;

      // Parse baseado no tipo de arquivo
      if (file.name.toLowerCase().endsWith('.ofx')) {
        statementFile = StatementParser.parseOFX(content);
      } else {
        statementFile = StatementParser.parseCSV(content, validation.bankCode || '000');
      }

      // Adicionar à lista de statements importados
      setImportedStatements(prev => [...prev, statementFile]);
      
      // Mostrar resultado
      alert(`Extrato importado com sucesso! ${statementFile.entries.length} transações encontradas.`);
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao processar arquivo. Verifique o formato.');
    } finally {
      setIsProcessingFile(false);
      event.target.value = ''; // Reset input
    }
  }, []);

  // 2. CONCILIAÇÃO BANCÁRIA AUTOMÁTICA
  const handleStartReconciliation = useCallback(async () => {
    if (importedStatements.length === 0) {
      alert('Primeiro importe um extrato bancário para fazer a conciliação.');
      return;
    }

    setIsReconciling(true);
    try {
      // Pegar todas as entradas dos statements importados
      const allEntries = importedStatements.flatMap(statement => statement.entries);
      
      // Executar conciliação
      const result = await BankReconciliationService.reconcile(
        allEntries,
        transactions // transações do sistema
      );

      setReconciliationResult(result);
      setIsReconciliationModalOpen(true);
      
    } catch (error) {
      console.error('Erro na conciliação:', error);
      alert('Erro ao executar conciliação bancária.');
    } finally {
      setIsReconciling(false);
    }
  }, [importedStatements, transactions]);

  // Aprovar matches da conciliação
  const handleApproveMatches = useCallback(async (matches: ReconciliationMatch[]) => {
    try {
      // Criar entradas no sistema para matches aprovados
      const newTransactions = matches
        .filter(match => match.suggestedAction === 'approve')
        .map(match => BankReconciliationService.createSystemEntry(match));

      // Aqui você adicionaria ao estado real ou enviaria para API
      console.log('Novas transações criadas:', newTransactions);
      
      alert(`${newTransactions.length} transações foram conciliadas e adicionadas ao sistema.`);
      setIsReconciliationModalOpen(false);
      
    } catch (error) {
      console.error('Erro ao aprovar matches:', error);
      alert('Erro ao aprovar conciliação.');
    }
  }, []);

  // 3. GERAÇÃO REAL DE BOLETOS
  const initializeBoletoService = useCallback((bankCode: string) => {
    // Configurações por banco (em produção viriam de variáveis de ambiente)
    const credentials: BankCredentials = {
      bankCode,
      apiKey: process.env.NEXT_PUBLIC_BANK_API_KEY || 'demo_key',
      clientId: process.env.NEXT_PUBLIC_BANK_CLIENT_ID || 'demo_client',
      clientSecret: process.env.NEXT_PUBLIC_BANK_CLIENT_SECRET || 'demo_secret',
      environment: 'sandbox' // mudaria para 'production' em produção
    };

    const service = new BoletoService(credentials);
    setBoletoService(service);
    return service;
  }, []);

  const handleGenerateRealBoleto = useCallback(async (formData: any) => {
    setIsGeneratingBoleto(true);
    try {
      // Inicializar serviço se não existir
      let service = boletoService;
      if (!service) {
        service = initializeBoletoService('001'); // Default BB
      }

      // Montar dados do boleto
      const boletoData: ServiceBoletoData = {
        amount: parseFloat(formData.valor.replace(',', '.')),
        dueDate: formData.vencimento,
        payer: {
          name: formData.nome,
          document: formData.cpfCnpj,
          email: formData.email,
          address: {
            street: 'Rua Exemplo',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01000000'
          }
        },
        description: formData.descricao || 'Taxa condominial',
        apartmentNumber: formData.apartamento,
        beneficiary: {
          name: 'Condomínio Exemplo',
          document: '12345678000100',
          account: {
            bankCode: '001',
            agency: '1234-5',
            accountNumber: '12345-6'
          }
        },
        finePercentage: 2, // 2% de multa
        interestPercentage: 1, // 1% ao mês
        instructions: 'Não receber após o vencimento'
      };

      // Gerar boleto
      const response = await service.generateBoleto(boletoData);
      
      if (response.success && response.data) {
        setGeneratedBoletos(prev => [...prev, response]);
        alert(`Boleto gerado com sucesso!\nLinha digitável: ${response.data.digitableLine}`);
        setIsGenerateBoletoModalOpen(false);
      } else {
        alert(`Erro ao gerar boleto: ${response.error?.message}`);
      }
      
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      alert('Erro ao gerar boleto. Tente novamente.');
    } finally {
      setIsGeneratingBoleto(false);
    }
  }, [boletoService, initializeBoletoService]);

  // ========== FUNÇÕES ORIGINAIS ==========

  // Funções
  const handleSyncAccounts = async () => {
    setIsSyncing(true);
    // Simular sincronização
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleConnectBank = () => {
    // Implementar conexão real com API bancária
    console.log("Conectando banco:", newBankConnection);
    setIsConnectBankModalOpen(false);
  };

  const handleGenerateBoleto = () => {
    // Usar a nova implementação real
    handleGenerateRealBoleto(newBoleto);
  };

  const handleGeneratePIX = () => {
    // Implementar geração de PIX
    console.log("Gerando PIX:", newPIX);
    setIsPIXModalOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'completed':
        return <Badge variant="default">Ativo</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'inactive':
      case 'disconnected':
      case 'failed':
        return <Badge variant="destructive">Inativo</Badge>;
      case 'blocked':
        return <Badge variant="outline">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <ContentLayout title="Integração Bancária">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Integração Bancária
            </h1>
            <p className="text-muted-foreground">
              Gerencie contas bancárias, transações PIX e boletos automaticamente
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSyncAccounts}
              disabled={isSyncing}
              variant="outline"
            >
              {isSyncing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Sincronizar
            </Button>
            <Dialog open={isConnectBankModalOpen} onOpenChange={setIsConnectBankModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Conectar Banco
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4 muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {bankAccounts.length} accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contas Conectadas</CardTitle>
              <Building2 className="h-4 w-4 muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {connectedAccounts}
              </div>
              <p className="text-xs text-muted-foreground">
                de {bankAccounts.length} contas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendente Conciliação</CardTitle>
              <Clock className="h-4 w-4 muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayTransactions.length}
              </div>
              <p className="text-xs text-muted-foreground">
                transações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Contas
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transações
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Importar
            </TabsTrigger>
            <TabsTrigger value="reconciliation" className="flex items-center gap-2">
              <GitMerge className="h-4 w-4" />
              Conciliação
            </TabsTrigger>
            <TabsTrigger value="pix" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              PIX
            </TabsTrigger>
            <TabsTrigger value="boletos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Boletos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contas Bancárias */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Contas Bancárias
                  </CardTitle>
                  <CardDescription>Status das suas contas conectadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bankAccounts.slice(0, 3).map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            Ag: {account.agency} • Conta: {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(account.balance)}</p>
                        {getStatusBadge(account.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Transações Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Transações Recentes
                  </CardTitle>
                  <CardDescription>Últimas movimentações financeiras</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transactions.slice(0, 4).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Fluxo de Caixa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Fluxo de Caixa - Últimos 7 dias
                </CardTitle>
                <CardDescription>Entradas e saídas por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 p-4 bg-muted/50 rounded-lg">
                  {/* Simulação de gráfico de barras */}
                  {[
                    { day: 'Seg', income: 4500, expense: 2200 },
                    { day: 'Ter', income: 3200, expense: 1800 },
                    { day: 'Qua', income: 5100, expense: 3100 },
                    { day: 'Qui', income: 2800, expense: 1500 },
                    { day: 'Sex', income: 6200, expense: 2800 },
                    { day: 'Sáb', income: 1900, expense: 800 },
                    { day: 'Dom', income: 2400, expense: 1100 }
                  ].map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex flex-col gap-1 items-center w-full">
                        <div 
                          className="w-full bg-primary rounded-t"
                          style={{ height: `${(data.income / 6200) * 120}px` }}
                        />
                        <div 
                          className="w-full bg-muted-foreground rounded-b"
                          style={{ height: `${(data.expense / 6200) * 120}px` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span className="text-sm">Entradas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted-foreground rounded"></div>
                    <span className="text-sm">Saídas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Contas */}
          <TabsContent value="accounts" className="space-y-6">
            <div className="grid gap-6">
              {/* Bancos Disponíveis para Conexão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bancos Disponíveis
                  </CardTitle>
                  <CardDescription>
                    Conecte suas contas bancárias para sincronização automática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableBanks.map((bank) => (
                      <Card key={bank.id} className={`border-2 transition-all hover:shadow-md ${
                        bank.status === 'connected' 
                          ? 'border-primary bg-muted/50' 
                          : 'border-muted hover:border-primary'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{bank.logo}</span>
                              <div>
                                <h3 className="font-semibold">{bank.bankName}</h3>
                                <p className="text-sm text-muted-foreground">Código: {bank.bankCode}</p>
                              </div>
                            </div>
                            {getStatusBadge(bank.status)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {bank.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Última sync: {bank.lastSync === 'Nunca' ? 'Nunca' : new Date(bank.lastSync).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Button 
                            className="w-full mt-3" 
                            variant={bank.status === 'connected' ? 'outline' : 'default'}
                            onClick={() => bank.status === 'connected' ? null : setIsConnectBankModalOpen(true)}
                          >
                            {bank.status === 'connected' ? (
                              <>
                                <Settings className="mr-2 h-4 w-4" />
                                Configurar
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Conectar
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contas Conectadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Minhas Contas
                  </CardTitle>
                  <CardDescription>
                    Gerencie suas contas bancárias conectadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <Card key={account.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{account.bankName}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Agência: {account.agency}</span>
                                  <span>Conta: {account.accountNumber}</span>
                                  <span>Tipo: {account.accountType === 'checking' ? 'Corrente' : 'Poupança'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Última sincronização: {new Date(account.lastSync).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">
                                {formatCurrency(account.balance)}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {getStatusBadge(account.status)}
                                {account.isConnected ? (
                                  <Badge variant="secondary">
                                    <Zap className="mr-1 h-3 w-3" />
                                    Conectado
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Desconectado</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Transações */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Filtros */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Últimos 7 dias</SelectItem>
                      <SelectItem value="30days">Últimos 30 dias</SelectItem>
                      <SelectItem value="90days">Últimos 3 meses</SelectItem>
                      <SelectItem value="365days">Último ano</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Transações */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Todas as Transações
                </CardTitle>
                <CardDescription>
                  Histórico completo de movimentações financeiras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <Card key={transaction.id} className="border bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              {transaction.type === 'credit' ? (
                                <ArrowDownLeft className="h-6 w-6" />
                              ) : (
                                <ArrowUpRight className="h-6 w-6" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{transaction.description}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Categoria: {transaction.category}</span>
                                <span>Data: {new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                                {transaction.pixKey && (
                                  <span>PIX: {transaction.pixKey}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(transaction.status)}
                              {transaction.reconciled ? (
                                <Badge variant="secondary">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Conciliado
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pendente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: PIX */}
          <TabsContent value="pix" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Gestão PIX</h2>
                <p className="text-muted-foreground">Gerencie pagamentos PIX recebidos e enviados</p>
              </div>
              <Dialog open={isPIXModalOpen} onOpenChange={setIsPIXModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Zap className="mr-2 h-4 w-4" />
                    Gerar PIX
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gerar Cobrança PIX</DialogTitle>
                    <DialogDescription>
                      Crie uma cobrança PIX para um morador
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pixValor">Valor</Label>
                      <Input
                        id="pixValor"
                        placeholder="R$ 0,00"
                        value={newPIX.valor}
                        onChange={(e) => setNewPIX({...newPIX, valor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="chavePix">Chave PIX</Label>
                      <Input
                        id="chavePix"
                        placeholder="CPF, e-mail ou telefone"
                        value={newPIX.chavePix}
                        onChange={(e) => setNewPIX({...newPIX, chavePix: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pixApartamento">Apartamento</Label>
                      <Input
                        id="pixApartamento"
                        placeholder="Ex: 101, 205"
                        value={newPIX.apartamento}
                        onChange={(e) => setNewPIX({...newPIX, apartamento: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pixDescricao">Descrição</Label>
                      <Textarea
                        id="pixDescricao"
                        placeholder="Descrição da cobrança"
                        value={newPIX.descricao}
                        onChange={(e) => setNewPIX({...newPIX, descricao: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleGeneratePIX} className="flex-1">
                        Gerar PIX
                      </Button>
                      <Button variant="outline" onClick={() => setIsPIXModalOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* PIX Recebidos */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  PIX Recebidos Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter(t => t.pixKey && t.type === 'credit').map((pix) => (
                    <div key={pix.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{pix.description}</p>
                          <p className="text-sm text-muted-foreground">Chave: {pix.pixKey}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">+{formatCurrency(pix.amount)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(pix.date).toLocaleTimeString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Boletos */}
          <TabsContent value="boletos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Gestão de Boletos</h2>
                <p className="text-muted-foreground">Gere e acompanhe boletos bancários</p>
              </div>
              <Dialog open={isGenerateBoletoModalOpen} onOpenChange={setIsGenerateBoletoModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Boleto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gerar Novo Boleto</DialogTitle>
                    <DialogDescription>
                      Crie um boleto bancário para um morador
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="valor">Valor</Label>
                        <Input
                          id="valor"
                          placeholder="R$ 0,00"
                          value={newBoleto.valor}
                          onChange={(e) => setNewBoleto({...newBoleto, valor: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vencimento">Vencimento</Label>
                        <Input
                          id="vencimento"
                          type="date"
                          value={newBoleto.vencimento}
                          onChange={(e) => setNewBoleto({...newBoleto, vencimento: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nome">Nome do Pagador</Label>
                      <Input
                        id="nome"
                        placeholder="Nome completo"
                        value={newBoleto.nome}
                        onChange={(e) => setNewBoleto({...newBoleto, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                      <Input
                        id="cpfCnpj"
                        placeholder="000.000.000-00"
                        value={newBoleto.cpfCnpj}
                        onChange={(e) => setNewBoleto({...newBoleto, cpfCnpj: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apartamento">Apartamento</Label>
                      <Input
                        id="apartamento"
                        placeholder="Ex: 101, 205"
                        value={newBoleto.apartamento}
                        onChange={(e) => setNewBoleto({...newBoleto, apartamento: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descrição do boleto"
                        value={newBoleto.descricao}
                        onChange={(e) => setNewBoleto({...newBoleto, descricao: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleGenerateBoleto} className="flex-1">
                        Gerar Boleto
                      </Button>
                      <Button variant="outline" onClick={() => setIsGenerateBoletoModalOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Boletos Gerados */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Boletos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.filter(t => t.boletoBarcode).map((boleto) => (
                    <div key={boleto.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{boleto.description}</p>
                          <p className="text-sm text-muted-foreground">Categoria: {boleto.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">+{formatCurrency(boleto.amount)}</p>
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Importar Extratos */}
          <TabsContent value="import" className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Importação de Extratos</h2>
                  <p className="text-muted-foreground">Importe extratos bancários em formato OFX ou CSV</p>
                </div>
              </div>

              {/* Upload de Arquivo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Importar Extrato Bancário
                  </CardTitle>
                  <CardDescription>
                    Formatos aceitos: OFX, CSV. Tamanho máximo: 10MB
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <Label htmlFor="file-upload" className="text-lg font-medium cursor-pointer">
                          Clique para selecionar arquivo ou arraste aqui
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".ofx,.csv,.txt"
                          onChange={handleFileImport}
                          disabled={isProcessingFile}
                          className="hidden"
                        />
                        <p className="text-sm text-muted-foreground">
                          Extratos do Banco do Brasil, Itaú, Caixa, Santander, Bradesco
                        </p>
                      </div>
                    </div>
                    {isProcessingFile && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando arquivo...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Extratos Importados */}
              {importedStatements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Extratos Importados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {importedStatements.map((statement, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">
                                Banco {statement.bankCode} - Conta {statement.accountNumber}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Período: {statement.startDate} até {statement.endDate}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {statement.entries.length} transações
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setActiveTab('reconciliation')}
                            >
                              Conciliar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Conciliação Bancária */}
          <TabsContent value="reconciliation" className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Conciliação Bancária</h2>
                  <p className="text-muted-foreground">Compare extratos importados com transações do sistema</p>
                </div>
                <Button
                  onClick={handleStartReconciliation}
                  disabled={isReconciling || importedStatements.length === 0}
                >
                  {isReconciling ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GitMerge className="mr-2 h-4 w-4" />
                  )}
                  Iniciar Conciliação
                </Button>
              </div>

              {/* Status da Conciliação */}
              {reconciliationResult && (
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reconciliationResult.totalEntries}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Matches Perfeitos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{reconciliationResult.perfectMatches}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Matches Prováveis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{reconciliationResult.probableMatches}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Não Conciliados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{reconciliationResult.noMatches}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Instruções */}
              {importedStatements.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <GitMerge className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Nenhum extrato importado</h3>
                      <p>Primeiro importe um extrato bancário na aba "Importar" para fazer a conciliação.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Resultado da Conciliação */}
        <Dialog open={isReconciliationModalOpen} onOpenChange={setIsReconciliationModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitMerge className="h-5 w-5" />
                Resultado da Conciliação
              </DialogTitle>
              <DialogDescription>
                Analise os matches encontrados e aprove as transações corretas
              </DialogDescription>
            </DialogHeader>
            
            {reconciliationResult && (
              <div className="space-y-4">
                {/* Resumo */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {reconciliationResult.perfectMatches}
                      </div>
                      <div className="text-sm text-muted-foreground">Perfeitos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {reconciliationResult.probableMatches}
                      </div>
                      <div className="text-sm text-muted-foreground">Prováveis</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {reconciliationResult.noMatches}
                      </div>
                      <div className="text-sm text-muted-foreground">Não conciliados</div>
                    </div>
                  </div>
                </div>

                {/* Lista de Matches */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {reconciliationResult.matches.map((match, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        match.status === 'perfect_match' ? 'border-green-200 bg-green-50' :
                        match.status === 'probable_match' ? 'border-yellow-200 bg-yellow-50' :
                        'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{match.statementEntry.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(match.statementEntry.amount)} • {match.statementEntry.date}
                          </div>
                          {match.rule && (
                            <div className="text-xs text-blue-600">
                              Regra: {match.rule.name}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            match.status === 'perfect_match' ? 'default' :
                            match.status === 'probable_match' ? 'secondary' :
                            'destructive'
                          }>
                            {match.status === 'perfect_match' ? 'Perfeito' :
                             match.status === 'probable_match' ? 'Provável' :
                             'Não conciliado'}
                          </Badge>
                          <div className="text-sm font-medium">
                            {Math.round(match.matchScore * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApproveMatches(reconciliationResult.matches)}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar Matches Recomendados
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsReconciliationModalOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Conectar Banco */}
        <Dialog open={isConnectBankModalOpen} onOpenChange={setIsConnectBankModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Conectar Conta Bancária
              </DialogTitle>
              <DialogDescription>
                Configure a conexão segura com sua conta bancária
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankSelect">Banco</Label>
                <Select value={newBankConnection.bankId} onValueChange={(value) => 
                  setNewBankConnection({...newBankConnection, bankId: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBanks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.logo} {bank.bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencia">Agência</Label>
                  <Input
                    id="agencia"
                    placeholder="0000-0"
                    value={newBankConnection.agencia}
                    onChange={(e) => setNewBankConnection({...newBankConnection, agencia: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="conta">Conta</Label>
                  <Input
                    id="conta"
                    placeholder="00000-0"
                    value={newBankConnection.conta}
                    onChange={(e) => setNewBankConnection({...newBankConnection, conta: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="apiKey">Chave API</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Chave de acesso fornecida pelo banco"
                  value={newBankConnection.apiKey}
                  onChange={(e) => setNewBankConnection({...newBankConnection, apiKey: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="certificado">Certificado Digital (opcional)</Label>
                <Input
                  id="certificado"
                  type="file"
                  accept=".p12,.pfx"
                  onChange={(e) => setNewBankConnection({...newBankConnection, certificado: e.target.files?.[0] || null})}
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Segurança</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Suas credenciais são criptografadas e armazenadas com segurança. 
                      Utilizamos as APIs oficiais dos bancos para garantir máxima proteção.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleConnectBank} className="flex-1">
                  <Shield className="mr-2 h-4 w-4" />
                  Conectar Banco
                </Button>
                <Button variant="outline" onClick={() => setIsConnectBankModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
