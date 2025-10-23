"use client";

import React, { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Camera,
  DollarSign,
  Timer,
  AlertCircle,
  Hammer,
  Home,
  Zap,
  Droplets,
  Wind,
  Lightbulb,
  Shield,
  Building,
  X
} from "lucide-react";

// Interfaces para tipagem
interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: 'electrical' | 'plumbing' | 'hvac' | 'general' | 'security' | 'cleaning' | 'landscaping' | 'elevator';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedBy: {
    name: string;
    apartment: string;
    phone: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    company: string;
    phone: string;
  };
  location: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  notes?: string;
}

interface MaintenanceFilters {
  status: string;
  category: string;
  priority: string;
  assignedTo: string;
  dateRange: string;
}

export default function MaintenancePage() {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MaintenanceFilters>({
    status: "all",
    category: "all",
    priority: "all",
    assignedTo: "all",
    dateRange: "all"
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);

  // Dados mockados
  const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
      id: "1",
      title: "Vazamento na cozinha",
      description: "Vazamento embaixo da pia da cozinha, água acumulando no chão",
      category: "plumbing",
      priority: "high",
      status: "in_progress",
      requestedBy: {
        name: "Maria Silva",
        apartment: "Apt 101",
        phone: "(11) 99999-1234",
        email: "maria.silva@email.com"
      },
      assignedTo: {
        name: "João Santos",
        company: "Hidráulica Santos",
        phone: "(11) 98888-5678"
      },
      location: "Cozinha - Apartamento 101",
      estimatedCost: 250.00,
      scheduledDate: "2024-12-16T14:00:00Z",
      createdAt: "2024-12-15T09:30:00Z",
      updatedAt: "2024-12-15T10:45:00Z",
      notes: "Necessário verificar se o problema se estende para outros apartamentos"
    },
    {
      id: "2",
      title: "Lâmpada queimada no corredor",
      description: "Lâmpada do corredor do 3º andar não está funcionando",
      category: "electrical",
      priority: "medium",
      status: "pending",
      requestedBy: {
        name: "Carlos Oliveira",
        apartment: "Apt 305",
        phone: "(11) 99999-5678",
        email: "carlos.oliveira@email.com"
      },
      location: "Corredor - 3º Andar",
      estimatedCost: 50.00,
      createdAt: "2024-12-15T16:20:00Z",
      updatedAt: "2024-12-15T16:20:00Z"
    },
    {
      id: "3",
      title: "Ar condicionado com ruído",
      description: "Ar condicionado fazendo ruído excessivo e não gelando adequadamente",
      category: "hvac",
      priority: "medium",
      status: "assigned",
      requestedBy: {
        name: "Ana Costa",
        apartment: "Apt 204",
        phone: "(11) 99999-9012",
        email: "ana.costa@email.com"
      },
      assignedTo: {
        name: "Refrigeração Total",
        company: "Refrigeração Total Ltda",
        phone: "(11) 98888-1234"
      },
      location: "Sala - Apartamento 204",
      estimatedCost: 180.00,
      scheduledDate: "2024-12-17T08:00:00Z",
      createdAt: "2024-12-14T11:15:00Z",
      updatedAt: "2024-12-15T08:30:00Z"
    },
    {
      id: "4",
      title: "Elevador com problema",
      description: "Elevador fazendo ruído estranho e parando entre andares",
      category: "elevator",
      priority: "urgent",
      status: "assigned",
      requestedBy: {
        name: "Síndico",
        apartment: "Administração",
        phone: "(11) 99999-0000",
        email: "sindico@condominio.com"
      },
      assignedTo: {
        name: "TecElevadores",
        company: "TecElevadores Manutenção",
        phone: "(11) 98888-0000"
      },
      location: "Elevador Principal",
      estimatedCost: 500.00,
      scheduledDate: "2024-12-16T08:00:00Z",
      createdAt: "2024-12-15T07:45:00Z",
      updatedAt: "2024-12-15T08:00:00Z",
      notes: "URGENTE: Elevador principal fora de serviço"
    },
    {
      id: "5",
      title: "Limpeza da caixa d'água",
      description: "Limpeza semestral da caixa d'água conforme programação",
      category: "cleaning",
      priority: "low",
      status: "completed",
      requestedBy: {
        name: "Administração",
        apartment: "Administração",
        phone: "(11) 99999-0000",
        email: "admin@condominio.com"
      },
      assignedTo: {
        name: "Limpa Água",
        company: "Limpa Água Serviços",
        phone: "(11) 98888-2222"
      },
      location: "Área Técnica - Caixa d'Água",
      estimatedCost: 300.00,
      actualCost: 280.00,
      scheduledDate: "2024-12-10T08:00:00Z",
      completedDate: "2024-12-10T12:30:00Z",
      createdAt: "2024-12-01T10:00:00Z",
      updatedAt: "2024-12-10T12:30:00Z"
    }
  ];

  // Computadas
  const filteredRequests = useMemo(() => {
    let filtered = [...mockMaintenanceRequests, ...maintenanceRequests];

    // Filtro por texto de busca
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros por categoria
    if (filters.status !== "all") {
      filtered = filtered.filter(request => request.status === filters.status);
    }
    if (filters.category !== "all") {
      filtered = filtered.filter(request => request.category === filters.category);
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter(request => request.priority === filters.priority);
    }

    return filtered;
  }, [searchTerm, filters, maintenanceRequests]);

  // Estatísticas
  const stats = useMemo(() => {
    const all = [...mockMaintenanceRequests, ...maintenanceRequests];
    return {
      total: all.length,
      pending: all.filter(r => r.status === 'pending').length,
      inProgress: all.filter(r => r.status === 'in_progress' || r.status === 'assigned').length,
      completed: all.filter(r => r.status === 'completed').length,
      urgent: all.filter(r => r.priority === 'urgent').length,
      avgCost: all.filter(r => r.actualCost).reduce((sum, r) => sum + (r.actualCost || 0), 0) / all.filter(r => r.actualCost).length || 0
    };
  }, [maintenanceRequests]);

  // Funções
  const handleCreateRequest = (requestData: Partial<MaintenanceRequest>) => {
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      title: requestData.title || "",
      description: requestData.description || "",
      category: requestData.category || "general",
      priority: requestData.priority || "medium",
      status: "pending",
      requestedBy: requestData.requestedBy || {
        name: "",
        apartment: "",
        phone: "",
        email: ""
      },
      location: requestData.location || "",
      estimatedCost: requestData.estimatedCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMaintenanceRequests(prev => [newRequest, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleEditRequest = (requestData: Partial<MaintenanceRequest>) => {
    if (!selectedRequest) return;

    const updatedRequest = {
      ...selectedRequest,
      ...requestData,
      updatedAt: new Date().toISOString()
    };

    setMaintenanceRequests(prev => 
      prev.map(req => req.id === selectedRequest.id ? updatedRequest : req)
    );
    setIsEditModalOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (id: string) => {
    setMaintenanceRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'assigned': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'in_progress': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electrical': return <Zap className="h-5 w-5" />;
      case 'plumbing': return <Droplets className="h-5 w-5" />;
      case 'hvac': return <Wind className="h-5 w-5" />;
      case 'general': return <Hammer className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'cleaning': return <Lightbulb className="h-5 w-5" />;
      case 'landscaping': return <Home className="h-5 w-5" />;
      case 'elevator': return <Building className="h-5 w-5" />;
      default: return <Wrench className="h-5 w-5" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <ContentLayout title="Manutenção">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Solicitações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Timer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Executando
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <p className="text-xs text-muted-foreground">
                Prioridade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.avgCost)}</div>
              <p className="text-xs text-muted-foreground">
                Por serviço
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, descrição, solicitante ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="assigned">Atribuída</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="electrical">Elétrica</SelectItem>
                  <SelectItem value="plumbing">Hidráulica</SelectItem>
                  <SelectItem value="hvac">Ar Condicionado</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                  <SelectItem value="landscaping">Jardinagem</SelectItem>
                  <SelectItem value="elevator">Elevador</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Solicitações */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Manutenção</CardTitle>
            <CardDescription>
              Gerencie todas as solicitações de manutenção do condomínio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(request.category)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{request.title}</h4>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority === 'low' && 'Baixa'}
                          {request.priority === 'medium' && 'Média'}
                          {request.priority === 'high' && 'Alta'}
                          {request.priority === 'urgent' && 'Urgente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{request.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {request.requestedBy.name} - {request.requestedBy.apartment}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {request.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        {request.estimatedCost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(request.estimatedCost)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status === 'pending' && 'Pendente'}
                      {request.status === 'assigned' && 'Atribuída'}
                      {request.status === 'in_progress' && 'Em Andamento'}
                      {request.status === 'completed' && 'Concluída'}
                      {request.status === 'cancelled' && 'Cancelada'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewRequest(request)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(request)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma solicitação encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        {isCreateModalOpen && (
          <CreateMaintenanceModal
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateRequest}
          />
        )}

        {/* Modal de Edição */}
        {isEditModalOpen && selectedRequest && (
          <EditMaintenanceModal
            request={selectedRequest}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRequest(null);
            }}
            onSubmit={handleEditRequest}
          />
        )}

        {/* Modal de Visualização */}
        {isViewModalOpen && selectedRequest && (
          <ViewMaintenanceModal
            request={selectedRequest}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </ContentLayout>
  );
}

// Componente Modal de Criação
function CreateMaintenanceModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: Partial<MaintenanceRequest>) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium",
    location: "",
    estimatedCost: "",
    requestedBy: {
      name: "",
      apartment: "",
      phone: "",
      email: ""
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: formData.category as MaintenanceRequest['category'],
      priority: formData.priority as MaintenanceRequest['priority'],
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Nova Solicitação de Manutenção</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Vazamento na cozinha"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Localização</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Cozinha - Apt 101"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Descrição</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o problema detalhadamente..."
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Categoria</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Elétrica</SelectItem>
                  <SelectItem value="plumbing">Hidráulica</SelectItem>
                  <SelectItem value="hvac">Ar Condicionado</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                  <SelectItem value="landscaping">Jardinagem</SelectItem>
                  <SelectItem value="elevator">Elevador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Prioridade</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Custo Estimado (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Dados do Solicitante</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Nome</label>
                <Input
                  value={formData.requestedBy.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    requestedBy: { ...prev.requestedBy, name: e.target.value }
                  }))}
                  placeholder="Nome do solicitante"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Apartamento</label>
                <Input
                  value={formData.requestedBy.apartment}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    requestedBy: { ...prev.requestedBy, apartment: e.target.value }
                  }))}
                  placeholder="Ex: Apt 101"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Telefone</label>
                <Input
                  value={formData.requestedBy.phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    requestedBy: { ...prev.requestedBy, phone: e.target.value }
                  }))}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Email</label>
                <Input
                  type="email"
                  value={formData.requestedBy.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    requestedBy: { ...prev.requestedBy, email: e.target.value }
                  }))}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Criar Solicitação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal de Edição
