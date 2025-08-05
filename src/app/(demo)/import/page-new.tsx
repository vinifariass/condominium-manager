"use client";

import React, { useState, useRef, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  Eye,
  Trash2,
  Save,
  FileText,
  Calendar,
  Wrench,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  Settings,
  Bell,
  Building2,
  FileDown,
  Loader2
} from "lucide-react";

interface ImportResult {
  total: number;
  success: number;
  errors: string[];
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  unit: string | null;
  active: boolean;
  condominiumId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'TELEGRAM';
  recipients: string[];
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export default function ImportPage() {
  // Estados para importação
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCondominium, setSelectedCondominium] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);

  // Estados para serviços
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceFilters, setServiceFilters] = useState({
    search: "",
    category: "",
    active: "all"
  });
  
  // Estados para notificações
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "EMAIL" as const,
    recipients: ""
  });
  const [sendingNotification, setSendingNotification] = useState(false);

  // Mock data
  const condominiums = [
    { id: "1", name: "Condomínio Residencial Exemplo" },
    { id: "2", name: "Edifício Central Plaza" },
    { id: "3", name: "Residencial Jardins" }
  ];

  const importTypes = [
    {
      value: "residents",
      label: "Moradores/Usuários",
      icon: Users,
      description: "Importar lista de moradores e usuários do sistema",
      template: "template-moradores.xlsx"
    },
    {
      value: "apartments",
      label: "Apartamentos", 
      icon: Building2,
      description: "Importar lista de apartamentos e suas informações",
      template: "template-apartamentos.xlsx"
    },
    {
      value: "services",
      label: "Serviços",
      icon: Wrench,
      description: "Importar catálogo de serviços disponíveis",
      template: "template-servicos.xlsx"
    }
  ];

  const serviceCategories = [
    "Manutenção",
    "Limpeza",
    "Segurança",
    "Jardinagem",
    "Portaria",
    "Administração",
    "Outros"
  ];

  // Carregar dados ao montar
  useEffect(() => {
    loadServices();
    loadNotificationHistory();
  }, []);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const params = new URLSearchParams();
      if (serviceFilters.search) params.append('search', serviceFilters.search);
      if (serviceFilters.category) params.append('category', serviceFilters.category);
      if (serviceFilters.active !== 'all') params.append('active', serviceFilters.active);

      const response = await fetch(`/api/services?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      setLoadingNotifications(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotificationHistory(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Funções de importação
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedType || !selectedCondominium) {
      alert("Por favor, selecione o arquivo, tipo de importação e condomínio.");
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);
      formData.append('condominiumId', selectedCondominium);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setImportResult(result);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao processar importação');
      }
    } catch (error) {
      console.error('Erro ao importar:', error);
      alert('Erro ao processar importação');
    } finally {
      setImporting(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  // Funções de notificação
  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message || !newNotification.recipients) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setSendingNotification(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newNotification,
          recipients: newNotification.recipients.split(',').map(r => r.trim()),
          condominiumId: selectedCondominium
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setNewNotification({
          title: "",
          message: "",
          type: "EMAIL",
          recipients: ""
        });
        loadNotificationHistory();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('Erro ao enviar notificação');
    } finally {
      setSendingNotification(false);
    }
  };

  const downloadTemplate = (templateName: string) => {
    alert(`Download do template: ${templateName}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'SMS':
        return <Smartphone className="h-4 w-4" />;
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4" />;
      case 'TELEGRAM':
        return <Send className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const selectedTypeInfo = importTypes.find(type => type.value === selectedType);

  return (
    <ContentLayout title="Importação e Serviços">
      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Importar Dados</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Aba de Importação */}
        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Importar Dados via Excel
                  </CardTitle>
                  <CardDescription>
                    Importe dados em massa para o sistema usando arquivos Excel (.xlsx) ou CSV.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Seleção do Tipo */}
                  <div className="space-y-3">
                    <Label>Tipo de Importação</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {importTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.value}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedType === type.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedType(type.value)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 mt-0.5 text-primary" />
                              <div className="flex-1">
                                <h4 className="font-medium">{type.label}</h4>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadTemplate(type.template);
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Template
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seleção do Condomínio */}
                  <div className="space-y-2">
                    <Label htmlFor="condominium">Condomínio</Label>
                    <Select value={selectedCondominium} onValueChange={setSelectedCondominium}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o condomínio" />
                      </SelectTrigger>
                      <SelectContent>
                        {condominiums.map((condo) => (
                          <SelectItem key={condo.id} value={condo.id}>
                            {condo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Upload do Arquivo */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo Excel/CSV</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <Input
                        id="file"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label htmlFor="file" className="cursor-pointer">
                        {file ? (
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">Clique para selecionar o arquivo</p>
                            <p className="text-sm text-muted-foreground">
                              Suporte para .xlsx, .xls e .csv (máx. 10MB)
                            </p>
                          </div>
                        )}
                      </Label>
                    </div>
                  </div>

                  {/* Progresso */}
                  {importing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Processando importação...</Label>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Botão de Importar */}
                  <Button 
                    onClick={handleImport} 
                    disabled={!file || !selectedType || !selectedCondominium || importing}
                    className="w-full"
                  >
                    {importing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {importing ? 'Importando...' : 'Iniciar Importação'}
                  </Button>
                </CardContent>
              </Card>

              {/* Resultado da Importação */}
              {importResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {importResult.errors.length === 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      Resultado da Importação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{importResult.total}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                        <p className="text-sm text-muted-foreground">Sucesso</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{importResult.errors.length}</p>
                        <p className="text-sm text-muted-foreground">Erros</p>
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <h4 className="font-medium text-yellow-800">Erros encontrados</h4>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="list-disc list-inside space-y-1">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index} className="text-sm text-yellow-700">{error}</li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li className="text-sm font-medium text-yellow-700">
                                ... e mais {importResult.errors.length - 5} erros
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {selectedTypeInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <selectedTypeInfo.icon className="h-5 w-5" />
                      {selectedTypeInfo.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedTypeInfo.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => downloadTemplate(selectedTypeInfo.template)}
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Baixar Template
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Instruções</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">Como importar:</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Baixe o template do tipo desejado</li>
                      <li>Preencha os dados seguindo o formato</li>
                      <li>Selecione o tipo e condomínio</li>
                      <li>Faça upload do arquivo</li>
                      <li>Clique em "Iniciar Importação"</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Serviços */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Catálogo de Serviços
              </CardTitle>
              <CardDescription>
                Gerencie os serviços disponíveis para os condomínios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <Input
                    id="search"
                    placeholder="Nome do serviço..."
                    value={serviceFilters.search}
                    onChange={(e) => setServiceFilters({...serviceFilters, search: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={serviceFilters.category} 
                    onValueChange={(value) => setServiceFilters({...serviceFilters, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as categorias</SelectItem>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={serviceFilters.active} 
                    onValueChange={(value) => setServiceFilters({...serviceFilters, active: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Ativos</SelectItem>
                      <SelectItem value="false">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={loadServices} disabled={loadingServices}>
                {loadingServices ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Atualizar Lista
              </Button>

              {/* Lista de Serviços */}
              <div className="space-y-4">
                {loadingServices ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-2">Carregando serviços...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground mt-2">Nenhum serviço encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium">{service.name}</h3>
                            <Badge variant={service.active ? "default" : "secondary"}>
                              {service.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {service.description}
                            </p>
                          )}

                          <div className="space-y-1 text-sm">
                            {service.category && (
                              <p><span className="font-medium">Categoria:</span> {service.category}</p>
                            )}
                            {service.price && (
                              <p>
                                <span className="font-medium">Preço:</span> R$ {service.price.toFixed(2)}
                                {service.unit && ` / ${service.unit}`}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enviar Nova Notificação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Notificação
                </CardTitle>
                <CardDescription>
                  Envie notificações por SMS, WhatsApp, Telegram ou Email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-title">Título</Label>
                  <Input
                    id="notification-title"
                    placeholder="Título da notificação"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-message">Mensagem</Label>
                  <Textarea
                    id="notification-message"
                    placeholder="Conteúdo da notificação"
                    rows={4}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-type">Canal</Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value: any) => setNewNotification({...newNotification, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="SMS">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="WHATSAPP">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="TELEGRAM">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Telegram
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-recipients">Destinatários</Label>
                  <Textarea
                    id="notification-recipients"
                    placeholder="Separe múltiplos destinatários por vírgula"
                    rows={3}
                    value={newNotification.recipients}
                    onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleSendNotification} 
                  disabled={sendingNotification}
                  className="w-full"
                >
                  {sendingNotification ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {sendingNotification ? 'Enviando...' : 'Enviar Notificação'}
                </Button>
              </CardContent>
            </Card>

            {/* Histórico de Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico de Notificações
                </CardTitle>
                <CardDescription>
                  Acompanhe o status das notificações enviadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingNotifications ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                      <p className="text-muted-foreground mt-2">Carregando histórico...</p>
                    </div>
                  ) : notificationHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Nenhuma notificação enviada</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {notificationHistory.map((notification) => (
                        <div key={notification.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getChannelIcon(notification.type)}
                              <h4 className="font-medium">{notification.title}</h4>
                            </div>
                            {getStatusBadge(notification.status)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{notification.recipients.length} destinatário(s)</span>
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          </div>

                          {notification.errorMessage && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                              {notification.errorMessage}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
