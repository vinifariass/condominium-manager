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
  CreditCard, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Download,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calculator,
  DollarSign,
  BarChart3
} from "lucide-react";

export default function FeesPage() {
  // Dados das taxas condominiais
  const fees = [
    {
      id: 1,
      apartmentNumber: "101",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      ownerName: "Maria Silva Santos",
      ownerPhone: "(21) 98765-4321",
      ownerEmail: "maria.silva@email.com",
      apartmentType: "Padrão",
      area: 85.5,
      baseAmount: 650.00,
      waterAmount: 45.00,
      elevatorAmount: 80.00,
      maintenanceAmount: 75.00,
      totalAmount: 850.00,
      dueDate: "2024-12-15",
      paymentDate: "2024-12-14",
      status: "Pago",
      paymentMethod: "PIX",
      reference: "Dezembro/2024",
      discount: 0,
      interest: 0,
      fine: 0
    },
    {
      id: 2,
      apartmentNumber: "202",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      ownerName: "João Pereira Costa",
      ownerPhone: "(21) 97654-3210",
      ownerEmail: "joao.costa@email.com",
      apartmentType: "Compacto",
      area: 65.0,
      baseAmount: 500.00,
      waterAmount: 35.00,
      elevatorAmount: 65.00,
      maintenanceAmount: 50.00,
      totalAmount: 650.00,
      dueDate: "2024-12-15",
      paymentDate: null,
      status: "Pendente",
      paymentMethod: null,
      reference: "Dezembro/2024",
      discount: 0,
      interest: 0,
      fine: 0
    },
    {
      id: 3,
      apartmentNumber: "301",
      block: "B",
      condominium: "Condomínio Griffe",
      ownerName: "Ana Carolina Mendes",
      ownerPhone: "(21) 99887-6543",
      ownerEmail: "ana.mendes@email.com",
      apartmentType: "Premium",
      area: 120.0,
      baseAmount: 850.00,
      waterAmount: 65.00,
      elevatorAmount: 120.00,
      maintenanceAmount: 165.00,
      totalAmount: 1200.00,
      dueDate: "2024-12-15",
      paymentDate: "2024-12-13",
      status: "Pago",
      paymentMethod: "Cartão de Crédito",
      reference: "Dezembro/2024",
      discount: 50.00,
      interest: 0,
      fine: 0
    },
    {
      id: 4,
      apartmentNumber: "105",
      block: "A",
      condominium: "Condomínio Santos Dumont",
      ownerName: "Carlos Silva Oliveira",
      ownerPhone: "(21) 96543-2109",
      ownerEmail: "carlos.silva@email.com",
      apartmentType: "Padrão",
      area: 85.5,
      baseAmount: 650.00,
      waterAmount: 48.00,
      elevatorAmount: 80.00,
      maintenanceAmount: 75.00,
      totalAmount: 883.30,
      dueDate: "2024-11-15",
      paymentDate: null,
      status: "Em Atraso",
      paymentMethod: null,
      reference: "Novembro/2024",
      discount: 0,
      interest: 15.50,
      fine: 25.80
    },
    {
      id: 5,
      apartmentNumber: "403",
      block: "B",
      condominium: "Condomínio Griffe",
      ownerName: "Patricia Almeida Santos",
      ownerPhone: "(21) 95432-1098",
      ownerEmail: "patricia.almeida@email.com",
      apartmentType: "Premium",
      area: 120.0,
      baseAmount: 850.00,
      waterAmount: 62.00,
      elevatorAmount: 120.00,
      maintenanceAmount: 165.00,
      totalAmount: 1197.00,
      dueDate: "2024-12-15",
      paymentDate: "2024-12-10",
      status: "Pago",
      paymentMethod: "Transferência Bancária",
      reference: "Dezembro/2024",
      discount: 0,
      interest: 0,
      fine: 0
    }
  ];

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [condominiumFilter, setCondominiumFilter] = useState("all");
  const [apartmentTypeFilter, setApartmentTypeFilter] = useState("all");
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);

  // Filtros
  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      const searchMatch = searchTerm === "" || 
        fee.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.condominium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.apartmentType.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "all" || fee.status === statusFilter;
      const condominiumMatch = condominiumFilter === "all" || fee.condominium === condominiumFilter;
      const typeMatch = apartmentTypeFilter === "all" || fee.apartmentType === apartmentTypeFilter;

      return searchMatch && statusMatch && condominiumMatch && typeMatch;
    });
  }, [fees, searchTerm, statusFilter, condominiumFilter, apartmentTypeFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: filteredFees.reduce((sum, fee) => sum + fee.totalAmount, 0),
      paid: filteredFees.filter(fee => fee.status === "Pago").reduce((sum, fee) => sum + fee.totalAmount, 0),
      pending: filteredFees.filter(fee => fee.status === "Pendente").reduce((sum, fee) => sum + fee.totalAmount, 0),
      overdue: filteredFees.filter(fee => fee.status === "Em Atraso").reduce((sum, fee) => sum + fee.totalAmount, 0),
      count: filteredFees.length,
      baseAmount: filteredFees.reduce((sum, fee) => sum + fee.baseAmount, 0),
      waterAmount: filteredFees.reduce((sum, fee) => sum + fee.waterAmount, 0),
      maintenanceAmount: filteredFees.reduce((sum, fee) => sum + fee.maintenanceAmount, 0),
      elevatorAmount: filteredFees.reduce((sum, fee) => sum + fee.elevatorAmount, 0)
    };
  }, [filteredFees]);

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

  // Função para cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Padrão":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Compacto":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300";
    }
  };

  // Exportação CSV
  const exportToCSV = () => {
    const csvData = filteredFees.map(fee => ({
      "Apartamento": fee.apartmentNumber,
      "Bloco": fee.block,
      "Condomínio": fee.condominium,
      "Proprietário": fee.ownerName,
      "Tipo": fee.apartmentType,
      "Área (m²)": fee.area,
      "Taxa Base": fee.baseAmount,
      "Água": fee.waterAmount,
      "Elevador": fee.elevatorAmount,
      "Manutenção": fee.maintenanceAmount,
      "Total": fee.totalAmount,
      "Vencimento": fee.dueDate,
      "Pagamento": fee.paymentDate || "Não pago",
      "Status": fee.status,
      "Referência": fee.reference
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taxas-condominiais.csv";
    a.click();
  };

  return (
    <ContentLayout title="Taxas Condominiais">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(stats.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.count} apartamentos
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

        {/* Detalhamento das Taxas */}
        <Card>
          <CardHeader>
            <CardTitle>Composição das Taxas</CardTitle>
            <CardDescription>Detalhamento dos valores por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Taxa Base</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(stats.baseAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Água</p>
                <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">
                  {formatCurrency(stats.waterAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Elevador</p>
                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  {formatCurrency(stats.elevatorAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Manutenção</p>
                <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(stats.maintenanceAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar taxas..."
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

              <Select value={condominiumFilter} onValueChange={setCondominiumFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Condomínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Condomínios</SelectItem>
                  <SelectItem value="Condomínio Santos Dumont">Santos Dumont</SelectItem>
                  <SelectItem value="Condomínio Griffe">Griffe</SelectItem>
                </SelectContent>
              </Select>

              <Select value={apartmentTypeFilter} onValueChange={setApartmentTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Padrão">Padrão</SelectItem>
                  <SelectItem value="Compacto">Compacto</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Dialog open={showCalculatorDialog} onOpenChange={setShowCalculatorDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calcular
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Calculadora de Taxa Condominial</DialogTitle>
                      <DialogDescription>
                        Calcule a taxa condominial com base na área e tipo do apartamento
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="calc-area">Área (m²)</Label>
                        <Input id="calc-area" type="number" placeholder="85.5" />
                      </div>
                      <div>
                        <Label htmlFor="calc-type">Tipo do Apartamento</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compacto">Compacto</SelectItem>
                            <SelectItem value="padrao">Padrão</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="calc-water">Consumo de Água (m³)</Label>
                        <Input id="calc-water" type="number" placeholder="15" />
                      </div>
                      <div>
                        <Label htmlFor="calc-elevator">Usa Elevador?</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sim/Não" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Resultado do Cálculo:</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Taxa Base:</span>
                            <span className="font-medium">R$ 650,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Água:</span>
                            <span className="font-medium">R$ 45,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Elevador:</span>
                            <span className="font-medium">R$ 80,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manutenção:</span>
                            <span className="font-medium">R$ 75,00</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total:</span>
                            <span className="text-blue-600 dark:text-blue-400">R$ 850,00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCalculatorDialog(false)}>
                        Fechar
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

        {/* Lista de Taxas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Taxas Condominiais</CardTitle>
            <CardDescription>
              {filteredFees.length} taxa(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFees.map((fee) => (
                <div
                  key={fee.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            Apt. {fee.apartmentNumber} - Bloco {fee.block}
                          </span>
                        </div>
                        <Badge className={getStatusColor(fee.status)}>
                          {fee.status}
                        </Badge>
                        <Badge className={getTypeColor(fee.apartmentType)}>
                          {fee.apartmentType}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Proprietário:</p>
                          <p className="font-medium">{fee.ownerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Área:</p>
                          <p className="font-medium">{fee.area} m²</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Valor Total:</p>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(fee.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vencimento:</p>
                          <p className="font-medium">
                            {new Date(fee.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          Base: {formatCurrency(fee.baseAmount)}
                        </span>
                        <span className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded">
                          Água: {formatCurrency(fee.waterAmount)}
                        </span>
                        <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          Elevador: {formatCurrency(fee.elevatorAmount)}
                        </span>
                        <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                          Manutenção: {formatCurrency(fee.maintenanceAmount)}
                        </span>
                        {fee.discount > 0 && (
                          <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                            Desconto: -{formatCurrency(fee.discount)}
                          </span>
                        )}
                        {fee.interest > 0 && (
                          <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                            Juros: +{formatCurrency(fee.interest)}
                          </span>
                        )}
                        {fee.fine > 0 && (
                          <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                            Multa: +{formatCurrency(fee.fine)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFee(fee)}
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

              {filteredFees.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma taxa encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        <Dialog open={!!selectedFee} onOpenChange={() => setSelectedFee(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Taxa Condominial</DialogTitle>
            </DialogHeader>
            {selectedFee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Apartamento</Label>
                    <p className="font-medium">
                      {selectedFee.apartmentNumber} - Bloco {selectedFee.block}
                    </p>
                  </div>
                  <div>
                    <Label>Condomínio</Label>
                    <p className="font-medium">{selectedFee.condominium}</p>
                  </div>
                  <div>
                    <Label>Proprietário</Label>
                    <p className="font-medium">{selectedFee.ownerName}</p>
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Badge className={getTypeColor(selectedFee.apartmentType)}>
                      {selectedFee.apartmentType}
                    </Badge>
                  </div>
                  <div>
                    <Label>Área</Label>
                    <p className="font-medium">{selectedFee.area} m²</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedFee.status)}>
                      {selectedFee.status}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Composição da Taxa</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Taxa Base:</span>
                      <span className="font-medium">{formatCurrency(selectedFee.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Água:</span>
                      <span className="font-medium">{formatCurrency(selectedFee.waterAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elevador:</span>
                      <span className="font-medium">{formatCurrency(selectedFee.elevatorAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manutenção:</span>
                      <span className="font-medium">{formatCurrency(selectedFee.maintenanceAmount)}</span>
                    </div>
                    {selectedFee.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span className="font-medium">-{formatCurrency(selectedFee.discount)}</span>
                      </div>
                    )}
                    {selectedFee.interest > 0 && (
                      <div className="flex justify-between text-yellow-600">
                        <span>Juros:</span>
                        <span className="font-medium">+{formatCurrency(selectedFee.interest)}</span>
                      </div>
                    )}
                    {selectedFee.fine > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Multa:</span>
                        <span className="font-medium">+{formatCurrency(selectedFee.fine)}</span>
                      </div>
                    )}
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedFee.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Data de Vencimento</Label>
                      <p className="font-medium">
                        {new Date(selectedFee.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <Label>Data de Pagamento</Label>
                      <p className="font-medium">
                        {selectedFee.paymentDate 
                          ? new Date(selectedFee.paymentDate).toLocaleDateString('pt-BR')
                          : "Não pago"
                        }
                      </p>
                    </div>
                    <div>
                      <Label>Forma de Pagamento</Label>
                      <p className="font-medium">{selectedFee.paymentMethod || "N/A"}</p>
                    </div>
                    <div>
                      <Label>Referência</Label>
                      <p className="font-medium">{selectedFee.reference}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedFee(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
