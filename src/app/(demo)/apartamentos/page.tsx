'use client'

import { useEffect, useState } from "react";
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
  Home,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Eye,
  Key,
  UserCheck,
  UserX,
  Building2,
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";

type ApartmentStatus = "OCCUPIED" | "VACANT" | "MAINTENANCE" | "DEFAULTER";
type ResidentType = "OWNER" | "TENANT" | "DEPENDENT";

interface Resident {
  id: string;
  name: string;
  email?: string;
  phone: string;
  type: ResidentType;
  isOwner: boolean;
}

interface Block {
  id: string;
  name: string;
}

interface Apartment {
  id: string;
  number: string;
  floor: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  status: ApartmentStatus;
  monthlyFee: number;
  balance: number;
  lastPaymentDate?: string;
  block?: Block;
  residents?: Resident[];
}

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<ApartmentStatus>("VACANT");

  useEffect(() => {
    fetchApartments();
  }, []);

  async function fetchApartments() {
    try {
      setLoading(true);
      const res = await fetch('/api/apartments');

      if (!res.ok) {
        throw new Error('Falha ao carregar apartamentos');
      }

      const data = await res.json();
      setApartments(data);
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
      number: formData.get('number') as string,
      floor: parseInt(formData.get('floor') as string),
      area: parseFloat(formData.get('area') as string),
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseInt(formData.get('bathrooms') as string),
      parkingSpots: parseInt(formData.get('parkingSpots') as string),
      monthlyFee: parseFloat(formData.get('monthlyFee') as string),
      status: formStatus,
      condominiumId: 'temp-id', // TODO: Get from user session
    };

    try {
      const url = editingApartment
        ? `/api/apartments/${editingApartment.id}`
        : '/api/apartments';
      const method = editingApartment ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Falha ao salvar apartamento');
      }

      await fetchApartments();
      setDialogOpen(false);
      setEditingApartment(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(apartment: Apartment) {
    setEditingApartment(apartment);
    setFormStatus(apartment.status);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setEditingApartment(null);
    setFormStatus("VACANT");
  }

  function handleOpenCreate() {
    setEditingApartment(null);
    setFormStatus("VACANT");
    setDialogOpen(true);
  }

  const getStatusColor = (status: ApartmentStatus) => {
    switch (status) {
      case "OCCUPIED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "VACANT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "MAINTENANCE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "DEFAULTER":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: ApartmentStatus) => {
    const labels = {
      OCCUPIED: "Ocupado",
      VACANT: "Vago",
      MAINTENANCE: "Em Reforma",
      DEFAULTER: "Inadimplente"
    };
    return labels[status] || status;
  };

  const getResidentTypeLabel = (type: ResidentType) => {
    const labels = {
      OWNER: "Proprietário",
      TENANT: "Locatário",
      DEPENDENT: "Dependente"
    };
    return labels[type] || type;
  };

  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter(a => a.status === "OCCUPIED").length;
  const vacantApartments = apartments.filter(a => a.status === "VACANT").length;
  const defaulterApartments = apartments.filter(a => a.balance < 0).length;
  const totalRevenue = apartments.reduce((sum, a) => sum + a.monthlyFee, 0);

  if (loading) {
    return (
      <ContentLayout title="Apartamentos">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando apartamentos...</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout title="Apartamentos">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Erro ao carregar apartamentos</p>
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
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApartments}</div>
              <p className="text-xs text-muted-foreground">Unidades cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{occupiedApartments}</div>
              <p className="text-xs text-muted-foreground">{((occupiedApartments/totalApartments)*100).toFixed(0)}% do total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagos</CardTitle>
              <UserX className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{vacantApartments}</div>
              <p className="text-xs text-muted-foreground">Disponiveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{defaulterApartments}</div>
              <p className="text-xs text-muted-foreground">Com debitos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Mensal prevista</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Apartamentos</CardTitle>
                <CardDescription>Visualize e gerencie todos os apartamentos do condominio</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (open) handleOpenCreate();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Apartamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingApartment ? 'Editar Apartamento' : 'Novo Apartamento'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingApartment
                          ? 'Atualize as informações do apartamento'
                          : 'Adicione um novo apartamento ao condomínio'}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="number">Número *</Label>
                          <Input
                            id="number"
                            name="number"
                            placeholder="101"
                            defaultValue={editingApartment?.number}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="floor">Andar *</Label>
                          <Input
                            id="floor"
                            name="floor"
                            type="number"
                            placeholder="1"
                            defaultValue={editingApartment?.floor}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="area">Área (m²) *</Label>
                          <Input
                            id="area"
                            name="area"
                            type="number"
                            step="0.01"
                            placeholder="75.5"
                            defaultValue={editingApartment?.area}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="monthlyFee">Taxa Mensal (R$) *</Label>
                          <Input
                            id="monthlyFee"
                            name="monthlyFee"
                            type="number"
                            step="0.01"
                            placeholder="850.00"
                            defaultValue={editingApartment?.monthlyFee}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bedrooms">Quartos *</Label>
                          <Input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            placeholder="2"
                            defaultValue={editingApartment?.bedrooms}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="bathrooms">Banheiros *</Label>
                          <Input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            placeholder="2"
                            defaultValue={editingApartment?.bathrooms}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="parkingSpots">Vagas *</Label>
                          <Input
                            id="parkingSpots"
                            name="parkingSpots"
                            type="number"
                            placeholder="1"
                            defaultValue={editingApartment?.parkingSpots}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formStatus} onValueChange={(value) => setFormStatus(value as ApartmentStatus)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VACANT">Vago</SelectItem>
                            <SelectItem value="OCCUPIED">Ocupado</SelectItem>
                            <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
                            <SelectItem value="DEFAULTER">Inadimplente</SelectItem>
                          </SelectContent>
                        </Select>
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
                          editingApartment ? 'Atualizar' : 'Criar'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por numero, bloco ou morador..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className="space-y-4">
              {apartments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Home className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Nenhum apartamento cadastrado
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Comece adicionando seu primeiro apartamento
                    </p>
                  </CardContent>
                </Card>
              ) : (
                apartments.map((apartment) => {
                  const owner = apartment.residents?.find(r => r.isOwner);
                  const currentResident = apartment.residents?.find(r => !r.isOwner) || owner;

                  return (
                    <Card key={apartment.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                              <Home className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-semibold">Apartamento {apartment.number}</h3>
                                <Badge className={getStatusColor(apartment.status)}>
                                  {getStatusLabel(apartment.status)}
                                </Badge>
                                {apartment.balance < 0 && <Badge variant="destructive">Inadimplente</Badge>}
                              </div>
                              <div className="flex items-center space-x-1 mt-1 text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span className="text-sm">
                                  {apartment.block ? `Bloco ${apartment.block.name} - ` : ''}
                                  {apartment.floor}º Andar - {apartment.area}m²
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizar
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(apartment)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold">{apartment.bedrooms}</div>
                            <div className="text-xs text-muted-foreground">Quartos</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold">{apartment.bathrooms}</div>
                            <div className="text-xs text-muted-foreground">Banheiros</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold">{apartment.parkingSpots}</div>
                            <div className="text-xs text-muted-foreground">Vagas</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              R$ {apartment.monthlyFee.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-muted-foreground">Taxa Mensal</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Key className="h-4 w-4 mr-2" />
                              Proprietário
                            </h4>
                            {owner ? (
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">Nome:</span> {owner.name}</div>
                                <div><span className="font-medium">Telefone:</span> {owner.phone}</div>
                                {owner.email && (
                                  <div><span className="font-medium">Email:</span> {owner.email}</div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum proprietário cadastrado</p>
                            )}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Morador Atual
                            </h4>
                            {currentResident ? (
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">Nome:</span> {currentResident.name}</div>
                                <div>
                                  <span className="font-medium">Tipo:</span>{" "}
                                  <Badge variant="outline" className="ml-1">
                                    {getResidentTypeLabel(currentResident.type)}
                                  </Badge>
                                </div>
                                {apartment.lastPaymentDate && (
                                  <div>
                                    <span className="font-medium">Último Pagamento:</span>{" "}
                                    {new Date(apartment.lastPaymentDate).toLocaleDateString('pt-BR')}
                                  </div>
                                )}
                                {apartment.balance < 0 && (
                                  <div className="flex items-center text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="font-medium">
                                      Débito: R$ {Math.abs(apartment.balance).toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Nenhum morador cadastrado</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
