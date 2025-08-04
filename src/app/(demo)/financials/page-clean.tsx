import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financeiro"
};

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  CreditCard,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart
} from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";

export default function FinancialsPage() {
  // Mock data para dashboard financeiro
  const monthlyData = {
    income: {
      total: 50350.00,
      received: 48150.00,
      pending: 2200.00,
      growth: 12
    },
    expenses: {
      total: 15600.00,
      paid: 13800.00,
      pending: 850.00,
      overdue: 950.00,
      growth: -5
    },
    fees: {
      total: 22500.00,
      collected: 20250.00,
      pending: 450.00,
      overdue: 1800.00,
      paymentRate: 90
    }
  };

  const netResult = monthlyData.income.received - monthlyData.expenses.paid;

  const recentTransactions = [
    {
      id: 1,
      type: "income",
      description: "Taxa Condominial - Apt 101",
      amount: 450.00,
      date: "2024-01-25",
      status: "received"
    },
    {
      id: 2,
      type: "expense",
      description: "Energia Elétrica",
      amount: 3250.00,
      date: "2024-01-24",
      status: "paid"
    },
    {
      id: 3,
      type: "income",
      description: "Multa por Atraso - Apt 205",
      amount: 150.00,
      date: "2024-01-23",
      status: "received"
    },
    {
      id: 4,
      type: "expense",
      description: "Manutenção Elevador",
      amount: 850.00,
      date: "2024-01-22",
      status: "pending"
    }
  ];

  return (
    <PermissionGuard permissions={["canManageFinancials"]}>
      <ContentLayout title="Financeiro">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/dashboard">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Financeiro</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Cards de Resumo Principal */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {monthlyData.income.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{monthlyData.income.growth}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {monthlyData.expenses.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {monthlyData.expenses.growth}% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Janeiro 2024
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
                  {monthlyData.fees.paymentRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxas condominiais pagas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Receitas
                </CardTitle>
                <CardDescription>
                  Gerencie todas as receitas do condomínio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Recebido:</span>
                    <span className="font-semibold text-green-600">
                      R$ {monthlyData.income.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pendente:</span>
                    <span className="font-semibold text-yellow-600">
                      R$ {monthlyData.income.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <a href="/financials/income">Ver Receitas</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Despesas
                </CardTitle>
                <CardDescription>
                  Controle todas as despesas e pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pago:</span>
                    <span className="font-semibold text-green-600">
                      R$ {monthlyData.expenses.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Vencido:</span>
                    <span className="font-semibold text-red-600">
                      R$ {monthlyData.expenses.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <a href="/financials/expenses">Ver Despesas</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Taxas Condominiais
                </CardTitle>
                <CardDescription>
                  Controle de pagamentos das taxas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Arrecadado:</span>
                    <span className="font-semibold text-green-600">
                      R$ {monthlyData.fees.collected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Em atraso:</span>
                    <span className="font-semibold text-red-600">
                      R$ {monthlyData.fees.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <a href="/financials/fees">Ver Taxas</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transações Recentes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transações Recentes</CardTitle>
                  <CardDescription>
                    Últimas movimentações financeiras
                  </CardDescription>
                </div>
                <Button asChild variant="outline">
                  <a href="/reports">Ver Relatórios</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <Badge 
                        variant={transaction.status === "received" || transaction.status === "paid" ? "default" : "secondary"}
                        className={
                          transaction.status === "received" || transaction.status === "paid" 
                            ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {transaction.status === "received" ? "Recebido" : 
                         transaction.status === "paid" ? "Pago" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </PermissionGuard>
  );
}
