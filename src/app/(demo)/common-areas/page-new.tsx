"use client";

import React, { useState, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Clock,
  Calendar,
  Star,
  Eye,
  Edit,
  Utensils,
  Waves,
  TreePine,
  Dumbbell,
  Car,
  Gamepad2,
  Coffee,
  Baby,
  X,
  Save,
  CalendarDays,
  Loader2,
  Trash2,
  AlertTriangle
} from "lucide-react";

// Interface para área comum
interface CommonArea {
  id: number;
  name: string;
  condominium: string;
  condominiumId: number;
  type: string;
  capacity: number;
  hourlyRate: number;
  minimumHours: number;
  maxAdvanceBooking: number;
  status: string;
  amenities: string[];
  rules: string[];
  availability: string;
  lastMaintenance: string;
  nextMaintenance: string;
  description: string;
  icon: any;
  image?: string;
}

// Interface para formulário de nova área
interface NewAreaForm {
  name: string;
  condominiumId: string;
  type: string;
  capacity: string;
  hourlyRate: string;
  minimumHours: string;
  maxAdvanceBooking: string;
  status: string;
  description: string;
  availability: string;
  amenities: string;
  rules: string;
}

// Lista de condomínios para seleção
const condominiums = [
  { id: 1, name: "Condomínio Santos Dumont" },
  { id: 2, name: "Condomínio Barra Garden" },
  { id: 3, name: "Condomínio Praia Azul" },
  { id: 4, name: "Condomínio Cachoeira Dourada" },
  { id: 5, name: "Condomínio Recanto" },
  { id: 6, name: "Condomínio Vivenda" }
];

// Tipos de área disponíveis
const areaTypes = [
  { value: "Festa", label: "Festa", icon: Utensils },
  { value: "Esporte", label: "Esporte", icon: Gamepad2 },
  { value: "Lazer", label: "Lazer", icon: Waves },
  { value: "Fitness", label: "Fitness", icon: Dumbbell },
  { value: "Infantil", label: "Infantil", icon: Baby },
  { value: "Gourmet", label: "Gourmet", icon: Coffee },
  { value: "Relaxamento", label: "Relaxamento", icon: TreePine },
  { value: "Estacionamento", label: "Estacionamento", icon: Car }
];

