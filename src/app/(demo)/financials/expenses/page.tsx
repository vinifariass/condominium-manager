import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despesas"
};

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Calendar, DollarSign, TrendingDown, Receipt, AlertTriangle } from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";

export default function ExpensesPage() {
  // Mock data para despesas
  const expenses = [
    {
      id: 1,
      description: "Energia Elétrica - Janeiro 2024",
      category: "Utilities",
      amount: 3250.00,
      date: "2024-01-15",
      status: "Pago",
      vendor: "Companhia Elétrica",
      dueDate: "2024-01-20"
    },
    {
      id: 2,
      description: "Limpeza e Conservação",
      category: "Serviços",
      amount: 4500.00,
      date: "2024-01-10",
      status: "Pago",
      vendor: "LimpaTudo Ltda",
      dueDate: "2024-01-15"
    },
    {
      id: 3,
      description: "Manutenção Elevador",
      category: "Manutenção",
      amount: 850.00,
      date: "2024-01-22",
      status: "Pendente",
      vendor: "ElevaBem Serviços",
      dueDate: "2024-01-25"
    },
    {
      id: 4,
      description: "Segurança - Janeiro 2024",
      category: "Serviços",
      amount: 5200.00,
      date: "2024-01-08",
      status: "Pago",
      vendor: "SecurMax",
      dueDate: "2024-01-10"
    },
    {
      id: 5,
      description: "Água e Esgoto",
      category: "Utilities",
      amount: 1800.00,
      date: "2024-01-25",
      status: "Vencido",
      vendor: "Companhia de Saneamento",
      dueDate: "2024-01-20"
    }
  ];

  const totalPaid = expenses
    .filter(expense => expense.status === "Pago")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalPending = expenses
    .filter(expense => expense.status === "Pendente")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalOverdue = expenses
    .filter(expense => expense.status === "Vencido")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <PermissionGuard permissions={["canManageFinancials"]}>
      <ContentLayout title="Despesas">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/dashboard">Dashboard</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/financials">Financeiro</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Despesas</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  4 pagamentos realizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  1 pagamento pendente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencido</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  1 pagamento vencido
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {monthlyTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Janeiro 2024
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ações e Filtros */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas</CardTitle>
                  <CardDescription>
                    Gerencie todas as despesas do condomínio
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Despesa
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Data</th>
                      <th className="text-left p-4 font-medium">Descrição</th>
                      <th className="text-left p-4 font-medium">Categoria</th>
                      <th className="text-left p-4 font-medium">Fornecedor</th>
                      <th className="text-left p-4 font-medium">Vencimento</th>
                      <th className="text-left p-4 font-medium">Valor</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{expense.description}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{expense.category}</Badge>
                        </td>
                        <td className="p-4">{expense.vendor}</td>
                        <td className="p-4">
                          {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 font-semibold">
                          R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              expense.status === "Pago" ? "default" : 
                              expense.status === "Vencido" ? "destructive" : "secondary"
                            }
                            className={
                              expense.status === "Pago" ? "bg-green-100 text-green-800" : 
                              expense.status === "Vencido" ? "" : ""
                            }
                          >
                            {expense.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              Pagar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </PermissionGuard>
  );
}
