"use client";

import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
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
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Edit,
  Eye,
  UserCheck,
  Home,
  Calendar,
  FileText,
  AlertCircle,
  UserPlus,
  Building2,
  Loader2,
  Car,
  PawPrint
} from "lucide-react";

type ResidentType = "OWNER" | "TENANT" | "DEPENDENT";
type ResidentStatus = "ACTIVE" | "INACTIVE" | "MOVED_OUT";

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
}

interface Apartment {
  id: string;
  number: string;
  block?: {
    id: string;
    name: string;
  };
}

interface Resident {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  type: ResidentType;
  apartmentId: string;
  status: ResidentStatus;
  isOwner: boolean;
  moveInDate: string;
  moveOutDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  apartment?: Apartment;
  vehicles?: Vehicle[];
  pets?: Pet[];
}

export default function ResidentsPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "owners" | "tenants" | "dependents">("all");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formType, setFormType] = useState<ResidentType>("OWNER");
  const [formStatus, setFormStatus] = useState<ResidentStatus>("ACTIVE");
  const [formIsOwner, setFormIsOwner] = useState<string>("false");

  useEffect(() => {
    fetchResidents();
  }, []);

  async function fetchResidents() {
    try {
      setLoading(true);
      const res = await fetch('/api/residents');

      if (!res.ok) {
        throw new Error('Falha ao carregar moradores');
      }

      const data = await res.json();
      setResidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string,
      cpf: formData.get('cpf') as string,
      rg: formData.get('rg') as string || undefined,
      type: formType,
      apartmentId: formData.get('apartmentId') as string,
      condominiumId: 'temp-id', // TODO: Get from user session
      status: formStatus,
      isOwner: formIsOwner === 'true',
    };

    try {
      const url = editingResident
        ? `/api/residents/${editingResident.id}`
        : '/api/residents';
      const method = editingResident ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Falha ao salvar morador');
      }

      await fetchResidents();
      setDialogOpen(false);
      setEditingResident(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(resident: Resident) {
    setEditingResident(resident);
    setFormType(resident.type);
    setFormStatus(resident.status);
    setFormIsOwner(resident.isOwner ? "true" : "false");
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setEditingResident(null);
    setFormType("OWNER");
    setFormStatus("ACTIVE");
    setFormIsOwner("false");
  }

  function handleOpenCreate() {
    setEditingResident(null);
    setFormType("OWNER");
    setFormStatus("ACTIVE");
    setFormIsOwner("false");
    setDialogOpen(true);
  }

  const getStatusColor = (status: ResidentStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "MOVED_OUT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: ResidentStatus) => {
    const labels = {
      ACTIVE: "Ativo",
      INACTIVE: "Inativo",
      MOVED_OUT: "Mudou-se"
    };
    return labels[status] || status;
  };

  const getTypeColor = (type: ResidentType) => {
    switch (type) {
      case "OWNER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "TENANT":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "DEPENDENT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getTypeLabel = (type: ResidentType) => {
    const labels = {
      OWNER: "Proprietário",
      TENANT: "Locatário",
      DEPENDENT: "Dependente"
    };
    return labels[type] || type;
  };

  const filteredResidents = residents.filter(resident => {
    if (selectedTab === "all") return true;
    if (selectedTab === "owners") return resident.type === "OWNER";
    if (selectedTab === "tenants") return resident.type === "TENANT";
    if (selectedTab === "dependents") return resident.type === "DEPENDENT";
    return true;
  });

  const totalResidents = residents.length;
  const totalOwners = residents.filter(r => r.type === "OWNER").length;
  const totalTenants = residents.filter(r => r.type === "TENANT").length;
  const totalDependents = residents.filter(r => r.type === "DEPENDENT").length;
  const activeResidents = residents.filter(r => r.status === "ACTIVE").length;

  if (loading) {
    return (
      <ContentLayout title="Moradores">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando moradores...</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout title="Moradores">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Erro ao carregar moradores</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Moradores">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResidents}</div>
              <p className="text-xs text-muted-foreground">Moradores cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proprietarios</CardTitle>
              <Home className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalOwners}</div>
              <p className="text-xs text-muted-foreground">Donos de unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Locatarios</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalTenants}</div>
              <p className="text-xs text-muted-foreground">Inquilinos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dependentes</CardTitle>
              <UserPlus className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalDependents}</div>
              <p className="text-xs text-muted-foreground">Familiares</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeResidents}</div>
              <p className="text-xs text-muted-foreground">{((activeResidents/totalResidents)*100).toFixed(0)}% do total</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Moradores</CardTitle>
                <CardDescription>Visualize e gerencie todos os moradores do condominio</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) handleOpenCreate();
                if (!open) handleCloseDialog();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Morador
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingResident ? 'Editar Morador' : 'Novo Morador'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingResident
                          ? 'Atualize as informações do morador'
                          : 'Adicione um novo morador ao condomínio'}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="João Silva"
                          defaultValue={editingResident?.name}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="cpf">CPF *</Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            defaultValue={editingResident?.cpf}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="rg">RG</Label>
                          <Input
                            id="rg"
                            name="rg"
                            placeholder="00.000.000-0"
                            defaultValue={editingResident?.rg}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="joao@email.com"
                            defaultValue={editingResident?.email}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(11) 99999-9999"
                            defaultValue={editingResident?.phone}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tipo *</Label>
                          <Select value={formType} onValueChange={(value) => setFormType(value as ResidentType)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OWNER">Proprietário</SelectItem>
                              <SelectItem value="TENANT">Locatário</SelectItem>
                              <SelectItem value="DEPENDENT">Dependente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="apartmentId">ID do Apartamento *</Label>
                          <Input
                            id="apartmentId"
                            name="apartmentId"
                            placeholder="ID do apartamento"
                            defaultValue={editingResident?.apartmentId}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status *</Label>
                          <Select value={formStatus} onValueChange={(value) => setFormStatus(value as ResidentStatus)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Ativo</SelectItem>
                              <SelectItem value="INACTIVE">Inativo</SelectItem>
                              <SelectItem value="MOVED_OUT">Mudou-se</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="isOwner">É proprietário?</Label>
                          <Select value={formIsOwner} onValueChange={setFormIsOwner}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Sim</SelectItem>
                              <SelectItem value="false">Não</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={handleCloseDialog}>
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          editingResident ? 'Atualizar' : 'Criar'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={selectedTab === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("all")}
              >
                Todos ({totalResidents})
              </Button>
              <Button
                variant={selectedTab === "owners" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("owners")}
              >
                Proprietarios ({totalOwners})
              </Button>
              <Button
                variant={selectedTab === "tenants" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("tenants")}
              >
                Locatarios ({totalTenants})
              </Button>
              <Button
                variant={selectedTab === "dependents" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTab("dependents")}
              >
                Dependentes ({totalDependents})
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF, apartamento..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className="space-y-4">
              {filteredResidents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhum morador encontrado
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedTab !== "all"
                        ? `Nenhum morador do tipo selecionado`
                        : `Comece adicionando seu primeiro morador`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredResidents.map((resident) => (
                  <Card key={resident.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                            <Users className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-semibold">{resident.name}</h3>
                              <Badge className={getTypeColor(resident.type)}>
                                {getTypeLabel(resident.type)}
                              </Badge>
                              <Badge className={getStatusColor(resident.status)}>
                                {getStatusLabel(resident.status)}
                              </Badge>
                              {resident.isOwner && (
                                <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                                  Proprietário
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 mt-1 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span className="text-sm">
                                Apartamento {resident.apartment?.number}
                                {resident.apartment?.block && ` - Bloco ${resident.apartment.block.name}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(resident)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold mb-3">Informações Pessoais</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span><strong>CPF:</strong> {resident.cpf}</span>
                            </div>
                            {resident.rg && (
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span><strong>RG:</strong> {resident.rg}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{resident.phone}</span>
                            </div>
                            {resident.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{resident.email}</span>
                              </div>
                            )}
                            {resident.birthDate && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span><strong>Nascimento:</strong> {new Date(resident.birthDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Informações de Residência</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Entrada:</strong>{" "}
                              {new Date(resident.moveInDate).toLocaleDateString('pt-BR')}
                            </div>
                            {resident.moveOutDate && (
                              <div>
                                <strong>Saída:</strong>{" "}
                                {new Date(resident.moveOutDate).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Contato de Emergência</h4>
                          {resident.emergencyContactName ? (
                            <div className="space-y-1 text-sm">
                              <div>{resident.emergencyContactName}</div>
                              {resident.emergencyContactPhone && (
                                <div className="text-muted-foreground">{resident.emergencyContactPhone}</div>
                              )}
                              {resident.emergencyContactRelationship && (
                                <div className="text-xs text-muted-foreground">{resident.emergencyContactRelationship}</div>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Não cadastrado</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-sm flex items-center">
                            <Car className="h-4 w-4 mr-1" />
                            Veículos
                          </h4>
                          {resident.vehicles && resident.vehicles.length > 0 ? (
                            <div className="space-y-1 text-sm">
                              {resident.vehicles.map((vehicle) => (
                                <div key={vehicle.id}>
                                  <div className="font-medium">{vehicle.plate}</div>
                                  <div className="text-xs text-muted-foreground">{vehicle.model} - {vehicle.color}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum veículo</p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-sm flex items-center">
                            <PawPrint className="h-4 w-4 mr-1" />
                            Pets
                          </h4>
                          {resident.pets && resident.pets.length > 0 ? (
                            <div className="space-y-1 text-sm">
                              {resident.pets.map((pet) => (
                                <div key={pet.id}>
                                  <div className="font-medium">{pet.name}</div>
                                  <div className="text-xs text-muted-foreground">{pet.species} - {pet.breed}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum pet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
