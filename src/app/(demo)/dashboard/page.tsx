"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestModalInteractions } from "@/components/demo/test-modal-interactions";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Users, 
  Key, 
  DollarSign, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  
  // Dados simulados - substituir por dados reais da API
  const stats = {
    totalApartments: 120,
    totalResidents: 285,
    occupancyRate: 92,
    monthlyRevenue: 145000,
    pendingTickets: 8,
    upcomingReservations: 12
  };

  const recentActivities = [
    {
      id: 1,
      type: "reservation",
      description: "Nova reserva do salão de festas",
      user: "Maria Silva - Apt 201",
      time: "2 horas atrás"
    },
    {
      id: 2,
      type: "ticket",
      description: "Chamado de manutenção no elevador",
      user: "João Santos - Apt 105",
      time: "4 horas atrás"
    },
    {
      id: 3,
      type: "payment",
      description: "Pagamento de taxa condominial",
      user: "Ana Costa - Apt 302",
      time: "6 horas atrás"
    }
  ];

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApartments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.occupancyRate}% ocupados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                +12 este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chamados Pendentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTickets}</div>
              <p className="text-xs text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3 desde ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Componente de Teste - Remover após validação */}
        <TestModalInteractions />

        {/* Gráficos e Resumos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Receitas</span>
                  <span className="font-medium text-green-600">R$ 145.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Despesas</span>
                  <span className="font-medium text-red-600">R$ 89.500</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-medium">Saldo</span>
                  <span className="font-bold text-green-600">R$ 55.500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ocupação por Bloco */}
          <Card>
            <CardHeader>
              <CardTitle>Ocupação por Bloco</CardTitle>
              <CardDescription>Status atual dos apartamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bloco A</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bloco B</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bloco C</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Atividades Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Reservas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Próximas Reservas</span>
              </CardTitle>
              <Button 
                variant="default"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => {
                  router.push('/reservations');
                }}
              >
                <Calendar className="h-4 w-4" />
                <span>Ver Calendário</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Salão de Festas</p>
                  <p className="text-sm text-muted-foreground">Maria Silva - Apt 201</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Hoje</p>
                  <p className="text-xs text-muted-foreground">19:00 - 23:00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Quadra de Tênis</p>
                  <p className="text-sm text-muted-foreground">João Santos - Apt 105</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Amanhã</p>
                  <p className="text-xs text-muted-foreground">08:00 - 10:00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Churrasqueira</p>
                  <p className="text-sm text-muted-foreground">Ana Costa - Apt 302</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Sábado</p>
                  <p className="text-xs text-muted-foreground">12:00 - 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
