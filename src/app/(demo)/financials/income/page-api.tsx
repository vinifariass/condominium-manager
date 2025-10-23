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
import { DollarSign, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Trash2, Loader2 } from "lucide-react";
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

export default function IncomePageAPI() {
  const [income, setIncome] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingIncome, setEditingIncome] = useState<FinancialRecord | null>(null);

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: 0,
    dueDate: "",
    paymentDate: "",
    paymentMethod: "",
    status: "PENDING",
  });

  const condominiumId = "temp-id";

  useEffect(() => {
    loadIncome();
  }, []);

  async function loadIncome() {
    try {
      setLoading(true);
      const res = await fetch(`/api/financial?condominiumId=${condominiumId}&type=INCOME`);
      if (!res.ok) throw new Error("Erro ao carregar receitas");
      const data = await res.json();
      setIncome(data);
    } catch (error) {
      toast.error("Erro ao carregar receitas");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.category || !formData.description || formData.amount <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingIncome ? `/api/financial/${editingIncome.id}` : "/api/financial";
      const method = editingIncome ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "INCOME",
          amount: Number(formData.amount),
          condominiumId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar receita");
      }

      toast.success(editingIncome ? "Receita atualizada!" : "Receita registrada!");
      setDialogOpen(false);
      resetForm();
      loadIncome();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta receita?")) return;

    try {
      const res = await fetch(`/api/financial/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      toast.success("Receita deletada!");
      loadIncome();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleEdit(incomeRecord: FinancialRecord) {
    setEditingIncome(incomeRecord);
    setFormData({
      category: incomeRecord.category,
      description: incomeRecord.description,
      amount: incomeRecord.amount,
      dueDate: incomeRecord.dueDate ? new Date(incomeRecord.dueDate).toISOString().split("T")[0] : "",
      paymentDate: incomeRecord.paymentDate ? new Date(incomeRecord.paymentDate).toISOString().split("T")[0] : "",
      paymentMethod: incomeRecord.paymentMethod || "",
      status: incomeRecord.status,
    });
    setDialogOpen(true);
  }

  function resetForm() {
    setEditingIncome(null);
    setFormData({
      category: "",
      description: "",
      amount: 0,
      dueDate: "",
      paymentDate: "",
      paymentMethod: "",
      status: "PENDING",
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
    total: income.reduce((sum, e) => sum + e.amount, 0),
    paid: income.filter((e) => e.status === "PAID").reduce((sum, e) => sum + e.amount, 0),
    pending: income.filter((e) => e.status === "PENDING").reduce((sum, e) => sum + e.amount, 0),
    overdue: income.filter((e) => e.status === "OVERDUE").reduce((sum, e) => sum + e.amount, 0),
  };

  if (loading) {
    return (
      <ContentLayout title="Receitas">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Receitas">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {stats.total.toFixed(2)}</div>
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
              <CardTitle>Gerenciar Receitas</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Receita
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingIncome ? "Editar Receita" : "Nova Receita"}</DialogTitle>
                      <DialogDescription>Registre uma receita do condomínio</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria *</Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Ex: Manutenção"
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
                        {editingIncome ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {income.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhuma receita registrada</div>
              ) : (
                income.map((incomeRecord) => (
                  <div key={incomeRecord.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{incomeRecord.category}</h3>
                        <Badge className={getStatusColor(incomeRecord.status)}>{incomeRecord.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incomeRecord.description}</p>
                      <p className="text-sm">
                        <span className="font-semibold text-green-600">R$ {incomeRecord.amount.toFixed(2)}</span>
                        {incomeRecord.dueDate && ` • Vencimento: ${new Date(incomeRecord.dueDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(incomeRecord)}>Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(incomeRecord.id)}>
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
