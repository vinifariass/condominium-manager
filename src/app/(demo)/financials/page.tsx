"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  Copy
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { 
  getFinancials, 
  getFinancialStats, 
  FINANCIAL_FILTER_OPTIONS,
  type FinancialData,
  type FinancialFilters 
} from "@/lib/actions/financial.actions";

export default function FinancialsPage() {
  // Estados para filtros e dados
  const [financials, setFinancials] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FinancialFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para modais
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalReceita: 0,
    totalDespesa: 0,
    saldo: 0,
    receitasPendentes: 0,
    despesasPendentes: 0,
    receitasAtrasadas: 0,
    despesasAtrasadas: 0,
    projecaoMensal: 0
  });

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [financialData, financialStats] = await Promise.all([
          getFinancials(filters),
          getFinancialStats()
        ]);
        setFinancials(financialData.financials);
        setStats(financialStats);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Função para atualizar filtros
  const updateFilter = (key: keyof FinancialFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({});
  };

  // Funções para modais e ações
  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: any) => {
    if (confirm(`Tem certeza que deseja excluir a transação "${transaction.description}"?`)) {
      // TODO: Implementar exclusão via action
      console.log('Excluindo transação:', transaction.id);
    }
  };

  const handleDuplicateTransaction = (transaction: any) => {
    // TODO: Implementar duplicação via action
    console.log('Duplicando transação:', transaction.id);
  };

  const closeModals = () => {
    setSelectedTransaction(null);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pago':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Pendente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Atrasado':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Cancelado':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Função para formatar valor
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar data
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  const transactions = [
    {
      id: 1,
      type: "INCOME",
      category: "Taxa Condominial",
      description: "Taxa condominial - Apt 101",
      amount: 450.00,
      dueDate: "2024-01-05",
      paidDate: "2024-01-03",
      status: "PAID",
      apartment: "101",
      resident: "Maria Silva",
      method: "PIX"
    },
    {
      id: 2,
      type: "EXPENSE",
      category: "Manutenção",
      description: "Reparo do elevador - Bloco A",
      amount: 1200.00,
      dueDate: "2024-01-10",
      paidDate: "2024-01-08",
      status: "PAID",
      supplier: "Elevadores Tech Ltda",
      method: "Transferência"
    },
    {
      id: 3,
      type: "INCOME",
      category: "Taxa Condominial",
      description: "Taxa condominial - Apt 201",
      amount: 450.00,
      dueDate: "2024-01-05",
      paidDate: null,
      status: "OVERDUE",
      apartment: "201",
      resident: "João Santos",
      method: null
    },
    {
      id: 4,
      type: "INCOME",
      category: "Multa",
      description: "Multa por barulho excessivo - Apt 302",
      amount: 100.00,
      dueDate: "2024-01-15",
      paidDate: "2024-01-12",
      status: "PAID",
      apartment: "302",
      resident: "Ana Costa",
      method: "Cartão"
    },
    {
      id: 5,
      type: "EXPENSE",
      category: "Limpeza",
      description: "Material de limpeza - Janeiro",
      amount: 350.00,
      dueDate: "2024-01-20",
      paidDate: null,
      status: "PENDING",
      supplier: "Limpeza & Cia",
      method: null
    },
    {
      id: 6,
      type: "INCOME",
      category: "Reserva",
      description: "Reserva Salão de Festas - Maria Silva",
      amount: 150.00,
      dueDate: "2024-01-15",
      paidDate: "2024-01-15",
      status: "PAID",
      apartment: "101",
      resident: "Maria Silva",
      method: "PIX"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "OVERDUE":
        return "text-red-600 bg-red-100";
      case "CANCELED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pago";
      case "PENDING":
        return "Pendente";
      case "OVERDUE":
        return "Vencido";
      case "CANCELED":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === "INCOME" && t.status === "PAID")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "EXPENSE" && t.status === "PAID")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingIncome = transactions
    .filter(t => t.type === "INCOME" && (t.status === "PENDING" || t.status === "OVERDUE"))
    .reduce((sum, t) => sum + t.amount, 0);

  const overdueCount = transactions.filter(t => t.status === "OVERDUE").length;

  return (
    <ContentLayout title="Financeiro">
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(totalIncome - totalExpenses).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Resultado do mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendências</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">R$ {pendingIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {overdueCount} vencidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receitas por Categoria</CardTitle>
              <CardDescription>Distribuição das receitas este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  transactions
                    .filter(t => t.type === "INCOME" && t.status === "PAID")
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>)
                ).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <span className="font-medium text-green-600">R$ {amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>Distribuição das despesas este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  transactions
                    .filter(t => t.type === "EXPENSE" && t.status === "PAID")
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>)
                ).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <span className="font-medium text-red-600">R$ {amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transações</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as movimentações financeiras
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por descrição, apartamento ou categoria..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              {/* Filtros aprimorados */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      Tipo
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Todos os tipos</DropdownMenuItem>
                    <DropdownMenuItem>Receita</DropdownMenuItem>
                    <DropdownMenuItem>Despesa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-40 justify-between">
                      Status
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Todos os status</DropdownMenuItem>
                    <DropdownMenuItem>Pago</DropdownMenuItem>
                    <DropdownMenuItem>Pendente</DropdownMenuItem>
                    <DropdownMenuItem>Vencido</DropdownMenuItem>
                    <DropdownMenuItem>Cancelado</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                        transaction.type === "INCOME" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {transaction.type === "INCOME" ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{transaction.description}</h4>
                          <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">
                            {transaction.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span>{getStatusText(transaction.status)}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Vencimento: {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {transaction.paidDate && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Pago em: {new Date(transaction.paidDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                          {transaction.apartment && (
                            <span>Apt {transaction.apartment}</span>
                          )}
                          {transaction.resident && (
                            <span>{transaction.resident}</span>
                          )}
                          {transaction.supplier && (
                            <span>{transaction.supplier}</span>
                          )}
                        </div>
                        
                        {transaction.method && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <CreditCard className="h-3 w-3" />
                              <span>Método: {transaction.method}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.type === "INCOME" ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewTransaction(transaction)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateTransaction(transaction)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTransaction(transaction)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Visualização */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Detalhes da Transação</h2>
              <Button variant="ghost" onClick={closeModals}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <p className={`text-sm font-medium ${
                    selectedTransaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedTransaction.type === "INCOME" ? "Receita" : "Despesa"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="text-sm">{getStatusText(selectedTransaction.status)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                  <p className="text-sm">{selectedTransaction.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className={`text-sm font-bold ${
                    selectedTransaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedTransaction.type === "INCOME" ? "+" : "-"}R$ {selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Vencimento</label>
                  <p className="text-sm">{new Date(selectedTransaction.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                {selectedTransaction.paidDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Pagamento</label>
                    <p className="text-sm">{new Date(selectedTransaction.paidDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>
              
              {selectedTransaction.apartment && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Apartamento</label>
                    <p className="text-sm">{selectedTransaction.apartment}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Morador</label>
                    <p className="text-sm">{selectedTransaction.resident}</p>
                  </div>
                </div>
              )}
              
              {selectedTransaction.supplier && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
                  <p className="text-sm">{selectedTransaction.supplier}</p>
                </div>
              )}
              
              {selectedTransaction.method && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Método de Pagamento</label>
                  <p className="text-sm">{selectedTransaction.method}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Fechar
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Editar Transação</h2>
              <Button variant="ghost" onClick={closeModals}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <select 
                    defaultValue={selectedTransaction.type}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select 
                    defaultValue={selectedTransaction.status}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="PAID">Pago</option>
                    <option value="PENDING">Pendente</option>
                    <option value="OVERDUE">Vencido</option>
                    <option value="CANCELED">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição</label>
                <input 
                  type="text"
                  defaultValue={selectedTransaction.description}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <input 
                    type="text"
                    defaultValue={selectedTransaction.category}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Valor</label>
                  <input 
                    type="number"
                    step="0.01"
                    defaultValue={selectedTransaction.amount}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data de Vencimento</label>
                  <input 
                    type="date"
                    defaultValue={selectedTransaction.dueDate}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Data de Pagamento</label>
                  <input 
                    type="date"
                    defaultValue={selectedTransaction.paidDate || ""}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              
              {selectedTransaction.apartment && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Apartamento</label>
                    <input 
                      type="text"
                      defaultValue={selectedTransaction.apartment}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Morador</label>
                    <input 
                      type="text"
                      defaultValue={selectedTransaction.resident}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
              
              {selectedTransaction.supplier && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Fornecedor</label>
                  <input 
                    type="text"
                    defaultValue={selectedTransaction.supplier}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium mb-2 block">Método de Pagamento</label>
                <select 
                  defaultValue={selectedTransaction.method || ""}
                  className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Selecione um método</option>
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>
            </form>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Cancelar
              </Button>
              <Button onClick={() => {
                // TODO: Implementar salvamento via action
                console.log('Salvando transação editada');
                closeModals();
              }}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
