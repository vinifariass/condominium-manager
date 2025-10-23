"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Home,
  Waves,
  Dumbbell,
  PartyPopper,
  Trophy,
  ChefHat
} from "lucide-react";

export default function ReservationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<"upcoming" | "today" | "past" | "all">("upcoming");

  const commonAreas = [
    {
      id: 1,
      name: "Salao de Festas",
      icon: PartyPopper,
      capacity: 80,
      available: true,
      bookingFee: 300,
      nextAvailable: "2024-02-15"
    },
    {
      id: 2,
      name: "Churrasqueira 1",
      icon: ChefHat,
      capacity: 20,
      available: true,
      bookingFee: 100,
      nextAvailable: "2024-02-10"
    },
    {
      id: 3,
      name: "Piscina",
      icon: Waves,
      capacity: 40,
      available: true,
      bookingFee: 0,
      nextAvailable: "Disponivel"
    },
    {
      id: 4,
      name: "Quadra Poliesportiva",
      icon: Trophy,
      capacity: 30,
      available: true,
      bookingFee: 50,
      nextAvailable: "2024-02-12"
    },
    {
      id: 5,
      name: "Academia",
      icon: Dumbbell,
      capacity: 15,
      available: true,
      bookingFee: 0,
      nextAvailable: "Disponivel"
    }
  ];

  const reservations = [
    {
      id: 1,
      areaName: "Salao de Festas",
      residentName: "Joao Silva",
      apartment: "101",
      block: "A",
      date: "2024-02-15",
      startTime: "18:00",
      endTime: "23:00",
      guests: 60,
      status: "Confirmada",
      paymentStatus: "Pago",
      amount: 300,
      observation: "Festa de aniversario",
      createdAt: "2024-01-20"
    },
    {
      id: 2,
      areaName: "Churrasqueira 1",
      residentName: "Maria Santos",
      apartment: "205",
      block: "B",
      date: "2024-02-10",
      startTime: "12:00",
      endTime: "18:00",
      guests: 15,
      status: "Confirmada",
      paymentStatus: "Pago",
      amount: 100,
      observation: "Almoco de familia",
      createdAt: "2024-01-18"
    },
    {
      id: 3,
      areaName: "Quadra Poliesportiva",
      residentName: "Carlos Souza",
      apartment: "102",
      block: "A",
      date: "2024-02-12",
      startTime: "09:00",
      endTime: "11:00",
      guests: 20,
      status: "Pendente",
      paymentStatus: "Pendente",
      amount: 50,
      observation: "Jogo de futebol entre amigos",
      createdAt: "2024-01-25"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelada":
        return "bg-red-100 text-red-800";
      case "Concluida":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Reembolsado":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmada":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Pendente":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "Cancelada":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Concluida":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const filteredReservations = reservations.filter(reservation => {
    if (selectedView === "all") return true;
    if (selectedView === "today") return reservation.date === today;
    if (selectedView === "upcoming") return reservation.date >= today && reservation.status !== "Concluida" && reservation.status !== "Cancelada";
    if (selectedView === "past") return reservation.status === "Concluida" || reservation.status === "Cancelada";
    return true;
  });

  const totalReservations = reservations.length;
  const upcomingReservations = reservations.filter(r => r.date >= today && r.status !== "Concluida" && r.status !== "Cancelada").length;
  const pendingPayment = reservations.filter(r => r.paymentStatus === "Pendente").length;
  const totalRevenue = reservations.filter(r => r.paymentStatus === "Pago").reduce((sum, r) => sum + r.amount, 0);

  return (
    <ContentLayout title="Reservas de Areas Comuns">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservations}</div>
              <p className="text-xs text-muted-foreground">Todas as reservas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proximas</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{upcomingReservations}</div>
              <p className="text-xs text-muted-foreground">Agendadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamento Pendente</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingPayment}</div>
              <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Receita com reservas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Areas Comuns Disponiveis</CardTitle>
            <CardDescription>Espacos disponiveis para reserva no condominio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {commonAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <Card key={area.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{area.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Capacidade: {area.capacity} pessoas</p>
                          <p className="text-sm font-medium text-green-600 mt-2">
                            {area.bookingFee > 0 ? `R$ ${area.bookingFee}` : "Gratuito"}
                          </p>
                          <Badge variant="outline" className="mt-2">{area.nextAvailable}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Reservas</CardTitle>
                <CardDescription>Visualize e gerencie todas as reservas do condominio</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Nova Reserva</DialogTitle>
                    <DialogDescription>Crie uma nova reserva de área comum</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="area">Área Comum *</Label>
                      <Input id="area" placeholder="Salão de Festas" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Data *</Label>
                        <Input id="date" type="date" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Horário *</Label>
                        <Input id="time" type="time" required />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={() => setDialogOpen(false)}>Criar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={selectedView === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("upcoming")}
              >
                Proximas ({upcomingReservations})
              </Button>
              <Button
                variant={selectedView === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("today")}
              >
                Hoje
              </Button>
              <Button
                variant={selectedView === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("past")}
              >
                Concluidas/Canceladas
              </Button>
              <Button
                variant={selectedView === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedView("all")}
              >
                Todas ({totalReservations})
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por morador, apartamento ou area..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className="space-y-4">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <Card key={reservation.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                            {getStatusIcon(reservation.status)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">{reservation.areaName}</h3>
                              <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                              <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>{reservation.paymentStatus}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{reservation.residentName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Home className="h-4 w-4" />
                                <span>Apt {reservation.apartment} - Bloco {reservation.block}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
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
                          <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <div className="text-sm font-medium">{new Date(reservation.date).toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-muted-foreground">Data</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <div className="text-sm font-medium">{reservation.startTime} - {reservation.endTime}</div>
                          <div className="text-xs text-muted-foreground">Horario</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <div className="text-sm font-medium">{reservation.guests}</div>
                          <div className="text-xs text-muted-foreground">Convidados</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm font-medium text-green-600">R$ {reservation.amount}</div>
                          <div className="text-xs text-muted-foreground">Valor</div>
                        </div>
                      </div>

                      {reservation.observation && (
                        <div className="pt-4 border-t">
                          <p className="text-sm"><span className="font-medium">Observacao:</span> {reservation.observation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                  <p className="text-muted-foreground">Nao ha reservas para o filtro selecionado.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
