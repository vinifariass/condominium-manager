"use client";

import { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Home,
  DollarSign,
  Download,
  Grid3X3,
  List,
  Phone,
  Mail,
  AlertTriangle,
  XCircle,
  FileText
} from "lucide-react";

export default function ApartmentsPage() {
  // Dados simples dos apartamentos
  const apartments = [
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
      residents: 3,
      owner: "Ana Carolina Mendes",
      ownerPhone: "(21) 99887-6543",
      ownerEmail: "ana.mendes@email.com",
      monthlyFee: 1200.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento de alto padrão"
    },
    {
      id: 4,
      number: "102",
      block: "A",
      floor: 1,
      condominium: "Condomínio Santos Dumont",
      condominiumAddress: "Estrada dos Três Rios, nº 1306 - Freguesia - Jacarepaguá",
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 85.5,
      status: "Manutenção",
      type: "Padrão",
      residents: 0,
      owner: "Carlos Roberto Silva",
      ownerPhone: "(21) 98888-7777",
      ownerEmail: "carlos.silva@email.com",
      monthlyFee: 850.00,
      balanceDue: 850.00,
      lastPayment: "2024-10-15",
      observations: "Em reforma"
    },
    {
      id: 5,
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

  // 🎯 ESTADOS REATIVOS PARA FILTROS E BUSCA
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // 🔍 FILTROS BÁSICOS
  const filteredApartments = useMemo(() => {
    return apartments.filter(apartment => {
      // Busca simples em campos básicos
      const searchMatch = searchTerm === "" || 
        apartment.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.condominium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apartment.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtros por categoria
      const statusMatch = statusFilter === "all" || apartment.status === statusFilter;
      const typeMatch = typeFilter === "all" || apartment.type === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [apartments, searchTerm, statusFilter, typeFilter]);

  // 📊 ESTATÍSTICAS BÁSICAS DOS FILTROS
  const filterStats = useMemo(() => {
    return {
      total: filteredApartments.length,
      occupied: filteredApartments.filter(apt => apt.status === "Ocupado").length,
      vacant: filteredApartments.filter(apt => apt.status === "Vago").length,
      maintenance: filteredApartments.filter(apt => apt.status === "Manutenção").length,
      revenue: filteredApartments.reduce((sum, apt) => sum + apt.monthlyFee, 0),
      balanceDue: filteredApartments.reduce((sum, apt) => sum + apt.balanceDue, 0)
    };
  }, [filteredApartments]);

  // 📈 EXPORTAÇÃO DE DADOS (CSV)
  const exportToCSV = () => {
    const csvData = filteredApartments.map(apt => ({
      "Apartamento": apt.number,
      "Bloco": apt.block,
      "Status": apt.status,
      "Tipo": apt.type,
      "Proprietário": apt.owner,
      "Telefone": apt.ownerPhone,
      "Email": apt.ownerEmail,
      "Taxa Mensal": apt.monthlyFee,
      "Saldo Devedor": apt.balanceDue,
      "Quartos": apt.bedrooms,
      "Banheiros": apt.bathrooms,
      "Vagas": apt.parkingSpaces,
      "Área": apt.area,
      "Último Pagamento": apt.lastPayment
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apartamentos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  // Função para obter cor do status com melhor contraste dark mode
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
  const occupiedApartments = apartments.filter(apt => apt.status === "Ocupado").length;
  const vacantApartments = apartments.filter(apt => apt.status === "Vago").length;
  const occupancyRate = ((occupiedApartments / totalApartments) * 100).toFixed(1);
  const totalMonthlyFees = apartments.reduce((sum, apt) => sum + apt.monthlyFee, 0);
  const totalBalanceDue = apartments.reduce((sum, apt) => sum + apt.balanceDue, 0);

  return (
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        {/* 📊 ESTATÍSTICAS BÁSICAS */}
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
                Saldo devedor total
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
                    placeholder="Buscar por número, proprietário, condomínio..."
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Apartamentos
            </CardTitle>
            <CardDescription>
              Gestão completa dos apartamentos do condomínio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApartments.map((apartment) => (
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
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                    <Button size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contatar
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Agendar Visita
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Relatórios
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
