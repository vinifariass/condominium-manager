"use client";

import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  Users,
  Clock,
  RefreshCw,
  Calendar,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  UserX,
  ChevronRight,
  Building2,
  Shield
} from "lucide-react";

export default function HRManagementPage() {
  // Dados mockados para dashboard
  const hrStats = {
    totalEmployees: 12,
    activeEmployees: 10,
    onLeave: 2,
    pendingCertificates: 3,
    approvedCertificates: 8,
    rejectedCertificates: 1,
    pendingSubstitutions: 2,
    completedSubstitutions: 5,
    totalAbsenceDays: 15,
    monthlyOvertime: 24
  };

  const recentActivities = [
    {
      id: 1,
      type: 'certificate',
      title: 'Atestado médico enviado',
      description: 'Maria Santos - 1 dia (Consulta médica)',
      time: '2 horas atrás',
      status: 'pending'
    },
    {
      id: 2,
      type: 'substitution',
      title: 'Substituição agendada',
      description: 'João Silva → Carlos Oliveira (Turno da manhã)',
      time: '5 horas atrás',
      status: 'confirmed'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Atestado aprovado',
      description: 'Ana Costa - 3 dias (Dengue)',
      time: '1 dia atrás',
      status: 'approved'
    },
    {
      id: 4,
      type: 'timesheet',
      title: 'Ponto registrado',
      description: 'Pedro Lima - 8h30 trabalhadas (30min extras)',
      time: '1 dia atrás',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Atestado',
      description: 'Registrar atestado médico',
      icon: FileText,
      href: '/hr-management/medical-certificates',
      color: 'blue'
    },
    {
      title: 'Agendar Substituição',
      description: 'Organizar substituição de funcionário',
      icon: RefreshCw,
      href: '/hr-management/substitutions',
      color: 'green'
    },
    {
      title: 'Registrar Ponto',
      description: 'Controle de frequência',
      icon: Clock,
      href: '/hr-management/timesheet',
      color: 'purple'
    },
    {
      title: 'Gerenciar Funcionários',
      description: 'Cadastro e informações',
      icon: Users,
      href: '/employees',
      color: 'orange'
    }
  ];

  const hrModules = [
    {
      title: 'Atestados Médicos',
      description: 'Gerencie atestados médicos dos funcionários',
      icon: FileText,
      href: '/hr-management/medical-certificates',
      stats: `${hrStats.pendingCertificates} pendentes`,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Substituições',
      description: 'Organize substituições e escalas',
      icon: RefreshCw,
      href: '/hr-management/substitutions',
      stats: `${hrStats.pendingSubstitutions} agendadas`,
      color: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-600'
    },
    {
      title: 'Controle de Ponto',
      description: 'Frequência e horas trabalhadas',
      icon: Clock,
      href: '/hr-management/timesheet',
      stats: `${hrStats.monthlyOvertime}h extras no mês`,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Férias e Licenças',
      description: 'Gerencie férias e licenças',
      icon: Calendar,
      href: '/hr-management/vacations',
      stats: 'Em breve',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      iconColor: 'text-orange-600'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'certificate':
        return FileText;
      case 'substitution':
        return RefreshCw;
      case 'timesheet':
        return Clock;
      default:
        return AlertTriangle;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved':
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ContentLayout title="Gestão de Recursos Humanos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recursos Humanos</h1>
            <p className="text-muted-foreground">
              Central de gestão de pessoal do condomínio
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Funcionários
            </Button>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {hrStats.activeEmployees} ativos, {hrStats.onLeave} afastados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atestados Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{hrStats.pendingCertificates}</div>
              <p className="text-xs text-muted-foreground">
                {hrStats.approvedCertificates} aprovados este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Substituições</CardTitle>
              <RefreshCw className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{hrStats.pendingSubstitutions}</div>
              <p className="text-xs text-muted-foreground">
                {hrStats.completedSubstitutions} realizadas este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dias de Afastamento</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{hrStats.totalAbsenceDays}</div>
              <p className="text-xs text-muted-foreground">
                Total no mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Módulos de RH */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Módulos de RH</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {hrModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <Link href={module.href}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${module.color}`}>
                          <IconComponent className={`h-5 w-5 ${module.iconColor}`} />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {module.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {module.stats}
                      </Badge>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Ações Rápidas e Atividades Recentes */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades mais utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 mr-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas movimentações no sistema de RH
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas as atividades
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertas e Pendências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FileText className="h-4 w-4 text-yellow-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {hrStats.pendingCertificates} atestados aguardando aprovação
                  </p>
                  <p className="text-xs text-yellow-600">Requer atenção</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <RefreshCw className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {hrStats.pendingSubstitutions} substituições agendadas
                  </p>
                  <p className="text-xs text-blue-600">Próximos dias</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Sistema funcionando normalmente
                  </p>
                  <p className="text-xs text-green-600">Tudo em ordem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
