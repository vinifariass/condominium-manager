"use client";

import React, { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  DollarSign,
  Users,
  Receipt,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  X,
  Building2,
  Home
} from "lucide-react";

// Interfaces para tipagem
interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'apartments' | 'residents' | 'expenses' | 'income' | 'defaulters' | 'custom';
  format: 'PDF' | 'Excel' | 'CSV';
  dateRange: {
    start: string;
    end: string;
  };
  status: 'ready' | 'processing' | 'failed';
  generatedAt: string;
  downloadUrl?: string;
  size?: string;
}

interface ReportFilters {
  type: string;
  period: string;
  condominium: string;
  format: string;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  paymentRate: number;
  totalApartments: number;
  paidApartments: number;
  pendingAmount: number;
  averageMonthlyFee: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function ReportsPage() {
  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [selectedCondominium, setSelectedCondominium] = useState("all");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);

  // Dados mockados para demonstração
  const mockFinancialData: FinancialSummary = {
    totalIncome: 45600,
    totalExpenses: 32100,
    netResult: 13500,
    paymentRate: 87.5,
    totalApartments: 120,
    paidApartments: 105,
    pendingAmount: 12300,
    averageMonthlyFee: 380,
  };

  const mockExpenseCategories: CategoryData[] = [
    { category: "Manutenção", amount: 12500, percentage: 38.9, color: "#8b5cf6" },
    { category: "Segurança", amount: 8200, percentage: 25.5, color: "#06b6d4" },
    { category: "Limpeza", amount: 6800, percentage: 21.2, color: "#10b981" },
    { category: "Administração", amount: 3200, percentage: 10.0, color: "#f59e0b" },
    { category: "Outros", amount: 1400, percentage: 4.4, color: "#ef4444" },
  ];

  const mockIncomeCategories: CategoryData[] = [
    { category: "Taxas Condominiais", amount: 38400, percentage: 84.2, color: "#3b82f6" },
    { category: "Multas", amount: 3200, percentage: 7.0, color: "#ef4444" },
    { category: "Taxa Extra", amount: 2800, percentage: 6.1, color: "#8b5cf6" },
    { category: "Outros", amount: 1200, percentage: 2.6, color: "#6b7280" },
  ];

  const mockReports: ReportData[] = [
    {
      id: "1",
      title: "Relatório Financeiro - Dezembro 2024",
      description: "Relatório completo de receitas e despesas do mês",
      type: "financial",
      format: "PDF",
      dateRange: { start: "2024-12-01", end: "2024-12-31" },
      status: "ready",
      generatedAt: "2024-12-15T10:30:00Z",
      downloadUrl: "#",
      size: "2.1 MB"
    },
    {
      id: "2", 
      title: "Lista de Inadimplentes - Dezembro 2024",
      description: "Relatório de moradores com pendências financeiras",
      type: "defaulters",
      format: "Excel",
      dateRange: { start: "2024-12-01", end: "2024-12-31" },
      status: "ready",
      generatedAt: "2024-12-14T15:45:00Z",
      downloadUrl: "#",
      size: "856 KB"
    },
    {
      id: "3",
      title: "Relatório de Apartamentos - Novembro 2024",
      description: "Status e informações dos apartamentos",
      type: "apartments",
      format: "PDF",
      dateRange: { start: "2024-11-01", end: "2024-11-30" },
      status: "processing",
      generatedAt: "2024-12-15T11:20:00Z"
    }
  ];

  // Computadas
  const filteredData = useMemo(() => {
    // Simular filtragem baseada no período selecionado
    return {
      financial: mockFinancialData,
      expenses: mockExpenseCategories,
      income: mockIncomeCategories,
    };
  }, [selectedPeriod, selectedCondominium]);

