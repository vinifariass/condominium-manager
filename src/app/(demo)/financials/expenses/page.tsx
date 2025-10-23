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
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Download,
  Building2,
  Wrench,
  Lightbulb,
  Droplets,
  Car,
  Users,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar
} from "lucide-react";

export default function ExpensesPage() {
  // Dados das despesas
  const expenses = [
    {
      id: 1,
      type: "Manutenção",
      description: "Reparo no elevador - Bloco A",
      supplier: "Elevadores & Cia Ltda",
      supplierContact: "(21) 99999-1111",
      amount: 2500.00,
      dueDate: "2024-12-20",
      paymentDate: "2024-12-18",
      status: "Pago",
      paymentMethod: "Transferência Bancária",
      category: "Manutenção",
      condominium: "Condomínio Santos Dumont",
      reference: "Dezembro/2024",
      invoice: "NF-001234",
      approved: true,
      approvedBy: "João Silva - Síndico"
    },
    {
      id: 2,
      type: "Energia Elétrica",
      description: "Conta de energia elétrica - Área comum",
      supplier: "Light S.A.",
      supplierContact: "0800-123-4567",
      amount: 1850.00,
      dueDate: "2024-12-25",
      paymentDate: null,
      status: "Pendente",
      paymentMethod: null,
      category: "Utilidades",
      condominium: "Condomínio Santos Dumont",
      reference: "Novembro/2024",
      invoice: "NF-567890",
      approved: true,
      approvedBy: "João Silva - Síndico"
    },
    {
      id: 3,
      type: "Limpeza",
      description: "Serviços de limpeza e conservação",
      supplier: "Limpeza Total Ltda",
      supplierContact: "(21) 98888-2222",
      amount: 3200.00,
      dueDate: "2024-12-30",
      paymentDate: "2024-12-28",
      status: "Pago",
      paymentMethod: "PIX",
      category: "Serviços",
      condominium: "Condomínio Griffe",
      reference: "Dezembro/2024",
      invoice: "NF-111222",
      approved: true,
      approvedBy: "Maria Santos - Síndica"
    },
    {
      id: 4,
      type: "Segurança",
      description: "Serviços de portaria e vigilância",
      supplier: "Segurança 24h Ltda",
      supplierContact: "(21) 97777-3333",
      amount: 4500.00,
      dueDate: "2024-12-15",
      paymentDate: null,
      status: "Em Atraso",
      paymentMethod: null,
      category: "Segurança",
      condominium: "Condomínio Griffe",
      reference: "Dezembro/2024",
      invoice: "NF-333444",
      approved: false,
      approvedBy: null
    },
    {
      id: 5,
      type: "Água",
      description: "Conta de água - Consumo geral",
      supplier: "CEDAE",
      supplierContact: "0800-555-0195",
      amount: 890.00,
      dueDate: "2024-12-22",
      paymentDate: "2024-12-20",
      status: "Pago",
      paymentMethod: "Débito Automático",
      category: "Utilidades",
      condominium: "Condomínio Santos Dumont",
      reference: "Novembro/2024",
      invoice: "NF-555666",
      approved: true,
      approvedBy: "João Silva - Síndico"
    }
  ];

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filtros
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const searchMatch = searchTerm === "" || 
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "all" || expense.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || expense.category === categoryFilter;

      return searchMatch && statusMatch && categoryMatch;
    });
  }, [expenses, searchTerm, statusFilter, categoryFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      paid: filteredExpenses.filter(expense => expense.status === "Pago").reduce((sum, expense) => sum + expense.amount, 0),
      pending: filteredExpenses.filter(expense => expense.status === "Pendente").reduce((sum, expense) => sum + expense.amount, 0),
      overdue: filteredExpenses.filter(expense => expense.status === "Em Atraso").reduce((sum, expense) => sum + expense.amount, 0),
      count: filteredExpenses.length,
      approved: filteredExpenses.filter(expense => expense.approved).length,
      awaitingApproval: filteredExpenses.filter(expense => !expense.approved).length
    };
  }, [filteredExpenses]);

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Em Atraso":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300";
    }
  };

  // Função para cor da categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Manutenção":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "Utilidades":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Serviços":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Segurança":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300";
    }
  };

  // Ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Manutenção":
        return <Wrench className="h-4 w-4" />;
      case "Utilidades":
        return <Lightbulb className="h-4 w-4" />;
      case "Serviços":
        return <Users className="h-4 w-4" />;
      case "Segurança":
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Exportação CSV
  const exportToCSV = () => {
    const csvData = filteredExpenses.map(expense => ({
      "Tipo": expense.type,
      "Descrição": expense.description,
      "Fornecedor": expense.supplier,
      "Valor": expense.amount,
      "Vencimento": expense.dueDate,
      "Pagamento": expense.paymentDate || "Não pago",
      "Status": expense.status,
      "Categoria": expense.category,
      "Condomínio": expense.condominium,
      "Nota Fiscal": expense.invoice,
      "Aprovado": expense.approved ? "Sim" : "Não",
      "Aprovado por": expense.approvedBy || "N/A"
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "despesas.csv";
    a.click();
  };

  return (
    <ContentLayout title="Despesas">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(stats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valores Pagos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats.paid)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pagamentos confirmados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valores Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {formatCurrency(stats.pending)}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando pagamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valores em Atraso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(stats.overdue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Vencimentos em atraso
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar despesas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Atraso">Em Atraso</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Utilidades">Utilidades</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Segurança">Segurança</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Despesa</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova despesa ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Categoria</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manutencao">Manutenção</SelectItem>
                            <SelectItem value="utilidades">Utilidades</SelectItem>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="seguranca">Segurança</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="supplier">Fornecedor</Label>
                        <Input id="supplier" placeholder="Nome do fornecedor" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" placeholder="Descrição da despesa" />
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor</Label>
                        <Input id="amount" type="number" placeholder="0,00" />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input id="dueDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="invoice">Nota Fiscal</Label>
                        <Input id="invoice" placeholder="Número da NF" />
                      </div>
                      <div>
                        <Label htmlFor="condominium">Condomínio</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o condomínio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="santos-dumont">Condomínio Santos Dumont</SelectItem>
                            <SelectItem value="griffe">Condomínio Griffe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setShowAddDialog(false)}>
                        Cadastrar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Despesas</CardTitle>
            <CardDescription>
              {filteredExpenses.length} despesa(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(expense.category)}
                          <span className="font-medium">{expense.type}</span>
                        </div>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                        <Badge className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                        {expense.approved ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            ✓ Aprovado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                            ⏳ Aguardando
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Descrição:</p>
                          <p className="font-medium">{expense.description}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fornecedor:</p>
                          <p className="font-medium">{expense.supplier}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valor:</p>
                          <p className="font-semibold text-red-600 dark:text-red-400">
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vencimento:</p>
                          <p className="font-medium">
                            {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pagamento:</p>
                          <p className="font-medium">
                            {expense.paymentDate 
                              ? new Date(expense.paymentDate).toLocaleDateString('pt-BR')
                              : "Não pago"
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Nota Fiscal:</p>
                          <p className="font-medium">{expense.invoice}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedExpense(expense)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredExpenses.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma despesa encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Despesa</DialogTitle>
            </DialogHeader>
            {selectedExpense && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <p className="font-medium">{selectedExpense.type}</p>
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Badge className={getCategoryColor(selectedExpense.category)}>
                      {selectedExpense.category}
                    </Badge>
                  </div>
                  <div>
                    <Label>Fornecedor</Label>
                    <p className="font-medium">{selectedExpense.supplier}</p>
                  </div>
                  <div>
                    <Label>Contato</Label>
                    <p className="font-medium">{selectedExpense.supplierContact}</p>
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(selectedExpense.amount)}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedExpense.status)}>
                      {selectedExpense.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Data de Vencimento</Label>
                    <p className="font-medium">
                      {new Date(selectedExpense.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label>Data de Pagamento</Label>
                    <p className="font-medium">
                      {selectedExpense.paymentDate 
                        ? new Date(selectedExpense.paymentDate).toLocaleDateString('pt-BR')
                        : "Não pago"
                      }
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Descrição</Label>
                    <p className="font-medium">{selectedExpense.description}</p>
                  </div>
                  <div>
                    <Label>Forma de Pagamento</Label>
                    <p className="font-medium">{selectedExpense.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Nota Fiscal</Label>
                    <p className="font-medium">{selectedExpense.invoice}</p>
                  </div>
                  <div>
                    <Label>Condomínio</Label>
                    <p className="font-medium">{selectedExpense.condominium}</p>
                  </div>
                  <div>
                    <Label>Aprovação</Label>
                    <div className="flex items-center gap-2">
                      {selectedExpense.approved ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          ✓ Aprovado
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                          ⏳ Aguardando Aprovação
                        </Badge>
                      )}
                    </div>
                  </div>
                  {selectedExpense.approvedBy && (
                    <div>
                      <Label>Aprovado por</Label>
                      <p className="font-medium">{selectedExpense.approvedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedExpense(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
