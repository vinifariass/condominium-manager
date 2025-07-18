"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  Smartphone,
  Send,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle,
  Clock,
  Zap,
  Bell,
  TestTube,
  PlayCircle
} from "lucide-react";
import { 
  notificationService, 
  NOTIFICATION_TEMPLATES, 
  NotificationRecipient,
  NotificationTemplate 
} from "@/lib/notification-service";

interface NotificationPanelProps {
  className?: string;
}

export default function NotificationPanel({ className = "" }: NotificationPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>(NOTIFICATION_TEMPLATES[0]);
  const [testRecipients, setTestRecipients] = useState<NotificationRecipient[]>([
    {
      name: "João Silva",
      phone: "(11) 99999-9999",
      apartment: "101",
      preferredMethod: "whatsapp"
    }
  ]);

  const [customVariables, setCustomVariables] = useState<Record<string, string>>({
    condominium_name: "Condomínio Exemplo",
    visitor_name: "Maria Santos",
    visitor_phone: "(11) 88888-8888",
    arrival_time: new Date().toLocaleTimeString('pt-BR'),
    emergency_type: "Manutenção Elevador",
    instructions: "Usar escadas temporariamente",
    area: "Salão de Festas",
    date: new Date().toLocaleDateString('pt-BR'),
    start_time: "19:00",
    end_time: "23:00",
    amount: "150.00"
  });

  // Função para testar envio de notificação
  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.sendNotification({
        template: selectedTemplate,
        recipients: testRecipients,
        variables: customVariables,
        priority: "medium"
      });
      
      setLastResult(result);
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para teste rápido de chegada de visitante
  const handleVisitorTest = async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.notifyVisitorArrival(
        testRecipients[0].name,
        testRecipients[0].phone,
        "Carlos Pereira",
        "(11) 77777-7777",
        "Condomínio Exemplo",
        testRecipients[0].apartment || "101"
      );
      
      setLastResult(result);
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para teste de emergência
  const handleEmergencyTest = async () => {
    setIsLoading(true);
    try {
      const result = await notificationService.sendEmergencyAlert(
        "Interrupção no fornecimento de água",
        "Aguarde normalização do serviço. Previsão: 2 horas.",
        "Condomínio Exemplo",
        testRecipients
      );
      
      setLastResult(result);
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Central de Notificações</CardTitle>
              <CardDescription>
                Gerencie e teste notificações por SMS e WhatsApp
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Templates de Notificação</CardTitle>
            <CardDescription>Selecione um template para testar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {NOTIFICATION_TEMPLATES.map((template) => (
                <div 
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate.id === template.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Variáveis: {template.variables.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Teste */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurar Teste</CardTitle>
            <CardDescription>Configure destinatário e variáveis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Destinatário */}
            <div>
              <label className="text-sm font-medium">Destinatário de Teste</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Nome"
                  value={testRecipients[0]?.name || ""}
                  onChange={(e) => setTestRecipients([{
                    ...testRecipients[0],
                    name: e.target.value
                  }])}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                />
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={testRecipients[0]?.phone || ""}
                  onChange={(e) => setTestRecipients([{
                    ...testRecipients[0],
                    phone: e.target.value
                  }])}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Apartamento"
                  value={testRecipients[0]?.apartment || ""}
                  onChange={(e) => setTestRecipients([{
                    ...testRecipients[0],
                    apartment: e.target.value
                  }])}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                />
                <select
                  value={testRecipients[0]?.preferredMethod || "whatsapp"}
                  onChange={(e) => setTestRecipients([{
                    ...testRecipients[0],
                    preferredMethod: e.target.value as any
                  }])}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="both">Ambos</option>
                </select>
              </div>
            </div>

            {/* Variáveis Customizáveis */}
            <div>
              <label className="text-sm font-medium">Variáveis do Template</label>
              <div className="space-y-2 mt-1">
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable} className="flex gap-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded font-mono min-w-[120px]">
                      {variable}
                    </span>
                    <input
                      type="text"
                      value={customVariables[variable] || ""}
                      onChange={(e) => setCustomVariables({
                        ...customVariables,
                        [variable]: e.target.value
                      })}
                      className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
                      placeholder={`Valor para ${variable}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview da Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview das Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SMS Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-green-600" />
                <span className="font-medium">SMS</span>
              </div>
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <p className="text-sm">
                  {selectedTemplate.sms.replace(/\{\{(\w+)\}\}/g, (match, key) => 
                    customVariables[key] || `{{${key}}}`
                  )}
                </p>
              </div>
            </div>

            {/* WhatsApp Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">WhatsApp</span>
              </div>
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <p className="text-sm whitespace-pre-line">
                  {selectedTemplate.whatsapp.replace(/\{\{(\w+)\}\}/g, (match, key) => 
                    customVariables[key] || `{{${key}}}`
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações de Teste */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testes Rápidos</CardTitle>
          <CardDescription>Teste cenários comuns de notificação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button 
              onClick={handleTestNotification}
              disabled={isLoading}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <TestTube className="h-5 w-5" />
              <span className="text-sm">Testar Template</span>
            </Button>

            <Button 
              onClick={handleVisitorTest}
              disabled={isLoading}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">Visitante</span>
            </Button>

            <Button 
              onClick={handleEmergencyTest}
              disabled={isLoading}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-sm">Emergência</span>
            </Button>

            <Button 
              disabled={isLoading}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => {
                // Implementar teste de lembrete de pagamento
                console.log("Teste de lembrete de pagamento");
              }}
            >
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm">Lembrete</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado do Último Teste */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResult.results ? (
              <div className="space-y-2">
                {lastResult.results.map((result: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {result.method === 'sms' ? (
                        <Smartphone className="h-4 w-4" />
                      ) : (
                        <MessageCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm">{result.recipient} - {result.method.toUpperCase()}</span>
                    </div>
                    {result.success ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enviado
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Falhou
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-red-600">
                  {lastResult.error || "Erro desconhecido"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status de Carregamento */}
      {isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Enviando notificação...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
