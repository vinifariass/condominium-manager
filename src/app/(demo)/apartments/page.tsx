"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Copy
} from "lucide-react";

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
      condominiumId: 1,
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
      observations: "Apartamento recém reformado"
    },
    {
      id: 2,
      number: "202",
      block: "A",
      floor: 2,
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
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
      condominium: "Condomínio Barra Garden",
      condominiumId: 2,
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
      block: "A",
      floor: 4,
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 140.0,
      status: "Ocupado",
      type: "Luxo",
      residents: 4,
      owner: "Patricia Rodrigues Lima",
      ownerPhone: "(21) 99543-2109",
      ownerEmail: "patricia.lima@email.com",
      monthlyFee: 1500.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento duplex com terraço"
    },
    {
      id: 8,
      number: "304",
      block: "C",
      floor: 3,
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 88.0,
      status: "Ocupado",
      type: "Padrão",
      residents: 3,
      owner: "Marcos Antonio Silva",
      ownerPhone: "(21) 98432-1098",
      ownerEmail: "marcos.silva@email.com",
      monthlyFee: 870.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento bem conservado"
    }
  ];

  // useEffect para inicializar os dados
  useEffect(() => {
    setApartments(initialApartments);
  }, []);

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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Vago":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Manutenção":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Função para obter cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Luxo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Premium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Padrão":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Compacto":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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
                Distribuídos em 6 condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {occupiedApartments} ocupados de {totalApartments}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyFees)}</div>
              <p className="text-xs text-muted-foreground">
                Taxa condominial total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Devedor</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalanceDue)}</div>
              <p className="text-xs text-muted-foreground">
                {apartments.filter((apt: ApartmentData) => apt.balanceDue > 0).length} inadimplentes
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
                    placeholder="Buscar apartamentos..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                  />
                </div>
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
          </CardHeader>
        </Card>

        {/* Lista de Apartamentos */}
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
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors dark:border-border"
                >
                  <div className="flex-1 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-6 lg:gap-4">
                    {/* Informações Básicas */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Apto {apartment.number} - Bloco {apartment.block}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(apartment.status)}>
                              {apartment.status}
                            </Badge>
                            <Badge className={getTypeColor(apartment.type)}>
                              {apartment.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {apartment.condominium}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Características */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{apartment.bedrooms} quartos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{apartment.bathrooms}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{apartment.parkingSpaces} vaga(s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{apartment.area}m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Proprietário */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Proprietário:</span>
                        <p className="text-muted-foreground truncate">{apartment.owner}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Moradores:</span> {apartment.residents}
                      </div>
                    </div>

                    {/* Financeiro */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Taxa:</span>
                        <p className="text-muted-foreground">{formatCurrency(apartment.monthlyFee)}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Saldo devedor:</span>
                        <p className={apartment.balanceDue > 0 ? "text-red-600" : "text-green-600"}>
                          {formatCurrency(apartment.balanceDue)}
                        </p>
                      </div>
                    </div>

                    {/* Último Pagamento */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Último pagamento:</span>
                        <p className="text-muted-foreground">
                          {new Date(apartment.lastPayment).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Andar:</span>
                        <p className="text-muted-foreground">{apartment.floor}º andar</p>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="lg:col-span-6 pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Observações:</span>
                        <p className="text-muted-foreground mt-1">{apartment.observations}</p>
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
                      Ver
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
