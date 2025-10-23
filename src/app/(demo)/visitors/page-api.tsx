"use client";

import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

interface Visitor {
  id: string;
  name: string;
  phone: string | null;
  document: string;
  visitingResidentId: string;
  visitingResident: {
    name: string;
    phone: string;
    apartment: { number: string; block: { name: string } | null };
  };
  condominiumId: string;
  vehiclePlate: string | null;
  company: string | null;
  purpose: string;
  type: string;
  status: string;
  arrivalTime: Date;
  departureTime: Date | null;
  authorizedBy: string | null;
}

export default function VisitorsPageAPI() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    document: "",
    visitingResidentId: "",
    vehiclePlate: "",
    company: "",
    purpose: "",
    type: "VISITOR",
  });

  const condominiumId = "temp-id";

  useEffect(() => {
    loadVisitors();
  }, []);

  async function loadVisitors() {
    try {
      setLoading(true);
      const res = await fetch(`/api/visitors?condominiumId=${condominiumId}`);
      if (!res.ok) throw new Error("Erro ao carregar visitantes");
      const data = await res.json();
      setVisitors(data);
    } catch (error) {
      toast.error("Erro ao carregar visitantes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.name || !formData.document || !formData.purpose) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingVisitor ? `/api/visitors/${editingVisitor.id}` : "/api/visitors";
      const method = editingVisitor ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          condominiumId,
          visitingResidentId: "temp-resident-id", // TODO: Select de moradores
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar visitante");
      }

      toast.success(editingVisitor ? "Visitante atualizado!" : "Visitante registrado!");
      setDialogOpen(false);
      resetForm();
      loadVisitors();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja remover este visitante?")) return;

    try {
      const res = await fetch(`/api/visitors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao remover visitante");
      toast.success("Visitante removido!");
      loadVisitors();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleAuthorize(id: string) {
    try {
      const res = await fetch(`/api/visitors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "AUTHORIZED" }),
      });
      if (!res.ok) throw new Error("Erro ao autorizar");
      toast.success("Visitante autorizado!");
      loadVisitors();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(visitor: Visitor) {
    setEditingVisitor(visitor);
    setFormData({
      name: visitor.name,
      phone: visitor.phone || "",
      document: visitor.document,
      visitingResidentId: visitor.visitingResidentId,
      vehiclePlate: visitor.vehiclePlate || "",
      company: visitor.company || "",
      purpose: visitor.purpose,
      type: visitor.type,
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingVisitor(null);
    setFormData({
      name: "",
      phone: "",
      document: "",
      visitingResidentId: "",
      vehiclePlate: "",
      company: "",
      purpose: "",
      type: "VISITOR",
    });
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      WAITING: "bg-yellow-100 text-yellow-800",
      AUTHORIZED: "bg-green-100 text-green-800",
      DENIED: "bg-red-100 text-red-800",
      ENTERED: "bg-blue-100 text-blue-800",
      LEFT: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: visitors.length,
    waiting: visitors.filter((v) => v.status === "WAITING").length,
    inside: visitors.filter((v) => v.status === "ENTERED" || v.status === "AUTHORIZED").length,
    today: visitors.filter((v) => {
      const today = new Date().toDateString();
      return new Date(v.arrivalTime).toDateString() === today;
    }).length,
  };

  if (loading) {
    return (
      <ContentLayout title="Visitantes">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Controle de Visitantes">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Condomínio</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inside}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciar Visitantes</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Visitante
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingVisitor ? "Editar Visitante" : "Novo Visitante"}
                      </DialogTitle>
                      <DialogDescription>Registre a entrada de um visitante</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="document">CPF/RG *</Label>
                          <Input
                            id="document"
                            value={formData.document}
                            onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tipo</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VISITOR">Visitante</SelectItem>
                              <SelectItem value="DELIVERY">Entrega</SelectItem>
                              <SelectItem value="SERVICE">Serviço</SelectItem>
                              <SelectItem value="CONTRACTOR">Prestador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
                          <Input
                            id="vehiclePlate"
                            value={formData.vehiclePlate}
                            onChange={(e) =>
                              setFormData({ ...formData, vehiclePlate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purpose">Motivo da Visita *</Label>
                        <Input
                          id="purpose"
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingVisitor ? "Atualizar" : "Registrar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum visitante registrado
                </div>
              ) : (
                visitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{visitor.name}</h3>
                        <Badge className={getStatusColor(visitor.status)}>{visitor.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Visitando: {visitor.visitingResident.name} - Apt{" "}
                        {visitor.visitingResident.apartment.number}
                      </p>
                      <p className="text-sm">
                        {visitor.purpose} •{" "}
                        {new Date(visitor.arrivalTime).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {visitor.status === "WAITING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAuthorize(visitor.id)}
                        >
                          Autorizar
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(visitor)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(visitor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
