import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taxas Condominiais"
};

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Calendar, DollarSign, Users, AlertCircle, CheckCircle } from "lucide-react";
import { PermissionGuard } from "@/components/permission-guard";

export default function FeesPage() {
  // Mock data para taxas condominiais
  const fees = [
    {
      id: 1,
      apartment: "Apt 101",
      resident: "João Silva",
      month: "Janeiro 2024",
      amount: 450.00,
      dueDate: "2024-01-10",
      paidDate: "2024-01-08",
      status: "Pago",
      penalty: 0,
      discount: 0
    },
    {
      id: 2,
      apartment: "Apt 102",
      resident: "Maria Santos",
      month: "Janeiro 2024",
      amount: 450.00,
      dueDate: "2024-01-10",
      paidDate: "2024-01-15",
      status: "Pago",
      penalty: 22.50, // 5% de multa
      discount: 0
    },
    {
      id: 3,
      apartment: "Apt 201",
      resident: "Carlos Oliveira",
      month: "Janeiro 2024",
      amount: 450.00,
      dueDate: "2024-01-10",
      paidDate: null,
      status: "Pendente",
      penalty: 0,
      discount: 0
    },
    {
      id: 4,
      apartment: "Apt 202",
      resident: "Ana Costa",
      month: "Janeiro 2024",
      amount: 450.00,
      dueDate: "2024-01-10",
      paidDate: null,
      status: "Vencido",
      penalty: 67.50, // 15% de multa
      discount: 0
    },
    {
      id: 5,
      apartment: "Apt 301",
      resident: "Pedro Lima",
      month: "Janeiro 2024",
      amount: 450.00,
      dueDate: "2024-01-10",
      paidDate: "2024-01-05",
      status: "Pago",
      penalty: 0,
      discount: 22.50 // 5% desconto por antecipação
    }
  ];

  const totalReceived = fees
    .filter(fee => fee.status === "Pago")
    .reduce((sum, fee) => sum + fee.amount + fee.penalty - fee.discount, 0);

  const totalPending = fees
    .filter(fee => fee.status === "Pendente")
    .reduce((sum, fee) => sum + fee.amount, 0);

  const totalOverdue = fees
    .filter(fee => fee.status === "Vencido")
    .reduce((sum, fee) => sum + fee.amount + fee.penalty, 0);

  const paidCount = fees.filter(fee => fee.status === "Pago").length;
  const totalUnits = fees.length;

  return (
    <PermissionGuard permissions={["canManageFinancials"]}>
      <ContentLayout title="Taxas Condominiais">
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
            <BreadcrumbPage>Taxas Condominiais</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {paidCount} de {totalUnits} apartamentos
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
                  1 apartamento pendente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencido</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  1 apartamento em atraso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Pagamento</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((paidCount / totalUnits) * 100)}%
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
                  <CardTitle>Taxas Condominiais - Janeiro 2024</CardTitle>
                  <CardDescription>
                    Controle de pagamentos das taxas condominiais
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
                    Gerar Cobrança
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Apartamento</th>
                      <th className="text-left p-4 font-medium">Morador</th>
                      <th className="text-left p-4 font-medium">Mês/Ano</th>
                      <th className="text-left p-4 font-medium">Vencimento</th>
                      <th className="text-left p-4 font-medium">Valor Base</th>
                      <th className="text-left p-4 font-medium">Multa/Desconto</th>
                      <th className="text-left p-4 font-medium">Total</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => {
                      const total = fee.amount + fee.penalty - fee.discount;
                      return (
                        <tr key={fee.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 font-medium">{fee.apartment}</td>
                          <td className="p-4">{fee.resident}</td>
                          <td className="p-4">{fee.month}</td>
                          <td className="p-4">
                            {new Date(fee.dueDate).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4">
                            R$ {fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">
                            {fee.penalty > 0 && (
                              <span className="text-red-600">
                                +R$ {fee.penalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                            {fee.discount > 0 && (
                              <span className="text-green-600">
                                -R$ {fee.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                            {fee.penalty === 0 && fee.discount === 0 && "-"}
                          </td>
                          <td className="p-4 font-semibold">
                            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {fee.status === "Pago" && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {fee.status === "Vencido" && <AlertCircle className="h-4 w-4 text-red-500" />}
                              <Badge 
                                variant={
                                  fee.status === "Pago" ? "default" : 
                                  fee.status === "Vencido" ? "destructive" : "secondary"
                                }
                                className={
                                  fee.status === "Pago" ? "bg-green-100 text-green-800" : ""
                                }
                              >
                                {fee.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Boleto
                              </Button>
                              {fee.status !== "Pago" && (
                                <Button variant="outline" size="sm">
                                  Receber
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
