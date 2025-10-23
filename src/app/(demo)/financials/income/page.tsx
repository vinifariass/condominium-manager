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
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Download,
  Building2,
  Users,
  Car,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from "lucide-react";

export default function IncomePage() {
  // Dados das receitas
  const incomes = [
    {
      id: 1,
      type: "Taxa Condominial",
      description: "Taxa condominial - Apartamento 101",
      apartmentNumber: "101",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      amount: 850.00,
      dueDate: "2024-12-15",
      paymentDate: "2024-12-14",
      status: "Pago",
      paymentMethod: "PIX",
      ownerName: "Maria Silva Santos",
      category: "Taxa Condominial",
      reference: "Dezembro/2024"
    },
    {
      id: 2,
      type: "Taxa Condominial",
      description: "Taxa condominial - Apartamento 202",
      apartmentNumber: "202",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      amount: 650.00,
      dueDate: "2024-12-15",
      paymentDate: null,
      status: "Pendente",
      paymentMethod: null,
      ownerName: "João Pereira Costa",
      category: "Taxa Condominial",
      reference: "Dezembro/2024"
    },
    {
      id: 3,
      type: "Taxa de Estacionamento",
      description: "Taxa adicional de estacionamento - Vaga extra",
      apartmentNumber: "301",
      block: "B",
      condominium: "Condomínio Griffe",
      amount: 150.00,
      dueDate: "2024-12-15",
      paymentDate: "2024-12-13",
      status: "Pago",
      paymentMethod: "Cartão de Crédito",
      ownerName: "Ana Carolina Mendes",
      category: "Estacionamento",
      reference: "Dezembro/2024"
    },
    {
      id: 4,
      type: "Multa",
      description: "Multa por barulho excessivo",
      apartmentNumber: "105",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      amount: 200.00,
      dueDate: "2024-12-20",
      paymentDate: null,
      status: "Em Atraso",
      paymentMethod: null,
      ownerName: "Carlos Silva Oliveira",
      category: "Multa",
      reference: "Novembro/2024"
    },
    {
      id: 5,
      type: "Taxa de Área Comum",
      description: "Reserva de salão de festas",
      apartmentNumber: "403",
      block: "B",
      condominium: "Condomínio Griffe",
      amount: 300.00,
      dueDate: "2024-12-10",
      paymentDate: "2024-12-08",
      status: "Pago",
      paymentMethod: "Transferência Bancária",
      ownerName: "Patricia Almeida Santos",
      category: "Área Comum",
      reference: "Dezembro/2024"
    }
  ];

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filtros
  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => {
      const searchMatch = searchTerm === "" || 
        income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.type.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "all" || income.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || income.category === categoryFilter;

      return searchMatch && statusMatch && categoryMatch;
    });
  }, [incomes, searchTerm, statusFilter, categoryFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: filteredIncomes.reduce((sum, income) => sum + income.amount, 0),
      paid: filteredIncomes.filter(income => income.status === "Pago").reduce((sum, income) => sum + income.amount, 0),
      pending: filteredIncomes.filter(income => income.status === "Pendente").reduce((sum, income) => sum + income.amount, 0),
      overdue: filteredIncomes.filter(income => income.status === "Em Atraso").reduce((sum, income) => sum + income.amount, 0),
      count: filteredIncomes.length
    };
  }, [filteredIncomes]);

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
      case "Taxa Condominial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Estacionamento":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Multa":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "Área Comum":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300";
    }
  };

  // Exportação CSV
  const exportToCSV = () => {
    const csvData = filteredIncomes.map(income => ({
      "Tipo": income.type,
      "Descrição": income.description,
      "Apartamento": income.apartmentNumber,
      "Bloco": income.block,
      "Proprietário": income.ownerName,
      "Valor": income.amount,
      "Vencimento": income.dueDate,
      "Pagamento": income.paymentDate || "Não pago",
      "Status": income.status,
      "Forma de Pagamento": income.paymentMethod || "N/A",
      "Categoria": income.category,
      "Referência": income.reference
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receitas.csv";
    a.click();
  };

  return (
    <ContentLayout title="Receitas">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.count} lançamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valores Recebidos</CardTitle>
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
                  placeholder="Buscar receitas..."
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
                  <SelectItem value="Taxa Condominial">Taxa Condominial</SelectItem>
                  <SelectItem value="Estacionamento">Estacionamento</SelectItem>
                  <SelectItem value="Multa">Multa</SelectItem>
                  <SelectItem value="Área Comum">Área Comum</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Receita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Receita</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova receita ao sistema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Tipo de Receita</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="taxa">Taxa Condominial</SelectItem>
                            <SelectItem value="estacionamento">Estacionamento</SelectItem>
                            <SelectItem value="multa">Multa</SelectItem>
                            <SelectItem value="area">Área Comum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="apartment">Apartamento</Label>
                        <Input id="apartment" placeholder="Ex: 101" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input id="description" placeholder="Descrição da receita" />
                      </div>
                      <div>
                        <Label htmlFor="amount">Valor</Label>
                        <Input id="amount" type="number" placeholder="0,00" />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Data de Vencimento</Label>
                        <Input id="dueDate" type="date" />
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

        {/* Lista de Receitas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Receitas</CardTitle>
            <CardDescription>
              {filteredIncomes.length} receita(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredIncomes.map((income) => (
                <div
                  key={income.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            Apt. {income.apartmentNumber} - Bloco {income.block}
                          </span>
                        </div>
                        <Badge className={getStatusColor(income.status)}>
                          {income.status}
                        </Badge>
                        <Badge className={getCategoryColor(income.category)}>
                          {income.category}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Descrição:</p>
                          <p className="font-medium">{income.description}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Proprietário:</p>
                          <p className="font-medium">{income.ownerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valor:</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(income.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vencimento:</p>
                          <p className="font-medium">
                            {new Date(income.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pagamento:</p>
                          <p className="font-medium">
                            {income.paymentDate 
                              ? new Date(income.paymentDate).toLocaleDateString('pt-BR')
                              : "Não pago"
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Forma de Pagamento:</p>
                          <p className="font-medium">{income.paymentMethod || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIncome(income)}
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

              {filteredIncomes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma receita encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={!!selectedIncome} onOpenChange={() => setSelectedIncome(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Receita</DialogTitle>
            </DialogHeader>
            {selectedIncome && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Apartamento</Label>
                    <p className="font-medium">
                      {selectedIncome.apartmentNumber} - Bloco {selectedIncome.block}
                    </p>
                  </div>
                  <div>
                    <Label>Condomínio</Label>
                    <p className="font-medium">{selectedIncome.condominium}</p>
                  </div>
                  <div>
                    <Label>Proprietário</Label>
                    <p className="font-medium">{selectedIncome.ownerName}</p>
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedIncome.amount)}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedIncome.status)}>
                      {selectedIncome.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Badge className={getCategoryColor(selectedIncome.category)}>
                      {selectedIncome.category}
                    </Badge>
                  </div>
                  <div>
                    <Label>Data de Vencimento</Label>
                    <p className="font-medium">
                      {new Date(selectedIncome.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label>Data de Pagamento</Label>
                    <p className="font-medium">
                      {selectedIncome.paymentDate 
                        ? new Date(selectedIncome.paymentDate).toLocaleDateString('pt-BR')
                        : "Não pago"
                      }
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Descrição</Label>
                    <p className="font-medium">{selectedIncome.description}</p>
                  </div>
                  <div>
                    <Label>Forma de Pagamento</Label>
                    <p className="font-medium">{selectedIncome.paymentMethod || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Referência</Label>
                    <p className="font-medium">{selectedIncome.reference}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedIncome(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
