"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/components/permission-guard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bed,
  Bath,
  Car,
  Users,
  Eye,
  Edit,
  MapPin,
  Calendar,
  TrendingUp,
  Home,
  ChevronDown,
  X,
  CheckCircle,
  XCircle,
  Trash2,
  Copy,
  DollarSign,
  AlertTriangle,
  Grid3X3,
  List,
  Download,
  Phone,
  Mail
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Interface para apartamentos
interface ApartmentData {
  id: number;
  number: string;
  block: string;
  floor: number;
  condominium: string;
  condominiumId: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  status: string;
  type: string;
  residents: number;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  monthlyFee: number;
  balanceDue: number;
  lastPayment: string;
  observations: string;
}

// Interface para filtros
interface ApartmentFilters {
  search: string;
  status: string[];
  type: string[];
  condominium: string[];
  bedrooms: string[];
}

// Constantes para filtros
const FILTER_OPTIONS = {
  status: ["Ocupado", "Vago", "Manutenção"],
  type: ["Luxo", "Premium", "Padrão", "Compacto"],
  condominium: [
    "Condomínio Santos Dumont",
    "Condomínio Barra Garden", 
    "Condomínio Praia Azul",
    "Condomínio Cachoeira Dourada",
    "Condomínio Recanto",
    "Condomínio Vivenda"
  ],
  bedrooms: ["1", "2", "3", "4", "5+"]
};

export default function ApartmentsPage() {
  return (
    <PermissionGuard 
      permissions={["canManageApartments"]}
      fallback={
        <ContentLayout title="Acesso Negado">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para gerenciar apartamentos.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta área é restrita para administradores e síndicos.
            </p>
          </div>
        </ContentLayout>
      }
    >
      <ApartmentsPageContent />
    </PermissionGuard>
  );
}

