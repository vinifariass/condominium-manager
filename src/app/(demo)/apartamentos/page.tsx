import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Key, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Building2,
  Car,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function ApartmentsPage() {
  // Dados simulados baseados nos condomínios reais - substituir por dados reais da API
  const apartments = [
    {
      id: 1,
      number: "1306",
      block: "Principal",
      floor: 13,
      type: "Residencial",
      area: 120.0,
      bedrooms: 3,
      bathrooms: 2,
      owner: "Carlos Santos",
      status: "Ocupado",
      phone: "(21) 99147-9705",
      email: "carlos@email.com",
      condominium: "Santos Dumont",
      address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá"
    },
    {
      id: 2,
      number: "160",
      block: "Principal", 
      floor: 3,
      type: "Residencial",
      area: 95.0,
      bedrooms: 2,
      bathrooms: 2,
      owner: "Ana Paula Griffe",
      status: "Ocupado",
      phone: "(21) 98765-4321",
      email: "ana@email.com",
      condominium: "Griffe",
      address: "Rua da Passagem, 160 - Botafogo"
    },
    {
      id: 3,
      number: "142",
      block: "Principal",
      floor: 8,
      type: "Residencial", 
      area: 110.0,
      bedrooms: 3,
      bathrooms: 2,
      owner: "Roberto Artagus",
      status: "Ocupado",
      phone: "(21) 97654-3210",
      email: "roberto@email.com",
      condominium: "Artagus",
      address: "Rua Santa Clara, 142 - Copacabana"
    },
    {
      id: 4,
      number: "122",
      block: "Principal",
      floor: 6,
      type: "Residencial",
      area: 130.0,
      bedrooms: 4,
      bathrooms: 3,
      owner: "Maria Cachoeira",
      status: "Ocupado",
      phone: "(21) 96543-2109",
      email: "maria@email.com",
      condominium: "Cachoeira Dourada",
      address: "Avenida Rainha Elizabeth, 122"
    },
    {
      id: 5,
      number: "85",
      block: "Principal",
      floor: 4,
      type: "Residencial",
      area: 88.0,
      bedrooms: 2,
      bathrooms: 1,
      owner: "João Recanto",
      status: "Ocupado", 
      phone: "(21) 95432-1098",
      email: "joao@email.com",
      condominium: "Recanto",
      address: "Rua Visconde de Silva, 85 - Humaitá"
    },
    {
      id: 6,
      number: "74",
      block: "Principal",
      floor: 5,
      type: "Residencial",
      area: 140.0,
      bedrooms: 3,
      bathrooms: 3,
      owner: "Fernanda Vivenda",
      status: "Ocupado",
      phone: "(21) 94321-0987",
      email: "fernanda@email.com",
      condominium: "Vivenda",
      address: "Avenida Afrânio de Melo Franco, 74 - Leblon"
    },
    {
      id: 7,
      number: "12",
      block: "Principal",
      floor: 2,
      type: "Residencial",
      area: 75.0,
      bedrooms: 2,
      bathrooms: 1,
      owner: "Pedro Ocaporan",
      status: "Ocupado",
      phone: "(21) 93210-9876",
      email: "pedro@email.com",
      condominium: "OCAPORAN",
      address: "Rua Rias da Rocha, 12 - Copacabana"
    },
    {
      id: 8,
      number: "266",
      block: "Principal",
      floor: 7,
      type: "Residencial",
      area: 98.0,
      bedrooms: 2,
      bathrooms: 2,
      owner: "Luiza Romeu",
      status: "Ocupado",
      phone: "(21) 92109-8765",
      email: "luiza@email.com",
      condominium: "Romeu",
      address: "Rua Cinco de Julho, 266 - Copacabana"
    },
    {
      id: 9,
      number: "392",
      block: "Principal",
      floor: 9,
      type: "Residencial",
      area: 125.0,
      bedrooms: 3,
      bathrooms: 2,
      owner: "Ricardo Albuquerque",
      status: "Ocupado",
      phone: "(21) 91098-7654",
      email: "ricardo@email.com",
      condominium: "Visconde Albuquerque",
      address: "Avenida Visconde de Albuquerque, 392 - Leblon"
    },
    {
      id: 10,
      number: "101",
      block: "Torre A",
      floor: 1,
      type: "Residencial",
      area: 85.0,
      bedrooms: 2,
      bathrooms: 1,
      owner: null,
      status: "Vago",
      phone: null,
      email: null,
      condominium: "Santos Dumont",
      address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ocupado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Vago":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Manutenção":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const stats = {
    total: apartments.length,
    occupied: apartments.filter(apt => apt.status === "Ocupado").length,
    vacant: apartments.filter(apt => apt.status === "Vago").length,
    maintenance: apartments.filter(apt => apt.status === "Manutenção").length
  };

  return (
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Em {apartments.filter((apt, index, self) => 
                  index === self.findIndex(a => a.condominium === apt.condominium)
                ).length} condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apartamentos Ocupados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupied}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.occupied / stats.total) * 100).toFixed(1)}% de ocupação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apartamentos Vagos</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vacant}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para locação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Área Total</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {apartments.reduce((total, apt) => total + apt.area, 0).toFixed(0)}m²
              </div>
              <p className="text-xs text-muted-foreground">
                Área construída total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Apartamento
          </Button>
        </div>

        {/* Lista de Apartamentos */}
        <div className="grid gap-4">
          {apartments.map((apartment) => (
            <Card key={apartment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Apt {apartment.number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apartment.status)}`}>
                          {apartment.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{apartment.condominium}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {apartment.address}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Proprietário</p>
                      <p className="text-sm text-muted-foreground">{apartment.owner || "Não definido"}</p>
                      {apartment.phone && (
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {apartment.phone}
                        </p>
                      )}
                      {apartment.email && (
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {apartment.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Detalhes</p>
                      <p className="text-sm text-muted-foreground">{apartment.area}m² - {apartment.floor}º andar</p>
                      <p className="text-sm text-muted-foreground">{apartment.bedrooms} quartos, {apartment.bathrooms} banheiros</p>
                      <p className="text-sm text-muted-foreground">{apartment.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Bloco</p>
                      <p className="text-sm text-muted-foreground">{apartment.block}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
