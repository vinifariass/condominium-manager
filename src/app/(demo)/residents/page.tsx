"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionGuard } from "@/components/permission-guard";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  Edit,
  Shield,
  User,
  X,
  Save,
  Trash2
} from "lucide-react";

export default function ResidentsPage() {
  return (
    <PermissionGuard 
      permissions={["canManageResidents"]}
      fallback={
        <ContentLayout title="Acesso Negado">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para gerenciar moradores.
            </p>
            <p className="text-sm text-muted-foreground">
              Esta área é restrita para administradores e síndicos.
            </p>
          </div>
        </ContentLayout>
      }
    >
      <ResidentsPageContent />
    </PermissionGuard>
  );
}

function ResidentsPageContent() {
  // Estados para controle do formulário e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [apartmentFilter, setApartmentFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para o formulário de cadastro
  const [newResident, setNewResident] = useState({
    name: "",
    email: "",
    phone: "",
    apartment: "",
    block: "",
    role: "",
    status: "Ativo",
    cpf: "",
    birthDate: ""
  });

  // Dados simulados - substituir por dados reais da API
  const [residents, setResidents] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      apartment: "101",
      block: "A",
      role: "Proprietário",
      status: "Ativo",
      avatar: null,
      cpf: "123.456.789-00",
      birthDate: "1985-03-15",
      createdAt: "2023-01-15"
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao@email.com", 
      phone: "(11) 88888-8888",
      apartment: "101",
      block: "A",
      role: "Dependente",
      status: "Ativo",
      avatar: null,
      cpf: "987.654.321-00",
      birthDate: "2010-08-22",
      createdAt: "2023-01-15"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "(11) 77777-7777",
      apartment: "201",
      block: "A", 
      role: "Proprietário",
      status: "Ativo",
      avatar: null,
      cpf: "456.789.123-00",
      birthDate: "1990-12-05",
      createdAt: "2023-02-20"
    },
    {
      id: 4,
      name: "Carlos Santos",
      email: "carlos@email.com",
      phone: "(11) 66666-6666",
      apartment: "302",
      block: "B",
      role: "Inquilino",
      status: "Ativo",
      avatar: null,
      cpf: "789.123.456-00",
      birthDate: "1982-07-10",
      createdAt: "2023-03-10"
    },
    {
      id: 5,
      name: "Julia Oliveira",
      email: "julia@email.com",
      phone: "(11) 55555-5555",
      apartment: "105",
      block: "A",
      role: "Proprietário",
      status: "Inativo",
      avatar: null,
      cpf: "321.654.987-00",
      birthDate: "1995-11-30",
      createdAt: "2023-01-05"
    }
  ]);

  // Função para adicionar novo morador
  const handleAddResident = () => {
    if (!newResident.name || !newResident.apartment || !newResident.role) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const resident = {
      id: residents.length + 1,
      ...newResident,
      avatar: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setResidents([...residents, resident]);
    setNewResident({
      name: "",
      email: "",
      phone: "",
      apartment: "",
      block: "",
      role: "",
      status: "Ativo",
      cpf: "",
      birthDate: ""
    });
    setShowAddModal(false);
  };

  // Função para filtrar moradores
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.cpf.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || resident.status === statusFilter;
    const matchesRole = roleFilter === "all" || resident.role === roleFilter;
    const matchesApartment = !apartmentFilter || resident.apartment.includes(apartmentFilter);
    
    return matchesSearch && matchesStatus && matchesRole && matchesApartment;
  });

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setApartmentFilter("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "text-green-600 bg-green-100";
      case "Inativo":
        return "text-red-600 bg-red-100";
      case "Pendente":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Proprietário":
        return "text-blue-600 bg-blue-100";
      case "Inquilino":
        return "text-purple-600 bg-purple-100";
      case "Dependente":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Proprietário":
        return <Shield className="h-3 w-3" />;
      case "Inquilino":
        return <User className="h-3 w-3" />;
      case "Dependente":
        return <UserPlus className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const activeResidents = filteredResidents.filter(r => r.status === "Ativo");
  const totalResidents = filteredResidents.length;
  const proprietarios = filteredResidents.filter(r => r.role === "Proprietário").length;
  const inquilinos = filteredResidents.filter(r => r.role === "Inquilino").length;

  return (
    <ContentLayout title="Moradores">
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                {activeResidents.length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proprietários</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{proprietarios}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((proprietarios / totalResidents) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{inquilinos}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inquilinos / totalResidents) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dependentes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {filteredResidents.filter(r => r.role === "Dependente").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Menores e familiares
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciamento de Moradores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Moradores</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os moradores do condomínio
                </CardDescription>
              </div>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Morador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Morador</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do novo morador do condomínio.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={newResident.name}
                          onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={newResident.cpf}
                          onChange={(e) => setNewResident({...newResident, cpf: e.target.value})}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newResident.email}
                          onChange={(e) => setNewResident({...newResident, email: e.target.value})}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={newResident.phone}
                          onChange={(e) => setNewResident({...newResident, phone: e.target.value})}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartamento *</Label>
                        <Input
                          id="apartment"
                          value={newResident.apartment}
                          onChange={(e) => setNewResident({...newResident, apartment: e.target.value})}
                          placeholder="101"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="block">Bloco</Label>
                        <Input
                          id="block"
                          value={newResident.block}
                          onChange={(e) => setNewResident({...newResident, block: e.target.value})}
                          placeholder="A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Tipo *</Label>
                        <Select value={newResident.role} onValueChange={(value) => setNewResident({...newResident, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Proprietário">Proprietário</SelectItem>
                            <SelectItem value="Inquilino">Inquilino</SelectItem>
                            <SelectItem value="Dependente">Dependente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={newResident.birthDate}
                          onChange={(e) => setNewResident({...newResident, birthDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={newResident.status} onValueChange={(value) => setNewResident({...newResident, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddResident}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Morador
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, email, apartamento, CPF..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {(statusFilter !== "all" || roleFilter !== "all" || apartmentFilter) && (
                  <Badge variant="secondary" className="ml-2">
                    {[statusFilter !== "all" ? 1 : 0, roleFilter !== "all" ? 1 : 0, apartmentFilter ? 1 : 0].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filtros Avançados */}
            {showFilters && (
              <div className="bg-muted/50 p-4 rounded-lg mb-6 space-y-4">
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
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Morador</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="Proprietário">Proprietário</SelectItem>
                        <SelectItem value="Inquilino">Inquilino</SelectItem>
                        <SelectItem value="Dependente">Dependente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Apartamento</Label>
                    <Input
                      placeholder="Filtrar por apartamento"
                      value={apartmentFilter}
                      onChange={(e) => setApartmentFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resultado dos Filtros */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredResidents.length === residents.length 
                  ? `Exibindo todos os ${totalResidents} moradores`
                  : `Exibindo ${filteredResidents.length} de ${residents.length} moradores`
                }
              </p>
              {filteredResidents.length !== residents.length && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Ver todos
                </Button>
              )}
            </div>

            {/* Lista de Moradores */}
            <div className="space-y-4">
              {filteredResidents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Nenhum morador encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || roleFilter !== "all" || apartmentFilter
                      ? "Tente ajustar os filtros de busca"
                      : "Cadastre o primeiro morador do condomínio"
                    }
                  </p>
                </div>
              ) : (
                filteredResidents.map((resident) => (
                <div key={resident.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={resident.avatar || ""} />
                        <AvatarFallback>
                          {resident.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{resident.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(resident.role)}`}>
                            {getRoleIcon(resident.role)}
                            <span>{resident.role}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.status)}`}>
                            {resident.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>Apt {resident.apartment} - Bloco {resident.block}</span>
                          </div>
                          {resident.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{resident.phone}</span>
                            </div>
                          )}
                          {resident.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{resident.email}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>CPF: {resident.cpf}</span>
                          <span className="ml-4">Nascimento: {new Date(resident.birthDate).toLocaleDateString('pt-BR')}</span>
                          <span className="ml-4">Cadastrado em: {new Date(resident.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
