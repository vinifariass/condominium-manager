"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    weeklyReport: true
  });

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "system", label: "Sistema", icon: Database },
    { id: "backup", label: "Backup", icon: Download },
  ];

  const handleSave = () => {
    // Lógica para salvar configurações
    console.log("Configurações salvas");
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Gerencie suas informações de perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <input
                type="text"
                defaultValue="Administrador Sistema"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue="admin@condominio.com"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Telefone</label>
              <input
                type="tel"
                defaultValue="(11) 99999-9999"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cargo</label>
              <Select defaultValue="admin">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="assistant">Assistente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              defaultValue="Administrador responsável pela gestão do sistema condominial."
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>Atualize sua foto de perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
              AS
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Carregar Nova Foto
              </Button>
              <Button variant="outline" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Foto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>Configure como você quer receber notificações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium">Notificações por Email</h4>
                <p className="text-sm text-muted-foreground">Receba alertas importantes por email</p>
              </div>
            </div>
            <Button
              variant={notifications.email ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
            >
              {notifications.email ? <Check className="h-4 w-4" /> : "Ativar"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-medium">Notificações SMS</h4>
                <p className="text-sm text-muted-foreground">Receba alertas urgentes por SMS</p>
              </div>
            </div>
            <Button
              variant={notifications.sms ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
            >
              {notifications.sms ? <Check className="h-4 w-4" /> : "Ativar"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-500" />
              <div>
                <h4 className="font-medium">Notificações Push</h4>
                <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
              </div>
            </div>
            <Button
              variant={notifications.push ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
            >
              {notifications.push ? <Check className="h-4 w-4" /> : "Ativar"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-orange-500" />
              <div>
                <h4 className="font-medium">Relatório Semanal</h4>
                <p className="text-sm text-muted-foreground">Receba resumo semanal por email</p>
              </div>
            </div>
            <Button
              variant={notifications.weeklyReport ? "default" : "outline"}
              size="sm"
              onClick={() => setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport })}
            >
              {notifications.weeklyReport ? <Check className="h-4 w-4" /> : "Ativar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Senha Atual</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-3 py-2 pr-10 border border-border rounded-md bg-background"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Nova Senha</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirmar Nova Senha</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
            />
          </div>
          <Button className="w-full md:w-auto">
            <Lock className="h-4 w-4 mr-2" />
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autenticação em Dois Fatores</CardTitle>
          <CardDescription>Adicione uma camada extra de segurança</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">2FA está desativado</h4>
              <p className="text-sm text-muted-foreground">
                Proteja sua conta com autenticação em dois fatores
              </p>
            </div>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Ativar 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>Gerencie onde você está logado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Windows Chrome (Atual)</h4>
                <p className="text-sm text-muted-foreground">São Paulo, Brasil • Agora</p>
              </div>
              <Badge variant="secondary">Atual</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">iPhone Safari</h4>
                <p className="text-sm text-muted-foreground">São Paulo, Brasil • 2 horas atrás</p>
              </div>
              <Button variant="outline" size="sm">Encerrar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>Personalize a aparência do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Tema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <h5 className="font-medium">Claro</h5>
                  <p className="text-sm text-muted-foreground">Tema claro</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted bg-muted">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-blue-500" />
                <div>
                  <h5 className="font-medium">Escuro</h5>
                  <p className="text-sm text-muted-foreground">Tema escuro</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-muted">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-gray-500" />
                <div>
                  <h5 className="font-medium">Sistema</h5>
                  <p className="text-sm text-muted-foreground">Seguir sistema</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Sidebar</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Sempre expandida</span>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Animações suaves</span>
              <Button variant="outline" size="sm">Ativado</Button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Idioma</h4>
          <Select defaultValue="pt-BR">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Configurações avançadas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Fuso Horário</label>
              <Select defaultValue="America/Sao_Paulo">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione o fuso horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">América/São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">América/Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Europa/Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato de Data</label>
              <Select defaultValue="DD/MM/YYYY">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/AAAA</SelectItem>
                  <SelectItem value="YYYY-MM-DD">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Moeda</label>
              <Select defaultValue="BRL">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                  <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Itens por Página</label>
              <Select defaultValue="10">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 itens</SelectItem>
                  <SelectItem value="25">25 itens</SelectItem>
                  <SelectItem value="50">50 itens</SelectItem>
                  <SelectItem value="100">100 itens</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cache e Performance</CardTitle>
          <CardDescription>Gerencie cache e otimização do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Limpar Cache</h4>
              <p className="text-sm text-muted-foreground">Remove dados temporários e melhora a performance</p>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Otimizar Banco de Dados</h4>
              <p className="text-sm text-muted-foreground">Reorganiza o banco para melhor performance</p>
            </div>
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Otimizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup Automático</CardTitle>
          <CardDescription>Configure backups automáticos dos seus dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Backup Diário</h4>
              <p className="text-sm text-muted-foreground">Backup automático todos os dias às 02:00</p>
            </div>
            <Button variant="default">
              <Check className="h-4 w-4 mr-2" />
              Ativo
            </Button>
          </div>
          <div>
            <label className="text-sm font-medium">Retenção de Backups</label>
            <Select defaultValue="30">
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Manual</CardTitle>
          <CardDescription>Faça backup dos seus dados quando necessário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex flex-col items-center gap-2">
              <Download className="h-6 w-6" />
              <span>Fazer Backup Completo</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Upload className="h-6 w-6" />
              <span>Restaurar Backup</span>
            </Button>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Atenção</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Restaurar um backup substituirá todos os dados atuais. Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Backups</CardTitle>
          <CardDescription>Backups recentes realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Backup Completo</h4>
                <p className="text-sm text-muted-foreground">Hoje, 02:00 • 145 MB</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Backup Completo</h4>
                <p className="text-sm text-muted-foreground">Ontem, 02:00 • 142 MB</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      case "system":
        return renderSystemSettings();
      case "backup":
        return renderBackupSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <ContentLayout title="Configurações">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de Configurações */}
        <div className="lg:w-64 space-y-2">
          <Card>
            <CardContent className="p-0">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${activeTab === tab.id ? "bg-muted border-r-2 border-primary" : ""
                      }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {renderContent()}

          {/* Botões de Ação */}
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button variant="outline">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
