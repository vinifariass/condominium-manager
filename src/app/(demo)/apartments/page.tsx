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
  Trash2
} from "lucide-react";

export default function ApartmentsPage() {
  // Dados simulados - substituir por dados reais da API
  const apartments = [
    {
      id: 1,
      number: "101",
      block: "A",
      floor: 1,
      type: "Residencial",
      area: 85.5,
      bedrooms: 3,
      bathrooms: 2,
      owner: "Maria Silva",
      status: "Ocupado",
      phone: "(11) 99999-9999",
      email: "maria@email.com"
    },
    {
      id: 2,
      number: "102",
      block: "A", 
      floor: 1,
      type: "Residencial",
      area: 78.0,
      bedrooms: 2,
      bathrooms: 1,
      owner: null,
      status: "Vago",
      phone: null,
      email: null
    },
    {
      id: 3,
      number: "201",
      block: "A",
      floor: 2,
      type: "Residencial", 
      area: 85.5,
      bedrooms: 3,
      bathrooms: 2,
      owner: "João Santos",
      status: "Ocupado",
      phone: "(11) 88888-8888",
      email: "joao@email.com"
    },
    {
      id: 4,
      number: "G01",
      block: "A",
      floor: 0,
      type: "Garagem",
      area: 12.0,
      bedrooms: 0,
      bathrooms: 0,
      owner: "Maria Silva",
      status: "Ocupado",
      phone: "(11) 99999-9999",
      email: "maria@email.com"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ocupado":
        return "text-green-600 bg-green-100";
      case "Vago":
        return "text-yellow-600 bg-yellow-100";
      case "Manutenção":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Residencial":
        return <Building2 className="h-4 w-4" />;
      case "Garagem":
        return <Car className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  return (
    <ContentLayout title="Apartamentos">
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apartments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {apartments.filter(apt => apt.status === "Ocupado").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagos</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {apartments.filter(apt => apt.status === "Vago").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Ocupação</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((apartments.filter(apt => apt.status === "Ocupado").length / apartments.length) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Apartamentos</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os apartamentos do condomínio
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Apartamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por número, bloco ou proprietário..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Lista de Apartamentos */}
            <div className="space-y-4">
              {apartments.map((apartment) => (
                <div key={apartment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        {getTypeIcon(apartment.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">
                            Apt {apartment.number} - Bloco {apartment.block}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apartment.status)}`}>
                            {apartment.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                          <span>{apartment.floor}º andar</span>
                          <span>{apartment.area}m²</span>
                          {apartment.bedrooms > 0 && (
                            <span>{apartment.bedrooms} quartos</span>
                          )}
                          {apartment.bathrooms > 0 && (
                            <span>{apartment.bathrooms} banheiros</span>
                          )}
                          <span className="capitalize">{apartment.type}</span>
                        </div>
                        
                        {apartment.owner && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">{apartment.owner}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {apartment.phone && <span>{apartment.phone}</span>}
                              {apartment.email && <span>{apartment.email}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
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
