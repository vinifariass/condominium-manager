"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  XCircle
} from "lucide-react";

export default function FinancialsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Dados simulados - substituir por dados reais da API
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-3 w-3" />;
      case "PENDING":
        return <Clock className="h-3 w-3" />;
      case "OVERDUE":
        return <AlertCircle className="h-3 w-3" />;
      case "CANCELED":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Transação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Nova Transação</DialogTitle>
                      <DialogDescription>Registre uma nova transação financeira</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Input id="description" placeholder="Descrição da transação" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor (R$) *</Label>
                          <Input id="amount" type="number" placeholder="0.00" required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tipo *</Label>
                          <Input id="type" placeholder="Receita ou Despesa" required />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                      <Button onClick={() => setDialogOpen(false)}>Criar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
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
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