// Modal para cadastrar nova área comum
const AddAreaModal = ({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (newArea: CommonArea) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewAreaForm>({
    name: "",
    condominiumId: "",
    type: "",
    capacity: "",
    hourlyRate: "0",
    minimumHours: "1",
    maxAdvanceBooking: "30",
    status: "Disponível",
    description: "",
    availability: "Todos os dias, 8h às 22h",
    amenities: "",
    rules: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      condominiumId: "",
      type: "",
      capacity: "",
      hourlyRate: "0",
      minimumHours: "1",
      maxAdvanceBooking: "30",
      status: "Disponível",
      description: "",
      availability: "Todos os dias, 8h às 22h",
      amenities: "",
      rules: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.condominiumId || !formData.type || !formData.capacity) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedCondominium = condominiums.find(c => c.id === parseInt(formData.condominiumId));
      const selectedType = areaTypes.find(t => t.value === formData.type);

      const newArea: CommonArea = {
        id: Date.now(),
        name: formData.name,
        condominium: selectedCondominium?.name || "",
        condominiumId: parseInt(formData.condominiumId),
        type: formData.type,
        capacity: parseInt(formData.capacity),
        hourlyRate: parseFloat(formData.hourlyRate),
        minimumHours: parseInt(formData.minimumHours),
        maxAdvanceBooking: parseInt(formData.maxAdvanceBooking),
        status: formData.status,
        amenities: formData.amenities ? formData.amenities.split(",").map(item => item.trim()) : [],
        rules: formData.rules ? formData.rules.split(",").map(item => item.trim()) : [],
        availability: formData.availability,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: formData.description,
        icon: selectedType?.icon || MapPin
      };

      onSave(newArea);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar área:", error);
      alert("Erro ao salvar área. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Cadastrar Nova Área Comum</h2>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Área *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Salão de Festas Principal"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="condominium">Condomínio *</Label>
                <Select 
                  value={formData.condominiumId} 
                  onValueChange={(value) => setFormData({...formData, condominiumId: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o condomínio" />
                  </SelectTrigger>
                  <SelectContent>
                    {condominiums.map(condo => (
                      <SelectItem key={condo.id} value={condo.id.toString()}>{condo.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Área *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                    <SelectItem value="Indisponível">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background resize-none"
                rows={3}
                placeholder="Descreva a área comum..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Configurações</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="50"
                  min="1"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Valor por Hora (R$)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  placeholder="0.00"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="minimumHours">Horas Mínimas</Label>
                <Input
                  id="minimumHours"
                  type="number"
                  value={formData.minimumHours}
                  onChange={(e) => setFormData({...formData, minimumHours: e.target.value})}
                  placeholder="1"
                  min="1"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="maxAdvanceBooking">Antecedência (dias)</Label>
                <Input
                  id="maxAdvanceBooking"
                  type="number"
                  value={formData.maxAdvanceBooking}
                  onChange={(e) => setFormData({...formData, maxAdvanceBooking: e.target.value})}
                  placeholder="30"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availability">Horário de Funcionamento</Label>
              <Input
                id="availability"
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
                placeholder="Ex: Todos os dias, 8h às 22h"
                disabled={loading}
              />
            </div>
          </div>

          {/* Comodidades e Regras */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Comodidades e Regras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amenities">Comodidades</Label>
                <textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background resize-none"
                  rows={4}
                  placeholder="Separe as comodidades por vírgula..."
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ex: Som ambiente, Churrasqueira, Geladeira, Mesas e cadeiras
                </p>
              </div>
              <div>
                <Label htmlFor="rules">Regras</Label>
                <textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData({...formData, rules: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background resize-none"
                  rows={4}
                  placeholder="Separe as regras por vírgula..."
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ex: Máximo 50 pessoas, Música até 22h, Limpeza obrigatória
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cadastrar Área
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CommonAreasPage() {
  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [condominiumFilter, setCondominiumFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Estado das áreas comuns
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);

  // Dados mockados para inicialização
  const initialAreas: CommonArea[] = [
    {
      id: 1,
      name: "Salão de Festas Principal",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      type: "Festa",
      capacity: 80,
      hourlyRate: 150.00,
      minimumHours: 4,
      maxAdvanceBooking: 60,
      status: "Disponível",
      amenities: ["Som ambiente", "Churrasqueira", "Geladeira", "Mesas e cadeiras"],
      rules: [
        "Máximo 80 pessoas",
        "Música até 22h",
        "Limpeza obrigatória após uso",
        "Caução de R$ 500,00"
      ],
      availability: "Todos os dias, 8h às 23h",
      lastMaintenance: "2024-10-15",
      nextMaintenance: "2024-12-15",
      description: "Amplo salão com churrasqueira e vista para jardim",
      icon: Utensils
    },
    {
      id: 2,
      name: "Piscina Adulto",
      condominium: "Condomínio Barra Garden",
      condominiumId: 2,
      type: "Lazer",
      capacity: 50,
      hourlyRate: 0,
      minimumHours: 1,
      maxAdvanceBooking: 7,
      status: "Disponível",
      amenities: ["Raia de 25m", "Área de descanso", "Chuveiros", "Vestiário"],
      rules: [
        "Uso de touca obrigatório",
        "Crianças até 12 anos acompanhadas",
        "Máximo 50 pessoas",
        "Funcionamento: 6h às 22h"
      ],
      availability: "Todos os dias, 6h às 22h",
      lastMaintenance: "2024-11-01",
      nextMaintenance: "2024-12-01",
      description: "Piscina semiolímpica com sistema de aquecimento",
      icon: Waves
    },
    {
      id: 3,
      name: "Quadra Poliesportiva",
      condominium: "Condomínio Praia Azul",
      condominiumId: 3,
      type: "Esporte",
      capacity: 20,
      hourlyRate: 80.00,
      minimumHours: 2,
      maxAdvanceBooking: 30,
      status: "Disponível",
      amenities: ["Iluminação noturna", "Arquibancada", "Vestiário", "Material esportivo"],
      rules: [
        "Uso de tênis obrigatório",
        "Reserva por blocos de 2h",
        "Máximo 20 pessoas",
        "Responsabilidade por danos"
      ],
      availability: "Todos os dias, 6h às 22h",
      lastMaintenance: "2024-09-20",
      nextMaintenance: "2024-12-20",
      description: "Quadra oficial para futebol, vôlei e basquete",
      icon: Gamepad2
    },
    {
      id: 4,
      name: "Academia Fitness",
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      type: "Fitness",
      capacity: 15,
      hourlyRate: 0,
      minimumHours: 1,
      maxAdvanceBooking: 3,
      status: "Disponível",
      amenities: ["Aparelhos de musculação", "Esteiras", "Ar condicionado", "Espelhos"],
      rules: [
        "Roupas adequadas obrigatórias",
        "Toalha obrigatória",
        "Máximo 15 pessoas",
        "Limpeza dos aparelhos após uso"
      ],
      availability: "Segunda a sábado, 5h às 23h",
      lastMaintenance: "2024-11-10",
      nextMaintenance: "2024-12-10",
      description: "Academia completa com equipamentos modernos",
      icon: Dumbbell
    },
    {
      id: 5,
      name: "Playground Infantil",
      condominium: "Condomínio Recanto",
      condominiumId: 5,
      type: "Infantil",
      capacity: 30,
      hourlyRate: 0,
      minimumHours: 1,
      maxAdvanceBooking: 7,
      status: "Em Manutenção",
      amenities: ["Brinquedos seguros", "Piso emborrachado", "Bancos", "Cobertura"],
      rules: [
        "Crianças até 12 anos",
        "Acompanhantes responsáveis",
        "Não permitido animais",
        "Uso por conta e risco"
      ],
      availability: "Todos os dias, 7h às 18h",
      lastMaintenance: "2024-11-15",
      nextMaintenance: "2024-11-30",
      description: "Área recreativa segura para crianças",
      icon: Baby
    }
  ];

  // Função para carregar dados (simula API)
  const loadAreas = async () => {
    setLoading(true);
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCommonAreas(initialAreas);
    } catch (error) {
      console.error("Erro ao carregar áreas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadAreas();
  }, []);

  // Função para filtrar áreas
  const filteredAreas = commonAreas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.condominium.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || area.status === statusFilter;
    const matchesType = typeFilter === "all" || area.type === typeFilter;
    const matchesCondominium = condominiumFilter === "all" || area.condominiumId.toString() === condominiumFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesCondominium;
  });

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCondominiumFilter("all");
  };

  // Função para adicionar nova área
  const handleAddArea = (newArea: CommonArea) => {
    setCommonAreas(prev => [...prev, newArea]);
  };

  // Função para deletar área
  const handleDeleteArea = async (areaId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta área comum?")) {
      return;
    }

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      setCommonAreas(prev => prev.filter(area => area.id !== areaId));
    } catch (error) {
      console.error("Erro ao excluir área:", error);
      alert("Erro ao excluir área. Tente novamente.");
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Ocupado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Em Manutenção":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Indisponível":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Função para obter cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Festa":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Esporte":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Lazer":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "Fitness":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Infantil":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      case "Gourmet":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Relaxamento":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Estacionamento":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    if (value === 0) return "Gratuito";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estatísticas
  const totalAreas = filteredAreas.length;
  const availableAreas = filteredAreas.filter(area => area.status === "Disponível").length;
  const maintenanceAreas = filteredAreas.filter(area => area.status === "Em Manutenção").length;
  const paidAreas = filteredAreas.filter(area => area.hourlyRate > 0).length;

  if (loading) {
    return (
      <ContentLayout title="Áreas Comuns">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando áreas comuns...</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Áreas Comuns">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Áreas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAreas}</div>
              <p className="text-xs text-muted-foreground">
                {commonAreas.length} áreas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableAreas}</div>
              <p className="text-xs text-muted-foreground">
                {maintenanceAreas} em manutenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Áreas Pagas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidAreas}</div>
              <p className="text-xs text-muted-foreground">
                {filteredAreas.length - paidAreas} gratuitas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredAreas.reduce((sum, area) => sum + area.capacity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas simultâneas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar áreas comuns..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {(statusFilter !== "all" || typeFilter !== "all" || condominiumFilter !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {[statusFilter !== "all" ? 1 : 0, typeFilter !== "all" ? 1 : 0, condominiumFilter !== "all" ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Área
              </Button>
            </div>
            
            {/* Filtros Avançados */}
            {showFilters && (
              <div className="bg-muted/50 p-4 rounded-lg mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filtros Avançados</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="Disponível">Disponível</SelectItem>
                        <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                        <SelectItem value="Indisponível">Indisponível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Área</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        {areaTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condomínio</Label>
                    <Select value={condominiumFilter} onValueChange={setCondominiumFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Condomínios</SelectItem>
                        {condominiums.map(condo => (
                          <SelectItem key={condo.id} value={condo.id.toString()}>{condo.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Resultado dos Filtros */}
        {filteredAreas.length !== commonAreas.length && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Exibindo {filteredAreas.length} de {commonAreas.length} áreas comuns
            </p>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Ver todas
            </Button>
          </div>
        )}

        {/* Lista de Áreas Comuns */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Áreas Comuns</CardTitle>
            <CardDescription>
              {filteredAreas.length === 0 && commonAreas.length > 0
                ? "Nenhuma área encontrada com os filtros aplicados"
                : `${filteredAreas.length} áreas encontradas`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAreas.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhuma área encontrada</h3>
                <p className="text-muted-foreground">
                  {commonAreas.length === 0 
                    ? "Cadastre a primeira área comum do condomínio"
                    : "Tente ajustar os filtros de busca"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAreas.map((area) => {
                  const IconComponent = area.icon;
                  return (
                    <div
                      key={area.id}
                      className="flex flex-col lg:flex-row lg:items-start justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 space-y-4">
                        {/* Cabeçalho */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">{area.name}</h3>
                                <p className="text-sm text-muted-foreground">{area.condominium}</p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(area.status)}>
                                  {area.status}
                                </Badge>
                                <Badge className={getTypeColor(area.type)}>
                                  {area.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-2">{area.description}</p>
                          </div>
                        </div>

                        {/* Informações Principais */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Informações Básicas</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Capacidade: {area.capacity} pessoas</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Valor: {formatCurrency(area.hourlyRate)}/hora</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Antecedência: {area.maxAdvanceBooking} dias</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Funcionamento</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p><span className="font-medium text-foreground">Horário:</span> {area.availability}</p>
                              <p><span className="font-medium text-foreground">Mínimo:</span> {area.minimumHours}h por reserva</p>
                              <p><span className="font-medium text-foreground">Última manutenção:</span> {new Date(area.lastMaintenance).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground">Comodidades</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              {area.amenities.slice(0, 3).map((amenity, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  <span>{amenity}</span>
                                </div>
                              ))}
                              {area.amenities.length > 3 && (
                                <p className="text-xs">+{area.amenities.length - 3} outras comodidades</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={area.status !== "Disponível"}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Reservar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteArea(area.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de Cadastro */}
      <AddAreaModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddArea}
      />
    </ContentLayout>
  );
}