  // Funções
  const handleGenerateReport = async (type: string, format: string) => {
    setIsGeneratingReport(true);
    // Simular geração de relatório
    setTimeout(() => {
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `Relatório ${type} - ${new Date().toLocaleDateString('pt-BR')}`,
        description: `Relatório gerado automaticamente`,
        type: type as any,
        format: format as any,
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
        },
        status: "ready",
        generatedAt: new Date().toISOString(),
        downloadUrl: "#",
        size: "1.2 MB"
      };
      
      setReports(prev => [newReport, ...prev]);
      setIsGeneratingReport(false);
    }, 2000);
  };

  const handleDownloadReport = (report: ReportData) => {
    // Simular download
    console.log("Downloading report:", report.title);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <ContentLayout title="Relatórios">
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Mês Atual</SelectItem>
              <SelectItem value="last-month">Mês Anterior</SelectItem>
              <SelectItem value="last-3-months">Últimos 3 Meses</SelectItem>
              <SelectItem value="last-6-months">Últimos 6 Meses</SelectItem>
              <SelectItem value="current-year">Ano Atual</SelectItem>
              <SelectItem value="custom">Período Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCondominium} onValueChange={setSelectedCondominium}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Selecionar condomínio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Condomínios</SelectItem>
              <SelectItem value="cond-1">Residencial Jardim</SelectItem>
              <SelectItem value="cond-2">Edifício Central</SelectItem>
              <SelectItem value="cond-3">Condomínio Vista</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>

        {/* Cards de Resumo Financeiro */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredData.financial.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                +8.2% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(filteredData.financial.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                -3.1% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredData.financial.netResult)}
              </div>
              <p className="text-xs text-muted-foreground">
                Dezembro 2024
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredData.financial.paymentRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredData.financial.paidApartments} de {filteredData.financial.totalApartments} apartamentos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Análises por Categoria */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Receitas por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição das receitas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.income.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                Despesas por Categoria
              </CardTitle>
              <CardDescription>
                Distribuição das despesas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.expenses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios Gerados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Relatórios Gerados</CardTitle>
                <CardDescription>
                  Histórico de relatórios gerados e disponíveis para download
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Novo Relatório
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...reports, ...mockReports].map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {report.type === "financial" && <DollarSign className="h-8 w-8 p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded" />}
                      {report.type === "defaulters" && <AlertTriangle className="h-8 w-8 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded" />}
                      {report.type === "apartments" && <Home className="h-8 w-8 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded" />}
                      {report.type === "residents" && <Users className="h-8 w-8 p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded" />}
                      {report.type === "expenses" && <Receipt className="h-8 w-8 p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded" />}
                      {report.type === "income" && <TrendingUp className="h-8 w-8 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded" />}
                      {report.type === "custom" && <FileText className="h-8 w-8 p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{report.title}</h4>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Formato: {report.format}</span>
                        <span>Período: {new Date(report.dateRange.start).toLocaleDateString('pt-BR')} - {new Date(report.dateRange.end).toLocaleDateString('pt-BR')}</span>
                        {report.size && <span>Tamanho: {report.size}</span>}
                        <span>Gerado em: {new Date(report.generatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={report.status === "ready" ? "default" : report.status === "processing" ? "secondary" : "destructive"}
                      className={
                        report.status === "ready" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800" : 
                        report.status === "processing" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" :
                        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
                      }
                    >
                      {report.status === "ready" ? "Pronto" : report.status === "processing" ? "Processando" : "Falhou"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDownloadReport(report)}
                          disabled={report.status !== "ready"}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={report.status !== "ready"}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Geração de Relatório */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4 border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Gerar Novo Relatório</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Tipo de Relatório</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Relatório Financeiro</SelectItem>
                      <SelectItem value="apartments">Relatório de Apartamentos</SelectItem>
                      <SelectItem value="residents">Relatório de Moradores</SelectItem>
                      <SelectItem value="defaulters">Lista de Inadimplentes</SelectItem>
                      <SelectItem value="expenses">Relatório de Despesas</SelectItem>
                      <SelectItem value="income">Relatório de Receitas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Formato</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleGenerateReport("financial", "PDF");
                      setIsCreateModalOpen(false);
                    }}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Gerar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
