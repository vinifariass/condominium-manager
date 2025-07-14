"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CalendarDays
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
}

// Modal para editar área comum
const EditAreaModal = ({ 
  isOpen, 
  onClose, 
  area, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  area: CommonArea | null;
  onSave: (updatedArea: CommonArea) => void;
}) => {
  const [formData, setFormData] = useState<CommonArea | null>(area);

  React.useEffect(() => {
    setFormData(area);
  }, [area]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Editar Área Comum</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome da Área</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              >
                <option value="Festa">Festa</option>
                <option value="Esporte">Esporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Fitness">Fitness</option>
                <option value="Infantil">Infantil</option>
                <option value="Estacionamento">Estacionamento</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Capacidade</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Valor por Hora (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Horas Mínimas</label>
              <input
                type="number"
                value={formData.minimumHours}
                onChange={(e) => setFormData({...formData, minimumHours: parseInt(e.target.value)})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            >
              <option value="Disponível">Disponível</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Em Manutenção">Em Manutenção</option>
              <option value="Indisponível">Indisponível</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Horário de Funcionamento</label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({...formData, availability: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Ex: Todos os dias, 8h às 22h"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para reservar área comum
const ReserveAreaModal = ({ 
  isOpen, 
  onClose, 
  area 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  area: CommonArea | null;
}) => {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    resident: "",
    apartment: "",
    block: "",
    phone: "",
    notes: "",
    estimatedGuests: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar a reserva
    console.log("Nova reserva:", { area: area?.name, ...formData });
    onClose();
  };

  const calculateTotal = () => {
    if (!area || !formData.startTime || !formData.endTime) return 0;
    
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return Math.max(hours, area.minimumHours) * area.hourlyRate;
  };

  if (!isOpen || !area) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Reservar: {area.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Data da Reserva</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Hora Início</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hora Fim</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Nome do Solicitante</label>
            <input
              type="text"
              value={formData.resident}
              onChange={(e) => setFormData({...formData, resident: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Apartamento</label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bloco</label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({...formData, block: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Número Estimado de Pessoas</label>
            <input
              type="number"
              value={formData.estimatedGuests}
              onChange={(e) => setFormData({...formData, estimatedGuests: parseInt(e.target.value)})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
              min="1"
              max={area.capacity}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Capacidade máxima: {area.capacity} pessoas
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              rows={3}
            />
          </div>

          {area.hourlyRate > 0 && (
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Valor Total:</span>
                <span className="text-lg font-bold text-primary">
                  R$ {calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo {area.minimumHours}h • R$ {area.hourlyRate.toFixed(2)}/hora
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <CalendarDays className="h-4 w-4 mr-2" />
              Confirmar Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CommonAreasPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([
    {
      id: 1,
      name: "Salão de Festas Principal",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      type: "Festa",
      capacity: 80,
      hourlyRate: 150.00,
      minimumHours: 4,
      maxAdvanceBooking: 60, // dias
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
      hourlyRate: 0, // Gratuito
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
    },
    {
      id: 6,
      name: "Espaço Gourmet",
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      type: "Gourmet",
      capacity: 40,
      hourlyRate: 200.00,
      minimumHours: 4,
      maxAdvanceBooking: 90,
      status: "Disponível",
      amenities: ["Churrasqueira gourmet", "Forno de pizza", "Bancada completa", "Geladeira duplex"],
      rules: [
        "Máximo 40 pessoas",
        "Limpeza completa obrigatória",
        "Caução de R$ 800,00",
        "Reserva mínima 4 horas"
      ],
      availability: "Todos os dias, 8h às 23h",
      lastMaintenance: "2024-10-30",
      nextMaintenance: "2024-12-30",
      description: "Espaço gourmet completo para eventos especiais",
      icon: Coffee
    },
    {
      id: 7,
      name: "Jardim Zen",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      type: "Relaxamento",
      capacity: 20,
      hourlyRate: 0,
      minimumHours: 1,
      maxAdvanceBooking: 7,
      status: "Disponível",
      amenities: ["Bancos", "Fonte d'água", "Plantas ornamentais", "Iluminação suave"],
      rules: [
        "Silêncio obrigatório",
        "Não permitido música",
        "Máximo 20 pessoas",
        "Respeitar plantas e mobiliário"
      ],
      availability: "Todos os dias, 6h às 20h",
      lastMaintenance: "2024-11-05",
      nextMaintenance: "2024-01-05",
      description: "Espaço tranquilo para meditação e relaxamento",
      icon: TreePine
    },
    {
      id: 8,
      name: "Garagem de Visitantes",
      condominium: "Condomínio Barra Garden",
      condominiumId: 2,
      type: "Estacionamento",
      capacity: 20,
      hourlyRate: 15.00,
      minimumHours: 1,
      maxAdvanceBooking: 2,
      status: "Disponível",
      amenities: ["20 vagas cobertas", "Segurança 24h", "Portão automático", "Iluminação"],
      rules: [
        "Máximo 8h consecutivas",
        "Não permitido pernoitar",
        "Responsabilidade por danos",
        "Documento do veículo obrigatório"
      ],
      availability: "Todos os dias, 24h",
      lastMaintenance: "2024-10-01",
      nextMaintenance: "2025-01-01",
      description: "Estacionamento coberto para visitantes",
      icon: Car
    }
  ]);

  // Funções para gerenciar os modais
  const handleEditArea = (area: CommonArea) => {
    setSelectedArea(area);
    setIsEditModalOpen(true);
  };

  const handleReserveArea = (area: CommonArea) => {
    setSelectedArea(area);
    setIsReserveModalOpen(true);
  };

  const handleSaveArea = (updatedArea: CommonArea) => {
    setCommonAreas(areas => 
      areas.map(area => area.id === updatedArea.id ? updatedArea : area)
    );
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsReserveModalOpen(false);
    setSelectedArea(null);
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
  const totalAreas = commonAreas.length;
  const availableAreas = commonAreas.filter(area => area.status === "Disponível").length;
  const maintenanceAreas = commonAreas.filter(area => area.status === "Em Manutenção").length;
  const paidAreas = commonAreas.filter(area => area.hourlyRate > 0).length;
  const freeAreas = commonAreas.filter(area => area.hourlyRate === 0).length;

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
                Distribuídas em 6 condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableAreas}</div>
              <p className="text-xs text-green-600">
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
                {freeAreas} gratuitas
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
                {commonAreas.reduce((sum, area) => sum + area.capacity, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas simultâneas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar áreas comuns..."
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Área
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Lista de Áreas Comuns */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Áreas Comuns</CardTitle>
            <CardDescription>
              Todas as áreas comuns disponíveis nos condomínios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonAreas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <div
                    key={area.id}
                    className="flex flex-col lg:flex-row lg:items-start justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors dark:border-border"
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

                      {/* Regras */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Principais Regras</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {area.rules.slice(0, 4).map((rule, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => handleReserveArea(area)}
                        disabled={area.status !== "Disponível"}
                      >
                        <Calendar className="h-4 w-4" />
                        Reservar
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => handleEditArea(area)}
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Modals */}
      <EditAreaModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        area={selectedArea}
        onSave={handleSaveArea}
      />
      <ReserveAreaModal 
        isOpen={isReserveModalOpen}
        onClose={handleCloseModals}
        area={selectedArea}
      />
    </ContentLayout>
  );
}
