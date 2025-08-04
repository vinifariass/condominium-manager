import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relatórios"
};

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle
} from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";

export default function ReportsPage() {
  // Mock data para relatórios
  const reportData = {
    period: "Janeiro 2024",
    summary: {
      totalIncome: 50350.00,
      totalExpenses: 15600.00,
      netResult: 34750.00,
      paymentRate: 90,
      totalApartments: 50,
      paidApartments: 45
    },
    monthlyComparison: {
      incomeGrowth: 12.5,
      expenseGrowth: -5.2,
      paymentRateChange: 5.8
    },
    categoryBreakdown: {
      income: [
        { category: "Taxas Condominiais", amount: 22500.00, percentage: 60 },
        { category: "Multas", amount: 2250.00, percentage: 6 },
        { category: "Reservas", amount: 1200.00, percentage: 3 },
        { category: "Outros", amount: 850.00, percentage: 2 }
      ],
      expenses: [
        { category: "Energia Elétrica", amount: 3250.00, percentage: 21 },
        { category: "Limpeza", amount: 4500.00, percentage: 29 },
        { category: "Segurança", amount: 5200.00, percentage: 33 },
        { category: "Manutenção", amount: 2650.00, percentage: 17 }
      ]
    }
  };

  const availableReports = [
    {
      id: 1,
      title: "Relatório Financeiro Mensal",
      description: "Resumo completo das receitas e despesas do mês",
      type: "financial",
      format: "PDF",
      lastGenerated: "2024-01-31",
      status: "ready"
    },
    {
      id: 2,
      title: "Relatório de Inadimplência",
      description: "Apartamentos com pagamentos em atraso",
      type: "defaulters",
      format: "PDF",
      lastGenerated: "2024-01-30",
      status: "ready"
    },
    {
      id: 3,
      title: "Demonstrativo de Resultados",
      description: "DRE simplificado do condomínio",
      type: "financial",
      format: "Excel",
      lastGenerated: "2024-01-31",
      status: "ready"
    },
    {
      id: 4,
      title: "Relatório de Reservas",
      description: "Uso das áreas comuns e receitas de reservas",
      type: "reservations",
      format: "PDF",
      lastGenerated: "2024-01-29",
      status: "ready"
    },
    {
      id: 5,
      title: "Balancete Contábil",
      description: "Balancete mensal para contabilidade",
      type: "accounting",
      format: "Excel",
      lastGenerated: "2024-01-31",
      status: "processing"
    },
    {
      id: 6,
      title: "Análise de Custos por Categoria",
      description: "Breakdown detalhado das despesas por categoria",
      type: "costs",
      format: "PDF",
      lastGenerated: "2024-01-28",
      status: "ready"
    }
  ];

  return (
    <PermissionGuard permissions={["canViewReports"]}>
      <ContentLayout title="Relatórios">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/dashboard">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Relatórios</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {reportData.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{reportData.monthlyComparison.incomeGrowth}% vs mês anterior
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
                  R$ {reportData.summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {reportData.monthlyComparison.expenseGrowth}% vs mês anterior
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
                  R$ {reportData.summary.netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {reportData.period}
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
                  {reportData.summary.paymentRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {reportData.summary.paidApartments} de {reportData.summary.totalApartments} apartamentos
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
                  {reportData.categoryBreakdown.income.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-green-${500 + index * 100}`}></div>
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  {reportData.categoryBreakdown.expenses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-red-${400 + index * 100}`}></div>
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

          {/* Relatórios Disponíveis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                  <CardDescription>
                    Gere e baixe relatórios personalizados
                  </CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Novo Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {report.type === "financial" && <DollarSign className="h-4 w-4 text-green-600" />}
                          {report.type === "defaulters" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {report.type === "reservations" && <Calendar className="h-4 w-4 text-blue-600" />}
                          {report.type === "accounting" && <Receipt className="h-4 w-4 text-purple-600" />}
                          {report.type === "costs" && <BarChart3 className="h-4 w-4 text-orange-600" />}
                          <CardTitle className="text-sm">{report.title}</CardTitle>
                        </div>
                        <Badge 
                          variant={report.status === "ready" ? "default" : "secondary"}
                          className={report.status === "ready" ? "bg-green-100 text-green-800" : ""}
                        >
                          {report.status === "ready" ? "Pronto" : "Processando"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-3">
                        {report.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>Formato: {report.format}</span>
                        <span>Atualizado: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          disabled={report.status !== "ready"}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={report.status !== "ready"}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </PermissionGuard>
  );
}
