import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Bed,
  Bath,
  Car,
  Users,
  Eye,
  Edit,
  MapPin,
  Calendar,
  TrendingUp,
  Home
} from "lucide-react";

export default function ApartmentsPage() {
  // Dados simulados de apartamentos baseados nos condomínios reais
  const apartments = [
    {
      id: 1,
      number: "101",
      block: "A",
      floor: 1,
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 85.5,
      status: "Ocupado",
      type: "Padrão",
      residents: 4,
      owner: "Maria Silva Santos",
      ownerPhone: "(21) 98765-4321",
      ownerEmail: "maria.silva@email.com",
      monthlyFee: 850.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento recém reformado"
    },
    {
      id: 2,
      number: "202",
      block: "A",
      floor: 2,
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 65.0,
      status: "Vago",
      type: "Compacto",
      residents: 0,
      owner: "João Pereira Costa",
      ownerPhone: "(21) 97654-3210",
      ownerEmail: "joao.costa@email.com",
      monthlyFee: 650.00,
      balanceDue: 1300.00,
      lastPayment: "2024-09-15",
      observations: "Disponível para locação"
    },
    {
      id: 3,
      number: "301",
      block: "B",
      floor: 3,
      condominium: "Condomínio Barra Garden",
      condominiumId: 2,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 120.0,
      status: "Ocupado",
      type: "Premium",
      residents: 3,
      owner: "Ana Carolina Mendes",
      ownerPhone: "(21) 99887-6543",
      ownerEmail: "ana.mendes@email.com",
      monthlyFee: 1200.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Cobertura com vista para o mar"
    },
    {
      id: 4,
      number: "102",
      block: "A",
      floor: 1,
      condominium: "Condomínio Praia Azul",
      condominiumId: 3,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 90.0,
      status: "Ocupado",
      type: "Padrão",
      residents: 2,
      owner: "Carlos Eduardo Silva",
      ownerPhone: "(21) 98876-5432",
      ownerEmail: "carlos.silva@email.com",
      monthlyFee: 950.00,
      balanceDue: 950.00,
      lastPayment: "2024-10-15",
      observations: "Apartamento com varanda gourmet"
    },
    {
      id: 5,
      number: "501",
      block: "C",
      floor: 5,
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      area: 95.0,
      status: "Ocupado",
      type: "Premium",
      residents: 5,
      owner: "Fernanda Oliveira Santos",
      ownerPhone: "(21) 97765-4321",
      ownerEmail: "fernanda.santos@email.com",
      monthlyFee: 1100.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento com 2 suítes"
    },
    {
      id: 6,
      number: "203",
      block: "B",
      floor: 2,
      condominium: "Condomínio Recanto",
      condominiumId: 5,
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 70.0,
      status: "Vago",
      type: "Compacto",
      residents: 0,
      owner: "Roberto Almeida Costa",
      ownerPhone: "(21) 96654-3210",
      ownerEmail: "roberto.costa@email.com",
      monthlyFee: 750.00,
      balanceDue: 2250.00,
      lastPayment: "2024-08-15",
      observations: "Necessita pequenos reparos"
    },
    {
      id: 7,
      number: "401",
      block: "A",
      floor: 4,
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 140.0,
      status: "Ocupado",
      type: "Luxo",
      residents: 4,
      owner: "Patricia Rodrigues Lima",
      ownerPhone: "(21) 99543-2109",
      ownerEmail: "patricia.lima@email.com",
      monthlyFee: 1500.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento duplex com terraço"
    },
    {
      id: 8,
      number: "304",
      block: "C",
      floor: 3,
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 88.0,
      status: "Ocupado",
      type: "Padrão",
      residents: 3,
      owner: "Marcos Antonio Silva",
      ownerPhone: "(21) 98432-1098",
      ownerEmail: "marcos.silva@email.com",
      monthlyFee: 870.00,
      balanceDue: 0,
      lastPayment: "2024-11-15",
      observations: "Apartamento bem conservado"
    }
  ];

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ocupado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Vago":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Manutenção":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Função para obter cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Luxo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Premium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Padrão":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Compacto":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Função para formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Estatísticas
  const totalApartments = apartments.length;
  const occupiedApartments = apartments.filter(apt => apt.status === "Ocupado").length;
  const vacantApartments = apartments.filter(apt => apt.status === "Vago").length;
  const occupancyRate = ((occupiedApartments / totalApartments) * 100).toFixed(1);
  const totalMonthlyFees = apartments.reduce((sum, apt) => sum + apt.monthlyFee, 0);
  const totalBalanceDue = apartments.reduce((sum, apt) => sum + apt.balanceDue, 0);

  return (
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApartments}</div>
              <p className="text-xs text-muted-foreground">
                Distribuídos em 6 condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {occupiedApartments} ocupados de {totalApartments}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalMonthlyFees)}</div>
              <p className="text-xs text-muted-foreground">
                Taxa condominial total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Devedor</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalanceDue)}</div>
              <p className="text-xs text-muted-foreground">
                {apartments.filter(apt => apt.balanceDue > 0).length} inadimplentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar apartamentos..."
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Apartamento
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Lista de Apartamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Apartamentos</CardTitle>
            <CardDescription>
              Todos os apartamentos cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors dark:border-border"
                >
                  <div className="flex-1 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-6 lg:gap-4">
                    {/* Informações Básicas */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Apto {apartment.number} - Bloco {apartment.block}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(apartment.status)}>
                              {apartment.status}
                            </Badge>
                            <Badge className={getTypeColor(apartment.type)}>
                              {apartment.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {apartment.condominium}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Características */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{apartment.bedrooms} quartos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{apartment.bathrooms}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{apartment.parkingSpaces} vaga(s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{apartment.area}m²</span>
                        </div>
                      </div>
                    </div>

                    {/* Proprietário */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Proprietário:</span>
                        <p className="text-muted-foreground truncate">{apartment.owner}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Moradores:</span> {apartment.residents}
                      </div>
                    </div>

                    {/* Financeiro */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Taxa:</span>
                        <p className="text-muted-foreground">{formatCurrency(apartment.monthlyFee)}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Saldo devedor:</span>
                        <p className={apartment.balanceDue > 0 ? "text-red-600" : "text-green-600"}>
                          {formatCurrency(apartment.balanceDue)}
                        </p>
                      </div>
                    </div>

                    {/* Último Pagamento */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Último pagamento:</span>
                        <p className="text-muted-foreground">
                          {new Date(apartment.lastPayment).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Andar:</span>
                        <p className="text-muted-foreground">{apartment.floor}º andar</p>
                      </div>
                    </div>

                    {/* Observações */}
                    <div className="lg:col-span-6 pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Observações:</span>
                        <p className="text-muted-foreground mt-1">{apartment.observations}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
