"use client";

import { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Building2,
  Users,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function FinancialsPage() {
  // Dados financeiros resumidos
  const financialData = {
    income: {
      total: 4147.00,
      paid: 3297.00,
      pending: 650.00,
      overdue: 200.00,
      count: 5
    },
    expenses: {
      total: 12940.00,
      paid: 8440.00,
      pending: 1850.00,
      overdue: 4500.00,
      count: 5
    },
    fees: {
      total: 4747.00,
      paid: 4047.00,
      pending: 650.00,
      overdue: 883.30,
      count: 5
    }
  };

  // Resumo mensal
  const monthlyData = [
    { month: "Jan/24", income: 3800, expenses: 12200, balance: -8400 },
    { month: "Fev/24", income: 4200, expenses: 11800, balance: -7600 },
    { month: "Mar/24", income: 3950, expenses: 13100, balance: -9150 },
    { month: "Abr/24", income: 4100, expenses: 12500, balance: -8400 },
    { month: "Mai/24", income: 3750, expenses: 11900, balance: -8150 },
    { month: "Jun/24", income: 4300, expenses: 12800, balance: -8500 },
  ];

  // Últimas transações
  const recentTransactions = [
    {
      id: 1,
      type: "income",
      description: "Taxa condominial - Apt. 301",
      amount: 1200.00,
      date: "2024-12-13",
      status: "Pago"
    },
    {
      id: 2,
      type: "expense",
      description: "Serviços de limpeza e conservação",
      amount: -3200.00,
      date: "2024-12-28",
      status: "Pago"
    },
    {
      id: 3,
      type: "income",
      description: "Taxa condominial - Apt. 101",
      amount: 850.00,
      date: "2024-12-14",
      status: "Pago"
    },
    {
      id: 4,
      type: "expense",
      description: "Reparo no elevador - Bloco A",
      amount: -2500.00,
      date: "2024-12-18",
      status: "Pago"
    },
    {
      id: 5,
      type: "expense",
      description: "Conta de energia elétrica",
      amount: -1850.00,
      date: "2024-12-25",
      status: "Pendente"
    }
  ];

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular saldo geral
  const totalBalance = financialData.income.paid - financialData.expenses.paid;

  return (
    <ContentLayout title="Financeiro">
      <div className="space-y-6">
        {/* Visão Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(financialData.income.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {financialData.income.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Total</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(financialData.expenses.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {financialData.expenses.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              {totalBalance >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Receitas - Despesas pagas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxas Condominiais</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(financialData.fees.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {financialData.fees.count} apartamentos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com detalhes */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="fees">Taxas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumo Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo dos Últimos 6 Meses</CardTitle>
                  <CardDescription>Comparativo de receitas e despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthlyData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{month.month}</p>
                          <p className="text-sm text-muted-foreground">
                            Receitas: {formatCurrency(month.income)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Despesas: {formatCurrency(month.expenses)}
                          </p>
                        </div>
                        <div className={`text-right ${month.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <p className="font-semibold">{formatCurrency(month.balance)}</p>
                          <p className="text-xs">
                            {month.balance >= 0 ? 'Superávit' : 'Déficit'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Últimas Transações */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimas Transações</CardTitle>
                  <CardDescription>Movimentações financeiras recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          {transaction.type === 'income' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <Badge variant={transaction.status === 'Pago' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Receitas</CardTitle>
                <CardDescription>Detalhamento das receitas do condomínio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(financialData.income.total)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Recebido</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(financialData.income.paid)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pendente</p>
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(financialData.income.pending)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Em Atraso</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(financialData.income.overdue)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link href="/financials/income">
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes das Receitas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Despesas</CardTitle>
                <CardDescription>Detalhamento das despesas do condomínio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(financialData.expenses.total)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pago</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(financialData.expenses.paid)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pendente</p>
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(financialData.expenses.pending)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Em Atraso</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(financialData.expenses.overdue)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link href="/financials/expenses">
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes das Despesas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxas Condominiais</CardTitle>
                <CardDescription>Detalhamento das taxas condominiais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(financialData.fees.total)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Recebido</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(financialData.fees.paid)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pendente</p>
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(financialData.fees.pending)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Em Atraso</p>
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(financialData.fees.overdue)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link href="/financials/fees">
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes das Taxas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
}
