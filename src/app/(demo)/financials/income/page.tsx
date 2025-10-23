import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Receitas"
};

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Calendar, DollarSign, TrendingUp, Receipt } from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";

export default function IncomePage() {
  // Mock data para receitas
  const incomes = [
    {
      id: 1,
      description: "Taxa Condominial - Janeiro 2024",
      category: "Taxa Condominial",
      amount: 25000.00,
      date: "2024-01-15",
      status: "Recebido",
      apartment: "Apt 101",
      resident: "João Silva"
    },
    {
      id: 2,
      description: "Multa por Atraso - Apt 205",
      category: "Multas",
      amount: 150.00,
      date: "2024-01-20",
      status: "Recebido",
      apartment: "Apt 205",
      resident: "Maria Santos"
    },
    {
      id: 3,
      description: "Taxa de Reserva - Salão de Festas",
      category: "Reservas",
      amount: 200.00,
      date: "2024-01-22",
      status: "Pendente",
      apartment: "Apt 304",
      resident: "Carlos Oliveira"
    },
    {
      id: 4,
      description: "Taxa Condominial - Janeiro 2024",
      category: "Taxa Condominial",
      amount: 25000.00,
      date: "2024-01-10",
      status: "Recebido",
      apartment: "Apt 102",
      resident: "Ana Costa"
    }
  ];

  const totalReceived = incomes
    .filter(income => income.status === "Recebido")
    .reduce((sum, income) => sum + income.amount, 0);

  const totalPending = incomes
    .filter(income => income.status === "Pendente")
    .reduce((sum, income) => sum + income.amount, 0);

  const monthlyTotal = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <PermissionGuard permissions={["canManageFinancials"]}>
      <ContentLayout title="Receitas">
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
            <BreadcrumbPage>Receitas</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
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
                <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
                  <CardTitle>Receitas</CardTitle>
                  <CardDescription>
                    Gerencie todas as receitas do condomínio
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
                    Nova Receita
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
                      <th className="text-left p-4 font-medium">Apartamento</th>
                      <th className="text-left p-4 font-medium">Morador</th>
                      <th className="text-left p-4 font-medium">Valor</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((income) => (
                      <tr key={income.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          {new Date(income.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{income.description}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{income.category}</Badge>
                        </td>
                        <td className="p-4">{income.apartment}</td>
                        <td className="p-4">{income.resident}</td>
                        <td className="p-4 font-semibold">
                          R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={income.status === "Recebido" ? "default" : "secondary"}
                            className={income.status === "Recebido" ? "bg-green-100 text-green-800" : ""}
                          >
                            {income.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              Recibo
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
