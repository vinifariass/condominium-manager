import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar
} from "lucide-react";

export default function ReservasPage() {
  // Mock data - em produção viria de uma API
  const reservations = [
    {
      id: 1,
      amenity: "Salão de Festas",
      location: "Térreo - Bloco A",
      date: "2025-07-15",
      startTime: "19:00",
      endTime: "23:00",
      status: "Confirmada",
      resident: "Maria Silva",
      apartment: "101",
      phone: "(11) 99999-9999",
      guests: 25,
      notes: "Aniversário de 50 anos",
      price: 150.00,
      createdAt: "2025-07-10"
    },
    {
      id: 2,
      amenity: "Churrasqueira",
      location: "Área de Lazer",
      date: "2025-07-16",
      startTime: "12:00",
      endTime: "18:00",
      status: "Pendente",
      resident: "João Santos",
      apartment: "201",
      phone: "(11) 88888-8888",
      guests: 15,
      notes: "Almoço em família",
      price: 80.00,
      createdAt: "2025-07-11"
    },
    {
      id: 3,
      amenity: "Quadra de Tênis",
      location: "Área Esportiva",
      date: "2025-07-17",
      startTime: "08:00",
      endTime: "10:00",
      status: "Confirmada",
      resident: "Ana Costa",
      apartment: "301",
      phone: "(11) 77777-7777",
      guests: 4,
      notes: "Treino semanal",
      price: 50.00,
      createdAt: "2025-07-09"
    },
    {
      id: 4,
      amenity: "Piscina",
      location: "Área de Lazer",
      date: "2025-07-18",
      startTime: "14:00",
      endTime: "17:00",
      status: "Cancelada",
      resident: "Pedro Oliveira",
      apartment: "102",
      phone: "(11) 66666-6666",
      guests: 8,
      notes: "Festa infantil",
      price: 100.00,
      createdAt: "2025-07-08"
    },
    {
      id: 5,
      amenity: "Salão de Festas",
      location: "Térreo - Bloco A",
      date: "2025-07-20",
      startTime: "20:00",
      endTime: "02:00",
      status: "Pendente",
      resident: "Carla Mendes",
      apartment: "205",
      phone: "(11) 55555-5555",
      guests: 40,
      notes: "Casamento civil",
      price: 200.00,
      createdAt: "2025-07-12"
    }
  ];

  const amenities = [
    { name: "Salão de Festas", count: 2 },
    { name: "Churrasqueira", count: 1 },
    { name: "Quadra de Tênis", count: 1 },
    { name: "Piscina", count: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmada':
        return CheckCircle;
      case 'pendente':
        return Clock;
      case 'cancelada':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <ContentLayout title="Reservas">
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations.filter(r => r.status === 'Confirmada').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservations.filter(r => r.status === 'Pendente').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {reservations.reduce((sum, r) => sum + r.price, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Espaços */}
        <Card>
          <CardHeader>
            <CardTitle>Espaços Disponíveis</CardTitle>
            <CardDescription>
              Áreas comuns disponíveis para reserva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium">{amenity.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {amenity.count} reserva{amenity.count > 1 ? 's' : ''} este mês
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Reservas */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <CardTitle>Gerenciar Reservas</CardTitle>
                <CardDescription>
                  Lista de todas as reservas do condomínio
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Reserva
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => {
                const StatusIcon = getStatusIcon(reservation.status);
                return (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <CalendarCheck className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold">
                                {reservation.amenity}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(reservation.status)}`}>
                                <StatusIcon className="h-3 w-3 inline mr-1" />
                                {reservation.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{reservation.location}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{reservation.startTime} - {reservation.endTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{reservation.resident} - Apt {reservation.apartment}</span>
                              </div>
                              <span>•</span>
                              <span>{reservation.guests} convidados</span>
                              <span>•</span>
                              <span>R$ {reservation.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Observações: </span>
                            {reservation.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
