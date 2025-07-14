"use client";

import React, { useState } from "react";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarIcon,
  X,
  MessageSquare
} from "lucide-react";
import { notificationService } from "@/lib/notification-service";

// Componente Modal para nova reserva
const NewReservationModal = ({ 
  isOpen, 
  onClose, 
  selectedDate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedDate: Date | null; 
}) => {
  const [formData, setFormData] = useState({
    amenity: "",
    startTime: "",
    endTime: "",
    resident: "",
    apartment: "",
    block: "",
    notes: "",
    phone: ""
  });

  const amenities = [
    "Salão de Festas",
    "Churrasqueira", 
    "Quadra de Tênis",
    "Piscina",
    "Sala de Jogos",
    "Academia",
    "Playground"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aqui você implementaria a lógica para salvar a reserva no backend
      console.log("Nova reserva:", formData);
      
      // Enviar notificação de confirmação da reserva por WhatsApp/SMS
      if (formData.phone && formData.resident && formData.amenity) {
        const reservationDate = selectedDate?.toLocaleDateString('pt-BR') || '';
        
        await notificationService.sendNotification({
          template: {
            id: 'reservation_confirmation',
            name: 'Confirmação de Reserva',
            sms: `Reserva confirmada! ${formData.amenity} em ${reservationDate} das ${formData.startTime} às ${formData.endTime}.`,
            whatsapp: `✅ *Reserva Confirmada*\n\n📍 Área: ${formData.amenity}\n📅 Data: ${reservationDate}\n🕐 Horário: ${formData.startTime} às ${formData.endTime}\n\nLembre-se de seguir as regras de uso!\n\nCondomínio`,
            variables: ['area', 'date', 'start_time', 'end_time']
          },
          recipients: [{
            name: formData.resident,
            phone: formData.phone,
            apartment: formData.apartment,
            preferredMethod: 'whatsapp'
          }],
          variables: {
            area: formData.amenity,
            date: reservationDate,
            start_time: formData.startTime,
            end_time: formData.endTime
          },
          priority: 'medium'
        });
        
        console.log("Notificação de confirmação enviada!");
      }
      
      onClose();
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Nova Reserva</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Data</label>
            <input
              type="text"
              value={selectedDate?.toLocaleDateString('pt-BR') || ""}
              readOnly
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-muted"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Área Comum</label>
            <select
              value={formData.amenity}
              onChange={(e) => setFormData({...formData, amenity: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            >
              <option value="">Selecione uma área</option>
              {amenities.map(amenity => (
                <option key={amenity} value={amenity}>{amenity}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Hora Início</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hora Fim</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Nome do Morador</label>
            <input
              type="text"
              value={formData.resident}
              onChange={(e) => setFormData({...formData, resident: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Apartamento</label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({...formData, apartment: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bloco</label>
              <input
                type="text"
                value={formData.block}
                onChange={(e) => setFormData({...formData, block: e.target.value})}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ReservationsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // Dados simulados - substituir por dados reais da API
  const reservations = [
    {
      id: 1,
      amenity: "Salão de Festas",
      date: "2025-07-15",
      startTime: "19:00",
      endTime: "23:00",
      resident: "Maria Silva",
      apartment: "101",
      block: "A",
      status: "Confirmada",
      price: 150.00,
      notes: "Festa de aniversário - 50 pessoas",
      createdAt: "2025-07-10",
      phone: "(11) 99999-9999"
    },
    {
      id: 2,
      amenity: "Quadra de Tênis",
      date: "2025-07-16",
      startTime: "08:00", 
      endTime: "10:00",
      resident: "João Santos",
      apartment: "201",
      block: "A",
      status: "Pendente",
      price: 0,
      notes: "Aula particular",
      createdAt: "2025-07-14",
      phone: "(11) 88888-8888"
    },
    {
      id: 3,
      amenity: "Churrasqueira",
      date: "2025-07-20",
      startTime: "12:00",
      endTime: "18:00", 
      resident: "Ana Costa",
      apartment: "302",
      block: "B",
      status: "Confirmada",
      price: 80.00,
      notes: "Almoço em família",
      createdAt: "2025-07-12",
      phone: "(11) 77777-7777"
    },
    {
      id: 4,
      amenity: "Piscina",
      date: "2025-07-18",
      startTime: "14:00",
      endTime: "17:00",
      resident: "Carlos Santos", 
      apartment: "105",
      block: "A",
      status: "Cancelada",
      price: 0,
      notes: "Festa infantil - cancelada por motivos pessoais",
      createdAt: "2025-07-08",
      phone: "(11) 66666-6666"
    },
    {
      id: 5,
      amenity: "Sala de Jogos",
      date: "2025-07-22",
      startTime: "20:00",
      endTime: "22:00",
      resident: "Julia Oliveira",
      apartment: "203",
      block: "A", 
      status: "Confirmada",
      price: 50.00,
      notes: "Noite de jogos com amigos",
      createdAt: "2025-07-15",
      phone: "(11) 55555-5555"
    },
    {
      id: 6,
      amenity: "Salão de Festas",
      date: "2025-07-25",
      startTime: "15:00",
      endTime: "18:00",
      resident: "Pedro Silva",
      apartment: "204",
      block: "B",
      status: "Confirmada",
      price: 150.00,
      notes: "Festa de formatura",
      createdAt: "2025-07-12",
      phone: "(11) 44444-4444"
    }
  ];

  // Funções auxiliares para o calendário
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getReservationsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return reservations.filter(r => r.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "text-green-600 bg-green-100";
      case "Pendente":
        return "text-yellow-600 bg-yellow-100";
      case "Cancelada":
        return "text-red-600 bg-red-100";
      case "Concluída":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmada":
        return <CheckCircle className="h-3 w-3" />;
      case "Pendente":
        return <AlertCircle className="h-3 w-3" />;
      case "Cancelada":
        return <XCircle className="h-3 w-3" />;
      case "Concluída":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: React.ReactNode[] = [];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Cabeçalho dos dias da semana
    const weekHeader = weekDays.map(day => (
      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
        {day}
      </div>
    ));

    // Dias vazios no início do mês
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 border-b border-r min-h-[100px] bg-muted/20"></div>
      );
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayReservations = getReservationsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

      days.push(
        <div 
          key={day}
          className={`p-2 border-b border-r min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors ${
            isSelected ? 'bg-primary/10' : ''
          }`}
          onClick={() => handleDayClick(date)}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center' : ''
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayReservations.slice(0, 2).map((reservation) => (
              <div 
                key={reservation.id}
                className={`text-xs p-1 rounded truncate ${getStatusColor(reservation.status)}`}
                title={`${reservation.amenity} - ${reservation.resident} (${reservation.startTime})`}
              >
                {reservation.amenity}
              </div>
            ))}
            {dayReservations.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayReservations.length - 2} mais
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 border-l border-t">
        {weekHeader}
        {days}
      </div>
    );
  };

  const confirmedReservations = reservations.filter(r => r.status === "Confirmada");
  const pendingReservations = reservations.filter(r => r.status === "Pendente");
  const totalRevenue = reservations
    .filter(r => r.status === "Confirmada")
    .reduce((sum, r) => sum + r.price, 0);

  // Agrupar reservas por data
  const groupedReservations = reservations.reduce((groups, reservation) => {
    const date = reservation.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reservation);
    return groups;
  }, {} as Record<string, typeof reservations>);

  // Reservas da data selecionada
  const selectedDateReservations = selectedDate ? getReservationsForDate(selectedDate) : [];

  return (
    <AdminPanelLayout>
      <ContentLayout title="Calendário de Reservas">
        <div className="space-y-6">
          {/* Header com Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reservations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{confirmedReservations.length}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((confirmedReservations.length / reservations.length) * 100)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando aprovação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Calendário */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendário de Reservas</CardTitle>
                  <CardDescription>
                    Visualize todas as reservas em formato de calendário
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={view === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('calendar')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendário
                  </Button>
                  <Button
                    variant={view === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setView('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Reserva
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'calendar' ? (
                <div className="space-y-4">
                  {/* Navegação do calendário */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                      {currentDate.toLocaleDateString('pt-BR', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Calendário */}
                  <div className="border rounded-lg overflow-hidden">
                    {renderCalendar()}
                  </div>

                  {/* Legenda */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded bg-green-100"></div>
                      <span>Confirmada</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded bg-yellow-100"></div>
                      <span>Pendente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded bg-red-100"></div>
                      <span>Cancelada</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Vista em lista
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar por área, morador ou data..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </div>

                  {/* Lista de Reservas por Data */}
                  <div className="space-y-6">
                    {Object.entries(groupedReservations)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .map(([date, dateReservations]) => (
                      <div key={date} className="space-y-4">
                        <div className="flex items-center space-x-2 border-b pb-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">
                            {new Date(date).toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h3>
                        </div>
                        
                        {dateReservations.map((reservation) => (
                          <div key={reservation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                                  <MapPin className="h-5 w-5" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold">{reservation.amenity}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                                      {getStatusIcon(reservation.status)}
                                      <span>{reservation.status}</span>
                                    </span>
                                    {reservation.price > 0 && (
                                      <span className="text-sm font-medium text-green-600">
                                        R$ {reservation.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{reservation.startTime} - {reservation.endTime}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{reservation.resident}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>Apt {reservation.apartment} - Bloco {reservation.block}</span>
                                    </div>
                                  </div>
                                  
                                  {reservation.notes && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                      <span className="font-medium">Observações:</span> {reservation.notes}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {reservation.status === "Pendente" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950 dark:hover:text-green-300"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Aprovar
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Rejeitar
                                    </Button>
                                  </>
                                )}
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalhes da data selecionada */}
          {selectedDate && selectedDateReservations.length > 0 && view === 'calendar' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Reservas para {selectedDate.toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDateReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold">{reservation.amenity}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(reservation.status)}`}>
                                {getStatusIcon(reservation.status)}
                                <span>{reservation.status}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <span>{reservation.startTime} - {reservation.endTime}</span>
                              <span>{reservation.resident} - Apt {reservation.apartment}</span>
                              {reservation.price > 0 && (
                                <span className="text-green-600 font-medium">R$ {reservation.price.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ContentLayout>
      
      {/* Modal para nova reserva */}
      <NewReservationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />
    </AdminPanelLayout>
  );
}
