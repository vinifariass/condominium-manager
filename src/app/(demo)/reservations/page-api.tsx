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
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Reservation {
  id: string;
  commonAreaId: string;
  commonArea: { name: string };
  residentId: string;
  resident: { name: string; phone: string; apartment: { number: string } };
  condominiumId: string;
  date: Date;
  startTime: string;
  endTime: string;
  guests: number;
  status: string;
  paymentStatus: string;
  amount: number;
  observation: string | null;
}

export default function ReservationsPageAPI() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    commonAreaId: "",
    residentId: "",
    date: "",
    startTime: "",
    endTime: "",
    guests: 1,
    amount: 0,
    observation: ""
  });

  const condominiumId = "temp-id"; // TODO: Get from auth

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setLoading(true);
      const res = await fetch(`/api/reservations?condominiumId=${condominiumId}`);
      if (!res.ok) throw new Error("Erro ao carregar reservas");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      toast.error("Erro ao carregar reservas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.commonAreaId || !formData.residentId || !formData.date) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingReservation ? `/api/reservations/${editingReservation.id}` : "/api/reservations";
      const method = editingReservation ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guests: Number(formData.guests),
          amount: Number(formData.amount),
          condominiumId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar reserva");
      }

      toast.success(editingReservation ? "Reserva atualizada!" : "Reserva criada!");
      setDialogOpen(false);
      resetForm();
      loadReservations();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao cancelar reserva");
      toast.success("Reserva cancelada!");
      loadReservations();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(reservation: Reservation) {
    setEditingReservation(reservation);
    setFormData({
      commonAreaId: reservation.commonAreaId,
      residentId: reservation.residentId,
      date: new Date(reservation.date).toISOString().split("T")[0],
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      guests: reservation.guests,
      amount: reservation.amount,
      observation: reservation.observation || "",
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingReservation(null);
    setFormData({
      commonAreaId: "",
      residentId: "",
      date: "",
      startTime: "",
      endTime: "",
      guests: 1,
      amount: 0,
      observation: "",
    });
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
      COMPLETED: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: reservations.length,
    upcoming: reservations.filter((r) => new Date(r.date) >= new Date() && r.status === "CONFIRMED").length,
    pending: reservations.filter((r) => r.paymentStatus === "PENDING").length,
    revenue: reservations
      .filter((r) => r.paymentStatus === "PAID")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  if (loading) {
    return (
      <ContentLayout title="Reservas">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Reservas de Áreas Comuns">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamento Pendente</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {stats.revenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Reservas</CardTitle>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>
                        {editingReservation ? "Editar Reserva" : "Nova Reserva"}
                      </DialogTitle>
                      <DialogDescription>
                        Preencha os dados da reserva
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Data *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime">Hora Início *</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) =>
                              setFormData({ ...formData, startTime: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime">Hora Fim *</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="guests">Convidados</Label>
                          <Input
                            id="guests"
                            type="number"
                            value={formData.guests}
                            onChange={(e) =>
                              setFormData({ ...formData, guests: Number(e.target.value) })
                            }
                            min="1"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor (R$)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({ ...formData, amount: Number(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="observation">Observações</Label>
                        <Input
                          id="observation"
                          value={formData.observation}
                          onChange={(e) =>
                            setFormData({ ...formData, observation: e.target.value })
                          }
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
                        {editingReservation ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma reserva encontrada
                </div>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{reservation.commonArea.name}</h3>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.resident.name} - Apt {reservation.resident.apartment.number}
                      </p>
                      <p className="text-sm">
                        {new Date(reservation.date).toLocaleDateString()} •{" "}
                        {reservation.startTime} - {reservation.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(reservation)}>
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(reservation.id)}
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
