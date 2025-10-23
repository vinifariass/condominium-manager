"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  X
} from "lucide-react";
import { useState, useEffect } from "react";
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
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalReceita)}
              </div>
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
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalDespesa)}
              </div>
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
              <div className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.saldo)}
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
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(stats.receitasPendentes + stats.despesasPendentes)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.receitasAtrasadas + stats.despesasAtrasadas)} em atraso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Filtrar movimentações financeiras</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Filtro de Pesquisa */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Pesquisar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar por descrição, categoria..."
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
                      value={filters.search || ''}
                      onChange={(e) => updateFilter('search', e.target.value)}
                    />
                  </div>
                </div>

                {/* Filtro por Tipo */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.type?.[0] || 'Todos os tipos'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => updateFilter('type', [])}>
                        Todos os tipos
                      </DropdownMenuItem>
                      {FINANCIAL_FILTER_OPTIONS.types.map(type => (
                        <DropdownMenuItem 
                          key={type} 
                          onClick={() => updateFilter('type', [type])}
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Filtro por Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.status?.[0] || 'Todos os status'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => updateFilter('status', [])}>
                        Todos os status
                      </DropdownMenuItem>
                      {FINANCIAL_FILTER_OPTIONS.status.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          onClick={() => updateFilter('status', [status])}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Filtro por Categoria */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.category?.[0] || 'Todas as categorias'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                      <DropdownMenuItem onClick={() => updateFilter('category', [])}>
                        Todas as categorias
                      </DropdownMenuItem>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        Receitas
                      </div>
                      {FINANCIAL_FILTER_OPTIONS.categories.receita.map(category => (
                        <DropdownMenuItem 
                          key={category} 
                          onClick={() => updateFilter('category', [category])}
                          className="pl-4"
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        Despesas
                      </div>
                      {FINANCIAL_FILTER_OPTIONS.categories.despesa.map(category => (
                        <DropdownMenuItem 
                          key={category} 
                          onClick={() => updateFilter('category', [category])}
                          className="pl-4"
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Filtro por Método de Pagamento */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Método de Pagamento</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.paymentMethod?.[0] || 'Todos os métodos'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem onClick={() => updateFilter('paymentMethod', [])}>
                        Todos os métodos
                      </DropdownMenuItem>
                      {FINANCIAL_FILTER_OPTIONS.paymentMethods.map(method => (
                        <DropdownMenuItem 
                          key={method} 
                          onClick={() => updateFilter('paymentMethod', [method])}
                        >
                          {method}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Botão para limpar filtros */}
                <div className="md:col-span-4 flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Movimentações Financeiras</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as transações
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
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Carregando movimentações...</p>
                </div>
              ) : financials.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
                </div>
              ) : (
                financials.map((financial) => (
                  <div key={financial.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        financial.type === 'Receita' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {financial.type === 'Receita' ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> : 
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium">{financial.description}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{financial.category}</span>
                          <span>•</span>
                          <span>{financial.condominium}</span>
                          {financial.apartment && (
                            <>
                              <span>•</span>
                              <span>Apt {financial.apartment}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDate(financial.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        financial.type === 'Receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {financial.type === 'Receita' ? '+' : '-'}{formatCurrency(financial.amount)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(financial.status)}
                        <span className="text-sm text-muted-foreground">{financial.status}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{financial.paymentMethod}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estilos customizados para selects */}
      <style jsx global>{`
        select {
          max-height: none !important;
        }

        select option {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          padding: 8px 12px;
          border: none;
          max-height: 200px;
        }

        select optgroup {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          padding: 4px 8px;
        }

        select:focus {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        /* Fix para dropdown em modo escuro */
        @media (prefers-color-scheme: dark) {
          select option {
            background: hsl(var(--background));
            color: hsl(var(--foreground));
          }
          
          select optgroup {
            background: hsl(var(--muted));
            color: hsl(var(--muted-foreground));
          }
        }

        /* Remover seta padrão do select */
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
        }

        /* Estilo para options hover */
        select option:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
      `}</style>
    </ContentLayout>
  );
}
