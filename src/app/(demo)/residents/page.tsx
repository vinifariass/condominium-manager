"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  Building2,
  Loader2
} from "lucide-react";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  block: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: string;
  condominiumId?: string;
  condominiumName?: string;
}

interface Condominium {
  id: string;
  name: string;
  address: string;
}

interface Block {
  id: string;
  name: string;
  description?: string;
  apartmentCount: number;
  condominiumId: string;
}

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
  const [condominiumFilter, setCondominiumFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados dos dropdowns
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  
  // Estado para o formulário de cadastro
  const [newResident, setNewResident] = useState({
    name: "",
    email: "",
    phone: "",
    apartmentNumber: "",
    blockId: "",
    role: "",
    status: "ACTIVE",
    condominiumId: ""
  });

  // Carregar condomínios ao montar o componente
  useEffect(() => {
    loadCondominiums();
  }, []);

  // Carregar blocos quando o condomínio for selecionado
  useEffect(() => {
    if (newResident.condominiumId) {
      loadBlocks(newResident.condominiumId);
    }
  }, [newResident.condominiumId]);

  // Carregar moradores quando o filtro de condomínio mudar
  useEffect(() => {
    loadResidents();
  }, [condominiumFilter, statusFilter, roleFilter, apartmentFilter, searchTerm]);

  const loadCondominiums = async () => {
    try {
      const response = await fetch('/api/condominiums');
      if (response.ok) {
        const data = await response.json();
        setCondominiums(data);
      }
    } catch (error) {
      console.error('Erro ao carregar condomínios:', error);
    }
  };

  const loadBlocks = async (condominiumId: string) => {
    try {
      const response = await fetch(`/api/blocks?condominiumId=${condominiumId}`);
      if (response.ok) {
        const data = await response.json();
        setBlocks(data);
      }
    } catch (error) {
      console.error('Erro ao carregar blocos:', error);
    }
  };

  const loadResidents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (condominiumFilter) params.append('condominiumId', condominiumFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (apartmentFilter) params.append('apartment', apartmentFilter);

      const response = await fetch(`/api/residents?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResidents(data);
      }
    } catch (error) {
      console.error('Erro ao carregar moradores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar novo morador
  const handleAddResident = async () => {
    if (!newResident.name || !newResident.email || !newResident.condominiumId) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResident),
      });

      if (response.ok) {
        const newResidentData = await response.json();
        setResidents([...residents, newResidentData]);
        setNewResident({
          name: "",
          email: "",
          phone: "",
          apartmentNumber: "",
          blockId: "",
          role: "",
          status: "ACTIVE",
          condominiumId: ""
        });
        setShowAddModal(false);
        loadResidents(); // Recarregar a lista
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cadastrar morador');
      }
    } catch (error) {
      console.error('Erro ao cadastrar morador:', error);
      alert('Erro ao cadastrar morador');
    } finally {
      setSubmitting(false);
    }
  };

  // Função para remover morador
  const handleDeleteResident = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este morador?')) {
      return;
    }

    try {
      const response = await fetch(`/api/residents?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResidents(residents.filter(r => r.id !== id));
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao remover morador');
      }
    } catch (error) {
      console.error('Erro ao remover morador:', error);
      alert('Erro ao remover morador');
    }
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setApartmentFilter("");
    setCondominiumFilter("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "INACTIVE":
        return "text-red-600 bg-red-100";
      case "SUSPENDED":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      case "SUSPENDED":
        return "Suspenso";
      default:
        return status;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600 bg-red-100";
      case "MANAGER":
        return "text-blue-600 bg-blue-100";
      case "EMPLOYEE":
        return "text-purple-600 bg-purple-100";
      case "RESIDENT":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "MANAGER":
        return "Síndico";
      case "EMPLOYEE":
        return "Funcionário";
      case "RESIDENT":
        return "Morador";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-3 w-3" />;
      case "MANAGER":
        return <Shield className="h-3 w-3" />;
      case "EMPLOYEE":
        return <User className="h-3 w-3" />;
      case "RESIDENT":
        return <UserPlus className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const activeResidents = residents.filter(r => r.status === "ACTIVE");
  const totalResidents = residents.length;
  const admins = residents.filter(r => r.role === "ADMIN").length;
  const managers = residents.filter(r => r.role === "MANAGER").length;
  const employees = residents.filter(r => r.role === "EMPLOYEE").length;
  const residentUsers = residents.filter(r => r.role === "RESIDENT").length;

  return (
    <ContentLayout title="Usuários do Sistema">
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
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
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{admins}</div>
              <p className="text-xs text-muted-foreground">
                {totalResidents > 0 ? Math.round((admins / totalResidents) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Síndicos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{managers}</div>
              <p className="text-xs text-muted-foreground">
                {totalResidents > 0 ? Math.round((managers / totalResidents) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moradores</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{residentUsers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários residentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciamento de Moradores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários do sistema por condomínio
                </CardDescription>
              </div>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do novo usuário do sistema.
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
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newResident.email}
                          onChange={(e) => setNewResident({...newResident, email: e.target.value})}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={newResident.phone}
                          onChange={(e) => setNewResident({...newResident, phone: e.target.value})}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="condominiumId">Condomínio *</Label>
                        <Select value={newResident.condominiumId} onValueChange={(value) => setNewResident({...newResident, condominiumId: value, blockId: ""})}>
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="apartmentNumber">Apartamento</Label>
                        <Input
                          id="apartmentNumber"
                          value={newResident.apartmentNumber}
                          onChange={(e) => setNewResident({...newResident, apartmentNumber: e.target.value})}
                          placeholder="101"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blockId">Bloco</Label>
                        <Select 
                          value={newResident.blockId} 
                          onValueChange={(value) => setNewResident({...newResident, blockId: value})}
                          disabled={!newResident.condominiumId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o bloco" />
                          </SelectTrigger>
                          <SelectContent>
                            {blocks.map((block) => (
                              <SelectItem key={block.id} value={block.id}>
                                {block.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Tipo de Usuário *</Label>
                        <Select value={newResident.role} onValueChange={(value) => setNewResident({...newResident, role: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="MANAGER">Síndico</SelectItem>
                            <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                            <SelectItem value="RESIDENT">Morador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={newResident.status} onValueChange={(value) => setNewResident({...newResident, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Ativo</SelectItem>
                            <SelectItem value="INACTIVE">Inativo</SelectItem>
                            <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddResident} disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {submitting ? 'Salvando...' : 'Salvar Usuário'}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Condomínio</Label>
                    <Select value={condominiumFilter} onValueChange={setCondominiumFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os condomínios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os condomínios</SelectItem>
                        {condominiums.map((condo) => (
                          <SelectItem key={condo.id} value={condo.id}>
                            {condo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                        <SelectItem value="INACTIVE">Inativo</SelectItem>
                        <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Usuário</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="MANAGER">Síndico</SelectItem>
                        <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                        <SelectItem value="RESIDENT">Morador</SelectItem>
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
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Exibindo {residents.length} usuários
                </p>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              {(searchTerm || statusFilter !== "all" || roleFilter !== "all" || apartmentFilter || condominiumFilter) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Ver todos
                </Button>
              )}
            </div>

            {/* Lista de Moradores */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Carregando usuários...</p>
                </div>
              ) : residents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || roleFilter !== "all" || apartmentFilter || condominiumFilter
                      ? "Tente ajustar os filtros de busca"
                      : "Cadastre o primeiro usuário do sistema"
                    }
                  </p>
                </div>
              ) : (
                residents.map((resident: Resident) => (
                <div key={resident.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={resident.avatar || ""} />
                        <AvatarFallback>
                          {resident.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{resident.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(resident.role)}`}>
                            {getRoleIcon(resident.role)}
                            <span>{getRoleLabel(resident.role)}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.status)}`}>
                            {getStatusLabel(resident.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                          {resident.apartment && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>
                                Apt {resident.apartment}
                                {resident.block && ` - Bloco ${resident.block}`}
                              </span>
                            </div>
                          )}
                          {resident.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{resident.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{resident.email}</span>
                          </div>
                          {resident.condominiumName && (
                            <div className="flex items-center space-x-1">
                              <Building2 className="h-3 w-3" />
                              <span>{resident.condominiumName}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>Cadastrado em: {new Date(resident.createdAt).toLocaleDateString('pt-BR')}</span>
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
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteResident(resident.id)}
                          >
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
