import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  User,
  Building2,
  Phone,
  Mail,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function ResidentsPage() {
  // Dados simulados baseados nos condomínios reais - substituir por dados reais da API
  const residents = [
    {
      id: 1,
      name: "Carlos Santos",
      email: "carlos@email.com",
      phone: "(21) 99147-9705",
      cpf: "174.004.877-60",
      apartment: "1306",
      condominium: "Santos Dumont",
      address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá",
      type: "Proprietário",
      moveInDate: "2020-03-15",
      status: "Ativo",
      emergencyContact: "Ana Santos - (21) 98765-4321",
      vehicles: ["ABC-1234", "XYZ-5678"],
      dependents: 2
    },
    {
      id: 2,
      name: "Ana Paula Griffe",
      email: "ana@email.com",
      phone: "(21) 98765-4321",
      cpf: "123.456.789-10",
      apartment: "160",
      condominium: "Griffe",
      address: "Rua da Passagem, 160 - Botafogo",
      type: "Proprietária",
      moveInDate: "2019-08-22",
      status: "Ativo",
      emergencyContact: "Pedro Griffe - (21) 97654-3210",
      vehicles: ["DEF-9876"],
      dependents: 1
    },
    {
      id: 3,
      name: "Roberto Artagus",
      email: "roberto@email.com",
      phone: "(21) 97654-3210",
      cpf: "987.654.321-00",
      apartment: "142",
      condominium: "Artagus",
      address: "Rua Santa Clara, 142 - Copacabana",
      type: "Proprietário",
      moveInDate: "2021-11-10",
      status: "Ativo",
      emergencyContact: "Maria Artagus - (21) 96543-2109",
      vehicles: ["GHI-5432"],
      dependents: 3
    },
    {
      id: 4,
      name: "Maria Cachoeira",
      email: "maria@email.com",
      phone: "(21) 96543-2109",
      cpf: "456.789.123-45",
      apartment: "122",
      condominium: "Cachoeira Dourada",
      address: "Avenida Rainha Elizabeth, 122",
      type: "Proprietária",
      moveInDate: "2018-05-20",
      status: "Ativo",
      emergencyContact: "João Cachoeira - (21) 95432-1098",
      vehicles: ["JKL-1357"],
      dependents: 1
    },
    {
      id: 5,
      name: "João Recanto",
      email: "joao@email.com",
      phone: "(21) 95432-1098",
      cpf: "789.123.456-78",
      apartment: "85",
      condominium: "Recanto",
      address: "Rua Visconde de Silva, 85 - Humaitá",
      type: "Proprietário",
      moveInDate: "2022-01-15",
      status: "Ativo",
      emergencyContact: "Fernanda Recanto - (21) 94321-0987",
      vehicles: [],
      dependents: 0
    },
    {
      id: 6,
      name: "Fernanda Vivenda",
      email: "fernanda@email.com",
      phone: "(21) 94321-0987",
      cpf: "321.654.987-12",
      apartment: "74",
      condominium: "Vivenda",
      address: "Avenida Afrânio de Melo Franco, 74 - Leblon",
      type: "Proprietária",
      moveInDate: "2020-09-10",
      status: "Ativo",
      emergencyContact: "Pedro Vivenda - (21) 93210-9876",
      vehicles: ["MNO-2468"],
      dependents: 2
    },
    {
      id: 7,
      name: "Pedro Ocaporan",
      email: "pedro@email.com",
      phone: "(21) 93210-9876",
      cpf: "654.987.321-34",
      apartment: "12",
      condominium: "OCAPORAN",
      address: "Rua Rias da Rocha, 12 - Copacabana",
      type: "Proprietário",
      moveInDate: "2019-12-05",
      status: "Ativo",
      emergencyContact: "Luiza Ocaporan - (21) 92109-8765",
      vehicles: ["PQR-9753"],
      dependents: 1
    },
    {
      id: 8,
      name: "Luiza Romeu",
      email: "luiza@email.com",
      phone: "(21) 92109-8765",
      cpf: "147.258.369-56",
      apartment: "266",
      condominium: "Romeu",
      address: "Rua Cinco de Julho, 266 - Copacabana",
      type: "Proprietária",
      moveInDate: "2021-03-18",
      status: "Ativo",
      emergencyContact: "Ricardo Romeu - (21) 91098-7654",
      vehicles: ["STU-8641"],
      dependents: 0
    },
    {
      id: 9,
      name: "Ricardo Albuquerque",
      email: "ricardo@email.com",
      phone: "(21) 91098-7654",
      cpf: "258.369.147-89",
      apartment: "392",
      condominium: "Visconde Albuquerque",
      address: "Avenida Visconde de Albuquerque, 392 - Leblon",
      type: "Proprietário",
      moveInDate: "2020-07-22",
      status: "Ativo",
      emergencyContact: "Ana Albuquerque - (21) 99988-7766",
      vehicles: ["VWX-7531"],
      dependents: 2
    },
    {
      id: 10,
      name: "Marcos Silva",
      email: "marcos@email.com",
      phone: "(21) 98877-6655",
      cpf: "369.147.258-01",
      apartment: "101",
      condominium: "Santos Dumont",
      address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá",
      type: "Inquilino",
      moveInDate: "2024-01-10",
      status: "Ativo",
      emergencyContact: "Paula Silva - (21) 97766-5544",
      vehicles: ["YZA-4826"],
      dependents: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Inativo":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Proprietário":
      case "Proprietária":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Inquilino":
      case "Inquilina":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const stats = {
    total: residents.length,
    owners: residents.filter(r => r.type.includes("Proprietário")).length,
    tenants: residents.filter(r => r.type.includes("Inquilino")).length,
    active: residents.filter(r => r.status === "Ativo").length
  };

  return (
    <ContentLayout title="Moradores">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Em {residents.filter((r, index, self) => 
                  index === self.findIndex(a => a.condominium === r.condominium)
                ).length} condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proprietários</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.owners}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.owners / stats.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tenants}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.tenants / stats.total) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Moradores ativos
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
            Novo Morador
          </Button>
        </div>

        {/* Lista de Moradores */}
        <div className="grid gap-4">
          {residents.map((resident) => (
            <Card key={resident.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{resident.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.status)}`}>
                          {resident.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">CPF: {resident.cpf}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resident.type)}`}>
                          {resident.type}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Contato</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {resident.phone}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {resident.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Emergência: {resident.emergencyContact}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Residência</p>
                      <p className="text-sm text-muted-foreground">Apt {resident.apartment} - {resident.condominium}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {resident.address}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Desde: {new Date(resident.moveInDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Informações</p>
                      <p className="text-sm text-muted-foreground">Dependentes: {resident.dependents}</p>
                      <p className="text-sm text-muted-foreground">
                        Veículos: {resident.vehicles.length > 0 ? resident.vehicles.join(", ") : "Nenhum"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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