function EditMaintenanceModal({ request, onClose, onSubmit }: {
  request: MaintenanceRequest;
  onClose: () => void;
  onSubmit: (data: Partial<MaintenanceRequest>) => void;
}) {
  const [formData, setFormData] = useState({
    title: request.title,
    description: request.description,
    category: request.category,
    priority: request.priority,
    status: request.status,
    location: request.location,
    estimatedCost: request.estimatedCost?.toString() || "",
    actualCost: request.actualCost?.toString() || "",
    assignedTo: request.assignedTo || { name: "", company: "", phone: "" },
    notes: request.notes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
      actualCost: formData.actualCost ? parseFloat(formData.actualCost) : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Editar Solicitação</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Status</label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as MaintenanceRequest['status'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="assigned">Atribuída</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Descrição</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Categoria</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as MaintenanceRequest['category'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Elétrica</SelectItem>
                  <SelectItem value="plumbing">Hidráulica</SelectItem>
                  <SelectItem value="hvac">Ar Condicionado</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="cleaning">Limpeza</SelectItem>
                  <SelectItem value="landscaping">Jardinagem</SelectItem>
                  <SelectItem value="elevator">Elevador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Prioridade</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as MaintenanceRequest['priority'] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Custo Estimado</label>
              <Input
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Custo Real</label>
              <Input
                type="number"
                step="0.01"
                value={formData.actualCost}
                onChange={(e) => setFormData(prev => ({ ...prev, actualCost: e.target.value }))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Responsável pela Execução</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Nome/Empresa</label>
                <Input
                  value={formData.assignedTo.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    assignedTo: { ...prev.assignedTo, name: e.target.value }
                  }))}
                  placeholder="Nome do prestador"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Empresa</label>
                <Input
                  value={formData.assignedTo.company}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    assignedTo: { ...prev.assignedTo, company: e.target.value }
                  }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Telefone</label>
                <Input
                  value={formData.assignedTo.phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    assignedTo: { ...prev.assignedTo, phone: e.target.value }
                  }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Observações</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Adicione observações sobre a execução do serviço..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal de Visualização
function ViewMaintenanceModal({ request, onClose }: {
  request: MaintenanceRequest;
  onClose: () => void;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'assigned': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'in_progress': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Detalhes da Solicitação</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{request.title}</h4>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority === 'low' && 'Baixa'}
                  {request.priority === 'medium' && 'Média'}
                  {request.priority === 'high' && 'Alta'}
                  {request.priority === 'urgent' && 'Urgente'}
                </Badge>
                <Badge className={getStatusColor(request.status)}>
                  {request.status === 'pending' && 'Pendente'}
                  {request.status === 'assigned' && 'Atribuída'}
                  {request.status === 'in_progress' && 'Em Andamento'}
                  {request.status === 'completed' && 'Concluída'}
                  {request.status === 'cancelled' && 'Cancelada'}
                </Badge>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{request.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categoria:</span>
                  <span className="text-sm font-medium">
                    {request.category === 'electrical' && 'Elétrica'}
                    {request.category === 'plumbing' && 'Hidráulica'}
                    {request.category === 'hvac' && 'Ar Condicionado'}
                    {request.category === 'general' && 'Geral'}
                    {request.category === 'security' && 'Segurança'}
                    {request.category === 'cleaning' && 'Limpeza'}
                    {request.category === 'landscaping' && 'Jardinagem'}
                    {request.category === 'elevator' && 'Elevador'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Localização:</span>
                  <span className="text-sm font-medium">{request.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Criado em:</span>
                  <span className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Atualizado em:</span>
                  <span className="text-sm font-medium">{new Date(request.updatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Solicitante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <span className="text-sm font-medium">{request.requestedBy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Apartamento:</span>
                  <span className="text-sm font-medium">{request.requestedBy.apartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Telefone:</span>
                  <span className="text-sm font-medium">{request.requestedBy.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm font-medium">{request.requestedBy.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {request.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Responsável pela Execução</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Nome:</span>
                    <span className="text-sm font-medium">{request.assignedTo.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Empresa:</span>
                    <span className="text-sm font-medium">{request.assignedTo.company}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Telefone:</span>
                    <span className="text-sm font-medium">{request.assignedTo.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Custos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.estimatedCost && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Custo Estimado:</span>
                    <span className="text-sm font-medium">{formatCurrency(request.estimatedCost)}</span>
                  </div>
                )}
                {request.actualCost && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Custo Real:</span>
                    <span className="text-sm font-medium">{formatCurrency(request.actualCost)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Datas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.scheduledDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Agendado para:</span>
                    <span className="text-sm font-medium">{new Date(request.scheduledDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {request.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Concluído em:</span>
                    <span className="text-sm font-medium">{new Date(request.completedDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {request.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">{request.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