function ApartmentsPageContent() {
  // Estados para filtros
  const [filters, setFilters] = useState<ApartmentFilters>({
    search: "",
    status: [],
    type: [],
    condominium: [],
    bedrooms: []
  });

  // Estados para modais
  const [selectedApartment, setSelectedApartment] = useState<ApartmentData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Estado para apartamentos (agora controlado via estado local)
  const [apartments, setApartments] = useState<ApartmentData[]>([]);

  // Dados simulados de apartamentos baseados nos condomínios reais
  const initialApartments: ApartmentData[] = [
    {
      id: 1,
      number: "101",
      block: "A",
      floor: 1,
      condominium: "Condomínio Santos Dumont",
      condominiumAddress: "Estrada dos Três Rios, nº 1306 - Freguesia - Jacarepaguá",
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 85.5,
      status: "Ocupado",
      type: "Padrão",
      residents: 4,
      owner: "Maria Silva Santos",
      ownerPhone: "(21) 98765-4321",
      ownerEmail: "maria.silva@email.com",
      monthlyFee: 850.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento bem conservado"
    },
    {
      id: 2,
      number: "202",
      block: "A",
      floor: 2,
      condominium: "Condomínio Santos Dumont",
      condominiumAddress: "Estrada dos Três Rios, nº 1306 - Freguesia - Jacarepaguá",
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 65.0,
      status: "Vago",
      type: "Compacto",
      residents: 0,
      owner: "João Pereira Costa",
      ownerPhone: "(21) 97654-3210",
      ownerEmail: "joao.costa@email.com",
      monthlyFee: 650.00,
      balanceDue: 1300.00,
      lastPayment: "2024-09-15",
      observations: "Disponível para locação"
    },
    {
      id: 3,
      number: "301",
      block: "B",
      floor: 3,
      condominium: "Condomínio Griffe",
      condominiumAddress: "Rua da Passagem, nº 160 - Botafogo – Rio de Janeiro - RJ",
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 120.0,
      status: "Ocupado",
      type: "Premium",
      residents: 5,
      owner: "Ana Paula Oliveira",
      ownerPhone: "(21) 99876-5432",
      ownerEmail: "ana.oliveira@email.com",
      monthlyFee: 1200.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento com vista para o mar"
    },
    {
      id: 4,
      number: "403",
      block: "A",
      floor: 4,
      condominium: "Condomínio Praia Azul",
      condominiumId: 3,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 75.0,
      status: "Manutenção",
      type: "Padrão",
      residents: 0,
      owner: "Carlos Eduardo Santos",
      ownerPhone: "(21) 98321-4567",
      ownerEmail: "carlos.santos@email.com",
      monthlyFee: 720.00,
      balanceDue: 720.00,
      lastPayment: "2024-10-15",
      observations: "Em reforma da cozinha"
    },
    {
      id: 5,
      number: "1001",
      block: "A",
      floor: 10,
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 110.0,
      status: "Ocupado",
      type: "Premium",
      residents: 3,
      owner: "Fernanda Costa Lima",
      ownerPhone: "(21) 99654-7890",
      ownerEmail: "fernanda.lima@email.com",
      monthlyFee: 980.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento com sacada gourmet"
    },
    {
      id: 6,
      number: "205",
      block: "B",
      floor: 2,
      condominium: "Condomínio Recanto",
      condominiumId: 5,
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 45.0,
      status: "Vago",
      type: "Compacto",
      residents: 0,
      owner: "Roberto Silva Nunes",
      ownerPhone: "(21) 98147-2583",
      ownerEmail: "roberto.nunes@email.com",
      monthlyFee: 450.00,
      balanceDue: 900.00,
      lastPayment: "2024-09-15",
      observations: "Ideal para solteiros"
    },
    {
      id: 7,
      number: "401",
      block: "B",
      floor: 4,
      condominium: "Condomínio Griffe",
      condominiumAddress: "Rua da Passagem, nº 160 - Botafogo – Rio de Janeiro - RJ",
      bedrooms: 5,
      bathrooms: 4,
      parkingSpaces: 3,
      area: 180.0,
      status: "Ocupado",
      type: "Luxo",
      residents: 5,
      owner: "Patricia Almeida",
      ownerPhone: "(21) 99999-1234",
      ownerEmail: "patricia.almeida@email.com",
      monthlyFee: 2500.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Cobertura duplex"
    }
  ];

  // useEffect para inicializar os dados
  useEffect(() => {
    setApartments(initialApartments);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Funções para modais
  const openViewModal = (apartment: ApartmentData) => {
    setSelectedApartment(apartment);
    setIsViewModalOpen(true);
  };

  const openEditModal = (apartment: ApartmentData) => {
    setSelectedApartment(apartment);
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedApartment(null);
    setIsCreateModalOpen(true);
  };

  const closeModals = () => {
    setSelectedApartment(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
  };

  // Funções CRUD
  const handleCreateApartment = (apartmentData: Omit<ApartmentData, 'id'>) => {
    const newId = Math.max(...apartments.map(apt => apt.id)) + 1;
    const newApartment: ApartmentData = {
      ...apartmentData,
      id: newId
    };
    setApartments(prev => [...prev, newApartment]);
    closeModals();
  };

  const handleUpdateApartment = (apartmentData: ApartmentData) => {
    setApartments(prev => prev.map(apt => 
      apt.id === apartmentData.id ? apartmentData : apt
    ));
    closeModals();
  };

  const handleDeleteApartment = (apartment: ApartmentData) => {
    if (confirm(`Tem certeza que deseja excluir o apartamento ${apartment.number}?`)) {
      setApartments(prev => prev.filter(apt => apt.id !== apartment.id));
    }
  };

  const handleDuplicateApartment = (apartment: ApartmentData) => {
    const newId = Math.max(...apartments.map(apt => apt.id)) + 1;
    const duplicatedApartment: ApartmentData = {
      ...apartment,
      id: newId,
      number: `${apartment.number}_COPIA`,
      status: "Vago",
      residents: 0,
      balanceDue: 0,
      observations: `${apartment.observations} (Cópia)`
    };
    setApartments(prev => [...prev, duplicatedApartment]);
  };

  // Lógica de filtragem
  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment: ApartmentData) => {
      // Filtro de pesquisa por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          apartment.number.toLowerCase().includes(searchLower) ||
          apartment.owner.toLowerCase().includes(searchLower) ||
          apartment.condominium.toLowerCase().includes(searchLower) ||
          apartment.block.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por status
      if (filters.status.length > 0 && !filters.status.includes(apartment.status)) {
        return false;
      }

      // Filtro por tipo
      if (filters.type.length > 0 && !filters.type.includes(apartment.type)) {
        return false;
      }

      // Filtro por condomínio
      if (filters.condominium.length > 0 && !filters.condominium.includes(apartment.condominium)) {
        return false;
      }

      // Filtro por quartos
      if (filters.bedrooms.length > 0) {
        const bedroomStr = apartment.bedrooms >= 5 ? "5+" : apartment.bedrooms.toString();
        if (!filters.bedrooms.includes(bedroomStr)) {
          return false;
        }
      }

      return true;
    });
  }, [apartments, filters]);

  // Funções para manipular filtros
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const toggleFilterOption = (filterType: keyof typeof FILTER_OPTIONS, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilter = (filterType: keyof typeof FILTER_OPTIONS) => {
    setFilters(prev => ({ ...prev, [filterType]: [] }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: [],
      type: [],
      condominium: [],
      bedrooms: []
    });
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ocupado":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700";
      case "Vago":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700";
      case "Manutenção":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
    }
  };

  // Função para obter cor do tipo com melhor contraste dark mode
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Luxo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700";
      case "Premium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700";
      case "Padrão":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
      case "Compacto":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-700";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border border-gray-200 dark:border-gray-600";
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estatísticas
  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter((apt: ApartmentData) => apt.status === "Ocupado").length;
  const vacantApartments = apartments.filter((apt: ApartmentData) => apt.status === "Vago").length;
  const occupancyRate = totalApartments > 0 ? ((occupiedApartments / totalApartments) * 100).toFixed(1) : '0';
  const totalMonthlyFees = apartments.reduce((sum: number, apt: ApartmentData) => sum + apt.monthlyFee, 0);
  const totalBalanceDue = apartments.reduce((sum: number, apt: ApartmentData) => sum + apt.balanceDue, 0);

  return (
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Apartamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os apartamentos dos condomínios
            </p>
          </div>
          <Button className="flex items-center gap-2" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Apartamento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApartments}</div>
              <p className="text-xs text-muted-foreground">
                Distribuídos em 2 condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {occupiedApartments} de {totalApartments} ocupados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyFees)}</div>
              <p className="text-xs text-muted-foreground">
                Total das taxas condominiais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Débito</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalanceDue)}</div>
              <p className="text-xs text-muted-foreground">
                {apartments.filter((apt: ApartmentData) => apt.balanceDue > 0).length} inadimplentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🔍 FILTROS E BUSCA */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar apartamentos..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={() => setSearchTerm("débito")}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Com débito
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                    onClick={() => setStatusFilter("Vago")}
                  >
                    <Home className="h-3 w-3 mr-1" />
                    Vagos
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Limpar filtros
                  </Badge>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Ocupado">Ocupado</SelectItem>
                    <SelectItem value="Vago">Vago</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Padrão">Padrão</SelectItem>
                    <SelectItem value="Compacto">Compacto</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Luxo">Luxo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={exportToCSV}
                >
                  <Download className="h-4 w-4" />
                  Exportar ({filterStats.total})
                </Button>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Apartamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Apartamento</DialogTitle>
                      <DialogDescription>
                        Adicione um novo apartamento ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" placeholder="Ex: 101" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="block">Bloco</Label>
                        <Input id="block" placeholder="Ex: A" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floor">Andar</Label>
                        <Input id="floor" type="number" placeholder="Ex: 1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Área (m²)</Label>
                        <Input id="area" type="number" placeholder="Ex: 85.5" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setShowAddDialog(false)}>
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status {filters.status.length > 0 && `(${filters.status.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.status.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('status', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.status.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.status.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('status')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Tipo {filters.type.length > 0 && `(${filters.type.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.type.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('type', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.type.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.type.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('type')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Condomínio {filters.condominium.length > 0 && `(${filters.condominium.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.condominium.map((option: string) => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('condominium', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.condominium.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.condominium.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('condominium')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      Quartos {filters.bedrooms.length > 0 && `(${filters.bedrooms.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.bedrooms.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('bedrooms', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option} {option === "5+" ? "ou mais" : option === "1" ? "quarto" : "quartos"}</span>
                        {filters.bedrooms.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.bedrooms.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('bedrooms')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 📊 ESTATÍSTICAS DOS FILTROS */}
            {(searchTerm !== "" || statusFilter !== "all" || typeFilter !== "all") && (
              <div className="bg-muted/30 p-4 rounded-lg border dark:bg-gray-800/50 dark:border-gray-700 mt-4">
                <h4 className="font-semibold text-sm mb-3">
                  Resultados da Busca/Filtro
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {filterStats.total}
                    </div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {filterStats.occupied}
                    </div>
                    <div className="text-muted-foreground">Ocupados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {filterStats.vacant}
                    </div>
                    <div className="text-muted-foreground">Vagos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(filterStats.revenue)}
                    </div>
                    <div className="text-muted-foreground">Receita</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(filterStats.balanceDue)}
                    </div>
                    <div className="text-muted-foreground">Em Débito</div>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* 🏢 LISTA DE APARTAMENTOS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Apartamentos</CardTitle>
                <CardDescription>
                  {filteredApartments.length === apartments.length 
                    ? `${apartments.length} apartamentos cadastrados no sistema`
                    : `${filteredApartments.length} de ${apartments.length} apartamentos`
                  }
                </CardDescription>
              </div>
              {(filters.search || filters.status.length > 0 || filters.type.length > 0 || 
                filters.condominium.length > 0 || filters.bedrooms.length > 0) && (
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApartments.map((apartment: ApartmentData) => (
                <div
                  key={apartment.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-muted/20 dark:border-gray-700 dark:from-gray-900/50 dark:to-gray-800/30"
                >
                  {/* Header do Apartamento */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          Apartamento {apartment.number} - Bloco {apartment.block}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(apartment.status)}>
                            {apartment.status}
                          </Badge>
                          <Badge className={getTypeColor(apartment.type)}>
                            {apartment.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                          {apartment.condominium}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {apartment.condominiumAddress}
                        </p>
                      </div>
                    </div>

                    {/* Valor da Taxa */}
                    <div className="text-right mt-4 lg:mt-0">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(apartment.monthlyFee)}
                      </div>
                      <p className="text-xs text-muted-foreground">Taxa mensal</p>
                    </div>
                  </div>

                  {/* Grid de Informações */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Características */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground dark:text-gray-300 uppercase tracking-wide">
                        Características
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.bedrooms} quartos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.bathrooms} banheiros</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.parkingSpaces} vagas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.area}m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Informações do Proprietário */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground dark:text-gray-300 uppercase tracking-wide">
                        Proprietário
                      </h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">{apartment.owner}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.ownerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.ownerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{apartment.residents} moradores</span>
                        </div>
                      </div>
                    </div>

                    {/* Informações Financeiras */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground dark:text-gray-300 uppercase tracking-wide">
                        Financeiro
                      </h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Taxa Mensal:</span>
                          <p className="font-medium">{formatCurrency(apartment.monthlyFee)}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Saldo Devedor:</span>
                          <p className={apartment.balanceDue > 0 ? "text-red-600 dark:text-red-400 font-medium" : "text-green-600 dark:text-green-400 font-medium"}>
                            {formatCurrency(apartment.balanceDue)}
                          </p>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Último Pagamento:</span>
                          <p className="font-medium">
                            {new Date(apartment.lastPayment).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground dark:text-gray-300 uppercase tracking-wide">
                        Observações
                      </h4>
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          {apartment.observations}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => openViewModal(apartment)}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openEditModal(apartment)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateApartment(apartment)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteApartment(apartment)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Visualização */}
      {isViewModalOpen && selectedApartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Apartamento {selectedApartment.number} - Bloco {selectedApartment.block}</h2>
                <p className="text-muted-foreground">{selectedApartment.condominium}</p>
              </div>
              <Button variant="ghost" onClick={closeModals}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(selectedApartment.status)}>
                      {selectedApartment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tipo:</span>
                    <Badge className={getTypeColor(selectedApartment.type)}>
                      {selectedApartment.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Andar:</span>
                    <span className="text-sm">{selectedApartment.floor}º andar</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Área:</span>
                    <span className="text-sm">{selectedApartment.area}m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quartos:</span>
                    <span className="text-sm">{selectedApartment.bedrooms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Banheiros:</span>
                    <span className="text-sm">{selectedApartment.bathrooms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vagas:</span>
                    <span className="text-sm">{selectedApartment.parkingSpaces}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Moradores:</span>
                    <span className="text-sm">{selectedApartment.residents}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Proprietário */}
              <Card>
                <CardHeader>
                  <CardTitle>Proprietário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Nome:</span>
                    <p className="text-sm text-muted-foreground">{selectedApartment.owner}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Telefone:</span>
                    <p className="text-sm text-muted-foreground">{selectedApartment.ownerPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-muted-foreground">{selectedApartment.ownerEmail}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Financeiras */}
              <Card>
                <CardHeader>
                  <CardTitle>Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Taxa Mensal:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(selectedApartment.monthlyFee)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Saldo Devedor:</span>
                    <span className={`text-sm font-bold ${selectedApartment.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(selectedApartment.balanceDue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Último Pagamento:</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedApartment.lastPayment).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedApartment.observations}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={closeModals}>
                Fechar
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && selectedApartment && (
        <ApartmentEditModal
          apartment={selectedApartment}
          onSave={handleUpdateApartment}
          onClose={closeModals}
        />
      )}

      {/* Modal de Criação */}
      {isCreateModalOpen && (
        <ApartmentCreateModal
          onSave={handleCreateApartment}
          onClose={closeModals}
        />
      )}
    </ContentLayout>
  );
}

// Componente Modal de Criação
interface ApartmentCreateModalProps {
  onSave: (apartment: Omit<ApartmentData, 'id'>) => void;
  onClose: () => void;
}

function ApartmentCreateModal({ onSave, onClose }: ApartmentCreateModalProps) {
  const [formData, setFormData] = useState({
    number: "",
    block: "",
    floor: 1,
    condominium: "",
    condominiumId: 1,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    area: 0,
    status: "Vago" as const,
    type: "Padrão" as const,
    residents: 0,
    owner: "",
    ownerPhone: "",
    ownerEmail: "",
    monthlyFee: 0,
    balanceDue: 0,
    lastPayment: new Date().toISOString().split('T')[0],
    observations: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Novo Apartamento</h2>
          <Button variant="ghost" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Número *</label>
              <input 
                type="text"
                required
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: 101"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Bloco *</label>
              <input 
                type="text"
                required
                value={formData.block}
                onChange={(e) => handleChange('block', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Condomínio *</label>
              <select 
                required
                value={formData.condominium}
                onChange={(e) => {
                  const selectedIndex = FILTER_OPTIONS.condominium.indexOf(e.target.value);
                  handleChange('condominium', e.target.value);
                  handleChange('condominiumId', selectedIndex + 1);
                }}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um condomínio</option>
                {FILTER_OPTIONS.condominium.map((cond, index) => (
                  <option key={index} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Ocupado">Ocupado</option>
                <option value="Vago">Vago</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Luxo">Luxo</option>
                <option value="Premium">Premium</option>
                <option value="Padrão">Padrão</option>
                <option value="Compacto">Compacto</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Andar *</label>
              <input 
                type="number"
                required
                min="1"
                value={formData.floor}
                onChange={(e) => handleChange('floor', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quartos</label>
              <input 
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Banheiros</label>
              <input 
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Vagas</label>
              <input 
                type="number"
                min="0"
                value={formData.parkingSpaces}
                onChange={(e) => handleChange('parkingSpaces', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Área (m²) *</label>
              <input 
                type="number"
                step="0.1"
                min="1"
                required
                value={formData.area}
                onChange={(e) => handleChange('area', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Proprietário *</label>
            <input 
              type="text"
              required
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nome completo do proprietário"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Telefone</label>
              <input 
                type="text"
                value={formData.ownerPhone}
                onChange={(e) => handleChange('ownerPhone', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="(21) 99999-9999"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input 
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleChange('ownerEmail', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Taxa Mensal (R$) *</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.monthlyFee}
                onChange={(e) => handleChange('monthlyFee', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Saldo Devedor (R$)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={formData.balanceDue}
                onChange={(e) => handleChange('balanceDue', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Moradores</label>
              <input 
                type="number"
                min="0"
                value={formData.residents}
                onChange={(e) => handleChange('residents', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Observações</label>
            <textarea 
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Observações sobre o apartamento..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Apartamento
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Modal de Edição
interface ApartmentEditModalProps {
  apartment: ApartmentData;
  onSave: (apartment: ApartmentData) => void;
  onClose: () => void;
}

function ApartmentEditModal({ apartment, onSave, onClose }: ApartmentEditModalProps) {
  const [formData, setFormData] = useState<ApartmentData>(apartment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Editar Apartamento</h2>
          <Button variant="ghost" onClick={onClose}>
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Número</label>
              <input 
                type="text"
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Bloco</label>
              <input 
                type="text"
                value={formData.block}
                onChange={(e) => handleChange('block', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Ocupado">Ocupado</option>
                <option value="Vago">Vago</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Luxo">Luxo</option>
                <option value="Premium">Premium</option>
                <option value="Padrão">Padrão</option>
                <option value="Compacto">Compacto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quartos</label>
              <input 
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Banheiros</label>
              <input 
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Vagas</label>
              <input 
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => handleChange('parkingSpaces', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Área (m²)</label>
              <input 
                type="number"
                step="0.1"
                value={formData.area}
                onChange={(e) => handleChange('area', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Andar</label>
              <input 
                type="number"
                value={formData.floor}
                onChange={(e) => handleChange('floor', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Número de Moradores</label>
              <input 
                type="number"
                value={formData.residents}
                onChange={(e) => handleChange('residents', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Proprietário</label>
            <input 
              type="text"
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Telefone</label>
              <input 
                type="text"
                value={formData.ownerPhone}
                onChange={(e) => handleChange('ownerPhone', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input 
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => handleChange('ownerEmail', e.target.value)}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Taxa Mensal</label>
              <input 
                type="number"
                step="0.01"
                value={formData.monthlyFee}
                onChange={(e) => handleChange('monthlyFee', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Saldo Devedor</label>
              <input 
                type="number"
                step="0.01"
                value={formData.balanceDue}
                onChange={(e) => handleChange('balanceDue', parseFloat(e.target.value))}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Observações</label>
            <textarea 
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              rows={3}
              className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
