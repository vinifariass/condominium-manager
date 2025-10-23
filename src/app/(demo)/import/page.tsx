"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Contract {
  id: string;
  serviceId: string;
  serviceName: string;
  condominiumId: string;
  condominiumName: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  description: string | null;
  daysToExpire?: number;
  isExpiringSoon?: boolean;
  isExpired?: boolean;
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

  // Estados para contratos e vencimentos
  const [expiringContracts, setExpiringContracts] = useState<any[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [contractNotifications, setContractNotifications] = useState<any[]>([]);
  const [sendingContractNotification, setSendingContractNotification] = useState(false);

  // Estados para modal de notificação
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [currentNotificationType, setCurrentNotificationType] = useState('');
  const [currentContractId, setCurrentContractId] = useState('');
  const [notificationRecipients, setNotificationRecipients] = useState('');
  const [isAllContracts, setIsAllContracts] = useState(false);

  // Estados para condomínios
  const [condominiums, setCondominiums] = useState<Array<{id: string; name: string}>>([]);
  const [loadingCondominiums, setLoadingCondominiums] = useState(true);

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

  const loadCondominiums = useCallback(async () => {
    try {
      setLoadingCondominiums(true);
      const response = await fetch('/api/condominiums');
      if (response.ok) {
        const result = await response.json();
        setCondominiums(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar condomínios:', error);
    } finally {
      setLoadingCondominiums(false);
    }
  }, []);

  const loadServices = useCallback(async () => {
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
  }, [serviceFilters]);

  const loadNotificationHistory = useCallback(async () => {
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
  }, []);

  const loadExpiringContracts = useCallback(async () => {
    try {
      setLoadingContracts(true);
      const response = await fetch('/api/contracts?status=ACTIVE&daysToExpire=30');
      if (response.ok) {
        const data = await response.json();
        setExpiringContracts(data);
      }
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
    } finally {
      setLoadingContracts(false);
    }
  }, []);

  const loadContractNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/contract-notifications');
      if (response.ok) {
        const data = await response.json();
        setContractNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações de contrato:', error);
    }
  }, []);

  // Carregar dados ao montar
  useEffect(() => {
    loadCondominiums();
    loadServices();
    loadNotificationHistory();
    loadExpiringContracts();
    loadContractNotifications();
  }, [loadCondominiums, loadServices, loadNotificationHistory, loadExpiringContracts, loadContractNotifications]);

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

  const handleSendContractNotification = async (contractId: string, notificationType: string, recipients: string) => {
    if (!recipients.trim()) {
      alert("Por favor, informe os destinatários.");
      return;
    }

    setSendingContractNotification(true);
    try {
      const response = await fetch('/api/contract-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId,
          notificationType,
          recipients: recipients.split(',').map(r => r.trim())
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert(`✅ Notificação enviada com sucesso para o contrato ${result.contract.contractNumber}!`);
        } else {
          alert(`❌ ${result.message}`);
        }
        loadNotificationHistory();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Erro ao enviar notificação'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('❌ Erro ao enviar notificação');
    } finally {
      setSendingContractNotification(false);
    }
  };

  const handleSendAllContractNotifications = async (notificationType: string, recipients: string) => {
    if (!recipients.trim()) {
      alert("Por favor, informe os destinatários.");
      return;
    }

    setSendingContractNotification(true);
    try {
      const response = await fetch('/api/contract-notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationType,
          recipients: recipients.split(',').map(r => r.trim())
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.message}\n📊 Enviadas: ${result.sentNotifications}\n❌ Falhas: ${result.failedNotifications}`);
        loadNotificationHistory();
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Erro ao enviar notificações'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
      alert('❌ Erro ao enviar notificações');
    } finally {
      setSendingContractNotification(false);
    }
  };

  const openNotificationModal = (type: string, contractId: string = '', allContracts: boolean = false) => {
    setCurrentNotificationType(type);
    setCurrentContractId(contractId);
    setIsAllContracts(allContracts);
    setNotificationRecipients('');
    setShowNotificationModal(true);
  };

  const handleModalNotificationSend = async () => {
    if (!notificationRecipients.trim()) {
      alert("Por favor, informe os destinatários.");
      return;
    }

    setSendingContractNotification(true);
    try {
      if (isAllContracts) {
        await handleSendAllContractNotifications(currentNotificationType, notificationRecipients);
      } else {
        await handleSendContractNotification(currentContractId, currentNotificationType, notificationRecipients);
      }
      setShowNotificationModal(false);
      setNotificationRecipients('');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    } finally {
      setSendingContractNotification(false);
    }
  };

  const downloadTemplate = async (type: string) => {
    try {
      const response = await fetch(`/api/templates?type=${type}`);
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao baixar template');
        return;
      }

      // Criar blob e download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Nome do arquivo baseado no tipo
      const typeNames = {
        residents: 'moradores',
        apartments: 'apartamentos',
        services: 'servicos'
      };
      a.download = `template-${typeNames[type as keyof typeof typeNames] || type}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar template:', error);
      alert('Erro ao baixar template');
    }
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">Importar Dados</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="contracts">Vencimentos</TabsTrigger>
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
                                  downloadTemplate(type.value);
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
                        {loadingCondominiums ? (
                          <SelectItem value="loading" disabled>
                            Carregando condomínios...
                          </SelectItem>
                        ) : condominiums.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            Nenhum condomínio encontrado
                          </SelectItem>
                        ) : (
                          condominiums.map((condo) => (
                            <SelectItem key={condo.id} value={condo.id}>
                              {condo.name}
                            </SelectItem>
                          ))
                        )}
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
                      onClick={() => downloadTemplate(selectedTypeInfo.value)}
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
                      <li>Clique em &quot;Iniciar Importação&quot;</li>
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
                      <SelectItem value="all">Todas as categorias</SelectItem>
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

        {/* Aba Contratos e Vencimentos */}
        <TabsContent value="contracts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contratos Próximos ao Vencimento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Contratos Próximos ao Vencimento
                </CardTitle>
                <CardDescription>
                  Contratos que vencem nos próximos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingContracts ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Carregando contratos...</span>
                  </div>
                ) : expiringContracts.length === 0 ? (
                  <div className="text-center p-8">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-muted-foreground">Nenhum contrato próximo ao vencimento</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {expiringContracts.map((contract) => (
                      <div key={contract.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{contract.serviceName}</h4>
                            <p className="text-sm text-muted-foreground">{contract.condominiumName}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                contract.daysToExpire <= 7 ? "destructive" :
                                contract.daysToExpire <= 15 ? "secondary" : "outline"
                              }
                            >
                              {contract.daysToExpire} dias
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Contrato:</span>
                            <p className="font-medium">{contract.contractNumber}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vencimento:</span>
                            <p className="font-medium">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valor:</span>
                            <p className="font-medium">R$ {contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequência:</span>
                            <p className="font-medium">
                              {contract.paymentFrequency === 'MONTHLY' ? 'Mensal' :
                               contract.paymentFrequency === 'QUARTERLY' ? 'Trimestral' : 'Anual'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openNotificationModal('WHATSAPP', contract.id)}
                            disabled={sendingContractNotification}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            WhatsApp
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openNotificationModal('SMS', contract.id)}
                            disabled={sendingContractNotification}
                          >
                            <Smartphone className="h-4 w-4 mr-1" />
                            SMS
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openNotificationModal('TELEGRAM', contract.id)}
                            disabled={sendingContractNotification}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Telegram
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notificações em Massa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações Automáticas
                </CardTitle>
                <CardDescription>
                  Enviar notificações para todos os contratos próximos ao vencimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openNotificationModal('WHATSAPP', '', true)}
                    disabled={sendingContractNotification}
                    className="flex flex-col gap-1 h-auto py-3"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openNotificationModal('SMS', '', true)}
                    disabled={sendingContractNotification}
                    className="flex flex-col gap-1 h-auto py-3"
                  >
                    <Smartphone className="h-5 w-5" />
                    <span className="text-xs">SMS</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openNotificationModal('TELEGRAM', '', true)}
                    disabled={sendingContractNotification}
                    className="flex flex-col gap-1 h-auto py-3"
                  >
                    <Send className="h-5 w-5" />
                    <span className="text-xs">Telegram</span>
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Resumo de Vencimentos</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {expiringContracts.filter(c => c.daysToExpire <= 7).length}
                      </div>
                      <div className="text-xs text-red-600">≤ 7 dias</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {expiringContracts.filter(c => c.daysToExpire > 7 && c.daysToExpire <= 15).length}
                      </div>
                      <div className="text-xs text-yellow-600">8-15 dias</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {expiringContracts.filter(c => c.daysToExpire > 15).length}
                      </div>
                      <div className="text-xs text-blue-600">16-30 dias</div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    loadExpiringContracts();
                    loadContractNotifications();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Atualizar Dados
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para inserir destinatários */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Enviar Notificação por {
                currentNotificationType === 'WHATSAPP' ? 'WhatsApp' :
                currentNotificationType === 'SMS' ? 'SMS' : 'Telegram'
              }
            </DialogTitle>
            <DialogDescription>
              {isAllContracts 
                ? 'Insira os destinatários para enviar notificações de todos os contratos próximos ao vencimento.'
                : 'Insira os destinatários para este contrato específico.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">
                {currentNotificationType === 'WHATSAPP' && 'Números do WhatsApp'}
                {currentNotificationType === 'SMS' && 'Números de telefone'}
                {currentNotificationType === 'TELEGRAM' && 'IDs do Telegram'}
              </Label>
              <Textarea
                id="recipients"
                placeholder={
                  currentNotificationType === 'WHATSAPP' ? '+5511999999999, +5511888888888' :
                  currentNotificationType === 'SMS' ? '+5511999999999, +5511888888888' :
                  '@usuario1, @usuario2 ou ID1, ID2'
                }
                value={notificationRecipients}
                onChange={(e) => setNotificationRecipients(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separe múltiplos destinatários por vírgula
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNotificationModal(false)}
              disabled={sendingContractNotification}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleModalNotificationSend}
              disabled={sendingContractNotification || !notificationRecipients.trim()}
            >
              {sendingContractNotification ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {sendingContractNotification ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
