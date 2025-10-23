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
import { DollarSign, Plus, Calendar, Clock, CheckCircle, AlertCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FinancialRecord {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  dueDate: Date | null;
  paymentDate: Date | null;
  paymentMethod: string | null;
  status: string;
  apartmentId: string | null;
  apartment: { number: string; block: { name: string } | null } | null;
  condominiumId: string;
}

export default function FeesPageAPI() {
  const [fees, setFees] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingFee, setEditingFee] = useState<FinancialRecord | null>(null);

  const [formData, setFormData] = useState({
    category: "Taxa Condominial",
    description: "",
    amount: 0,
    dueDate: "",
    paymentDate: "",
    paymentMethod: "",
    status: "PENDING",
    apartmentId: "",
  });

  const condominiumId = "temp-id";

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    try {
      setLoading(true);
      const res = await fetch(`/api/financial?condominiumId=${condominiumId}&type=FEE`);
      if (!res.ok) throw new Error("Erro ao carregar taxas");
      const data = await res.json();
      setFees(data);
    } catch (error) {
      toast.error("Erro ao carregar taxas");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.category || !formData.description || formData.amount <= 0 || !formData.apartmentId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingFee ? `/api/financial/${editingFee.id}` : "/api/financial";
      const method = editingFee ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "FEE",
          amount: Number(formData.amount),
          condominiumId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar taxa");
      }

      toast.success(editingFee ? "Taxa atualizada!" : "Taxa registrada!");
      setDialogOpen(false);
      resetForm();
      loadFees();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta taxa?")) return;

    try {
      const res = await fetch(`/api/financial/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      toast.success("Taxa deletada!");
      loadFees();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(feeRecord: FinancialRecord) {
    setEditingFee(feeRecord);
    setFormData({
      category: feeRecord.category,
      description: feeRecord.description,
      amount: feeRecord.amount,
      dueDate: feeRecord.dueDate ? new Date(feeRecord.dueDate).toISOString().split("T")[0] : "",
      paymentDate: feeRecord.paymentDate ? new Date(feeRecord.paymentDate).toISOString().split("T")[0] : "",
      paymentMethod: feeRecord.paymentMethod || "",
      status: feeRecord.status,
      apartmentId: feeRecord.apartmentId || "",
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingFee(null);
    setFormData({
      category: "Taxa Condominial",
      description: "",
      amount: 0,
      dueDate: "",
      paymentDate: "",
      paymentMethod: "",
      status: "PENDING",
      apartmentId: "",
    });
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      OVERDUE: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: fees.reduce((sum, e) => sum + e.amount, 0),
    paid: fees.filter((e) => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0),
    pending: fees.filter((e) => e.status === "PENDING").reduce((sum, e) => sum + e.amount, 0),
    overdue: fees.filter((e) => e.status === "OVERDUE").reduce((sum, e) => sum + e.amount, 0),
  };

  if (loading) {
    return (
      <ContentLayout title="Taxas Condominiais">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Taxas Condominiais">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {stats.total.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pago</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {stats.paid.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">R$ {stats.pending.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {stats.overdue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Gerenciar Taxas</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Taxa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingFee ? "Editar Taxa" : "Nova Taxa"}</DialogTitle>
                      <DialogDescription>Registre uma taxa condominial</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria *</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Ex: Taxa Condominial"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor (R$) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="apartmentId">Apartamento *</Label>
                        <Input
                          id="apartmentId"
                          value={formData.apartmentId}
                          onChange={(e) => setFormData({ ...formData, apartmentId: e.target.value })}
                          placeholder="ID do apartamento"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="dueDate">Vencimento</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pendente</SelectItem>
                              <SelectItem value="PAID">Pago</SelectItem>
                              <SelectItem value="OVERDUE">Atrasado</SelectItem>
                              <SelectItem value="CANCELLED">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingFee ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhuma taxa registrada</div>
              ) : (
                fees.map((feeRecord) => (
                  <div key={feeRecord.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{feeRecord.category}</h3>
                        <Badge className={getStatusColor(feeRecord.status)}>{feeRecord.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feeRecord.description}</p>
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">R$ {feeRecord.amount.toFixed(2)}</span>
                        {feeRecord.apartment && ` • Apt ${feeRecord.apartment.number}`}
                        {feeRecord.dueDate && ` • Vencimento: ${new Date(feeRecord.dueDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(feeRecord)}>Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(feeRecord.id)}>
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
