import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  CalendarDays
} from "lucide-react";

export default function ReservationsPage() {
  // Dados simulados - substituir por dados reais da API
  const reservations = [
    {
      id: 1,
      amenity: "Salão de Festas",
      date: "2024-01-15",
      startTime: "19:00",
      endTime: "23:00",
      resident: "Maria Silva",
      apartment: "101",
      block: "A",
      status: "Confirmada",
      price: 150.00,
      notes: "Festa de aniversário - 50 pessoas",
      createdAt: "2024-01-10",
      phone: "(11) 99999-9999"
    },
    {
      id: 2,
      amenity: "Quadra de Tênis",
      date: "2024-01-16",
      startTime: "08:00", 
      endTime: "10:00",
      resident: "João Santos",
      apartment: "201",
      block: "A",
      status: "Pendente",
      price: 0,
      notes: "Aula particular",
      createdAt: "2024-01-14",
      phone: "(11) 88888-8888"
    },
    {
      id: 3,
      amenity: "Churrasqueira",
      date: "2024-01-20",
      startTime: "12:00",
      endTime: "18:00", 
      resident: "Ana Costa",
      apartment: "302",
      block: "B",
      status: "Confirmada",
      price: 80.00,
      notes: "Almoço em família",
      createdAt: "2024-01-12",
      phone: "(11) 77777-7777"
    },
    {
      id: 4,
      amenity: "Piscina",
      date: "2024-01-18",
      startTime: "14:00",
      endTime: "17:00",
      resident: "Carlos Santos", 
      apartment: "105",
      block: "A",
      status: "Cancelada",
      price: 0,
      notes: "Festa infantil - cancelada por motivos pessoais",
      createdAt: "2024-01-08",
      phone: "(11) 66666-6666"
    },
    {
      id: 5,
      amenity: "Sala de Jogos",
      date: "2024-01-22",
      startTime: "20:00",
      endTime: "22:00",
      resident: "Julia Oliveira",
      apartment: "203",
      block: "A", 
      status: "Confirmada",
      price: 50.00,
      notes: "Noite de jogos com amigos",
      createdAt: "2024-01-15",
      phone: "(11) 55555-5555"
    }
  ];

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

  return (
    <ContentLayout title="Reservas">
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

        {/* Gerenciamento de Reservas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Reservas</CardTitle>
                <CardDescription>
                  Visualize e gerencie todas as reservas das áreas comuns
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Reserva
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                            
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span>Solicitado em: {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}</span>
                              {reservation.phone && (
                                <span className="ml-4">Contato: {reservation.phone}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {reservation.status === "Pendente" && (
                            <>
                              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
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
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
