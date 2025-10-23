"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Users,
  Key,
  Edit,
  Eye,
  Settings,
  Calendar,
  DollarSign
} from "lucide-react";

export default function CondominiumsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Dados simulados baseados nos condomínios reais - substituir por dados reais da API
  const condominiums = [
    {
      id: 1,
      name: "Condomínio Santos Dumont",
      address: "Estrada dos Três Rios, 1306 - Freguesia - Jacarepaguá, RJ",
      cnpj: "29.008.729/0001-96",
      phone: "(21) 2443-7890",
      email: "admin@santosdumont.com.br",
      totalApartments: 85,
      totalResidents: 198,
      occupancyRate: 94,
      monthlyRevenue: 125000,
      status: "Ativo",
      manager: "Carlos Santos",
      createdAt: "2018-03-15",
      blocks: [
        { name: "Torre Principal", apartments: 85, floors: 20 }
      ],
      amenities: [
        "Salão de Festas",
        "Piscina",
        "Academia",
        "Playground",
        "Portaria 24h"
      ]
    },
    {
      id: 2,
      name: "Condomínio Griffe",
      address: "Rua da Passagem, 160 - Botafogo, Rio de Janeiro - RJ",
      cnpj: "14.473.420/0001-08",
      phone: "(21) 2541-6789",
      email: "admin@griffe.com.br",
      totalApartments: 45,
      totalResidents: 112,
      occupancyRate: 87,
      monthlyRevenue: 68000,
      status: "Ativo",
      manager: "Ana Paula Griffe",
      createdAt: "2019-08-22",
      blocks: [
        { name: "Edifício Principal", apartments: 45, floors: 12 }
      ],
      amenities: [
        "Portaria 24h",
        "Área de Lazer",
        "Estacionamento"
      ]
    },
    {
      id: 3,
      name: "Condomínio Artagus",
      address: "Rua Santa Clara, 142, Copacabana, Rio de Janeiro - RJ, CEP 22041-012",
      cnpj: "04.543.049/0001-41",
      phone: "(21) 2256-5432",
      email: "admin@artagus.com.br",
      totalApartments: 60,
      totalResidents: 145,
      occupancyRate: 91,
      monthlyRevenue: 89000,
      status: "Ativo",
      manager: "Roberto Artagus",
      createdAt: "2017-11-10",
      blocks: [
        { name: "Torre Única", apartments: 60, floors: 15 }
      ],
      amenities: [
        "Piscina",
        "Sauna",
        "Portaria 24h",
        "Área de Lazer"
      ]
    },
    {
      id: 4,
      name: "Condomínio Cachoeira Dourada",
      address: "Avenida Rainha Elizabeth, 122, CEP 22081-031, Rio de Janeiro - RJ",
      cnpj: "73.383.614/0001-73",
      phone: "(21) 2234-4321",
      email: "admin@cachoeiraourada.com.br",
      totalApartments: 75,
      totalResidents: 180,
      occupancyRate: 89,
      monthlyRevenue: 95000,
      status: "Ativo",
      manager: "Maria Cachoeira",
      createdAt: "2020-05-20",
      blocks: [
        { name: "Bloco Principal", apartments: 75, floors: 18 }
      ],
      amenities: [
        "Piscina",
        "Academia",
        "Churrasqueira",
        "Playground",
        "Portaria 24h"
      ]
    },
    {
      id: 5,
      name: "Condomínio Recanto",
      address: "Rua Visconde de Silva, 85, Humaitá, CEP 22271-043, Rio de Janeiro - RJ",
      cnpj: "37.541.791/0001-77",
      phone: "(21) 2225-6789",
      email: "admin@recanto.com.br",
      totalApartments: 32,
      totalResidents: 78,
      occupancyRate: 95,
      monthlyRevenue: 52000,
      status: "Ativo",
      manager: "João Recanto",
      createdAt: "2021-01-15",
      blocks: [
        { name: "Edifício Único", apartments: 32, floors: 8 }
      ],
      amenities: [
        "Área de Lazer",
        "Portaria 24h",
        "Jardim"
      ]
    },
    {
      id: 6,
      name: "Condomínio Vivenda",
      address: "Avenida Afrânio de Melo Franco, 74, Leblon, Rio de Janeiro - RJ",
      cnpj: "39.937.662/0001-66",
      phone: "(21) 2512-3456",
      email: "admin@vivenda.com.br",
      totalApartments: 95,
      totalResidents: 220,
      occupancyRate: 92,
      monthlyRevenue: 145000,
      status: "Ativo",
      manager: "Fernanda Vivenda",
      createdAt: "2018-09-10",
      blocks: [
        { name: "Torre A", apartments: 48, floors: 16 },
        { name: "Torre B", apartments: 47, floors: 16 }
      ],
      amenities: [
        "Piscina",
        "Academia",
        "Quadra Poliesportiva",
        "Salão de Festas",
        "Portaria 24h"
      ]
    },
    {
      id: 7,
      name: "Condomínio OCAPORAN",
      address: "Rua Rias da Rocha, 12, Copacabana, Rio de Janeiro - RJ",
      cnpj: "68.768.027/0001-62",
      phone: "(21) 2267-8901",
      email: "admin@ocaporan.com.br",
      totalApartments: 28,
      totalResidents: 65,
      occupancyRate: 88,
      monthlyRevenue: 42000,
      status: "Ativo",
      manager: "Pedro Ocaporan",
      createdAt: "2019-12-05",
      blocks: [
        { name: "Prédio Principal", apartments: 28, floors: 7 }
      ],
      amenities: [
        "Portaria 24h",
        "Terraço",
        "Área de Lazer"
      ]
    },
    {
      id: 8,
      name: "Condomínio Romeu",
      address: "Rua Cinco de Julho, 266, Copacabana, Rio de Janeiro - RJ",
      cnpj: "68.607.969/0001-69",
      phone: "(21) 2255-7890",
      email: "admin@romeu.com.br",
      totalApartments: 52,
      totalResidents: 125,
      occupancyRate: 90,
      monthlyRevenue: 73000,
      status: "Ativo",
      manager: "Luiza Romeu",
      createdAt: "2020-03-18",
      blocks: [
        { name: "Edifício Principal", apartments: 52, floors: 13 }
      ],
      amenities: [
        "Piscina",
        "Área de Lazer",
        "Portaria 24h",
        "Estacionamento"
      ]
    },
    {
      id: 9,
      name: "Condomínio Visconde Albuquerque",
      address: "Avenida Visconde de Albuquerque, 392, Leblon, Rio de Janeiro - RJ",
      cnpj: "12.307.108/0001-00",
      phone: "(21) 2529-4567",
      email: "admin@viscondalbuquerque.com.br",
      totalApartments: 68,
      totalResidents: 165,
      occupancyRate: 93,
      monthlyRevenue: 98000,
      status: "Ativo",
      manager: "Ricardo Albuquerque",
      createdAt: "2019-07-22",
      blocks: [
        { name: "Torre Principal", apartments: 68, floors: 17 }
      ],
      amenities: [
        "Piscina",
        "Academia",
        "Sauna",
        "Salão de Festas",
        "Portaria 24h"
      ]
    },
    {
      id: 2,
      name: "Edifício Portal do Sol",
      address: "Av. Paulista, 1500 - Bela Vista, São Paulo - SP",
      cnpj: "98.765.432/0001-21",
      phone: "(11) 2345-6789",
      email: "gestao@portaldosol.com.br",
      totalApartments: 80,
      totalResidents: 195,
      occupancyRate: 88,
      monthlyRevenue: 98000,
      status: "Ativo",
      manager: "Ana Santos",
      createdAt: "2019-08-22",
      blocks: [
        { name: "Torre A", apartments: 40, floors: 20 },
        { name: "Torre B", apartments: 40, floors: 20 }
      ],
      amenities: [
        "Salão de Festas",
        "Piscina",
        "Sauna",
        "Brinquedoteca",
        "Espaço Gourmet"
      ]
    },
    {
      id: 3,
      name: "Condomínio Vila Serena",
      address: "Rua da Paz, 456 - Vila Madalena, São Paulo - SP",
      cnpj: "45.678.912/0001-34",
      phone: "(11) 4567-8901",
      email: "admin@vilaserena.com.br",
      totalApartments: 60,
      totalResidents: 142,
      occupancyRate: 95,
      monthlyRevenue: 72000,
      status: "Ativo",
      manager: "Roberto Lima",
      createdAt: "2021-11-10",
      blocks: [
        { name: "Bloco Único", apartments: 60, floors: 15 }
      ],
      amenities: [
        "Piscina",
        "Academia",
        "Espaço Kids",
        "Churrasqueira",
        "Jardim"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "text-green-600 bg-green-100";
      case "Inativo":
        return "text-red-600 bg-red-100";
      case "Manutenção":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const totalCondominiums = condominiums.length;
  const totalApartments = condominiums.reduce((sum, c) => sum + c.totalApartments, 0);
  const totalResidents = condominiums.reduce((sum, c) => sum + c.totalResidents, 0);
  const totalRevenue = condominiums.reduce((sum, c) => sum + c.monthlyRevenue, 0);

  return (
    <ContentLayout title="Condomínios">
      <div className="space-y-6">
        {/* Header com Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Condomínios</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCondominiums}</div>
              <p className="text-xs text-muted-foreground">
                Todos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApartments}</div>
              <p className="text-xs text-muted-foreground">
                Across all condominiums
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                Em todos os condomínios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Receita mensal combinada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciamento de Condomínios */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Condomínios</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os condomínios da sua carteira
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Condomínio
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Condomínio</DialogTitle>
                    <DialogDescription>
                      Adicione um novo condomínio à sua carteira
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome do Condomínio *</Label>
                      <Input
                        id="name"
                        placeholder="Condomínio Exemplo"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Endereço Completo *</Label>
                      <Input
                        id="address"
                        placeholder="Rua Exemplo, 123 - Bairro - Cidade - UF"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cnpj">CNPJ *</Label>
                        <Input
                          id="cnpj"
                          placeholder="00.000.000/0001-00"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(00) 0000-0000"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      Criar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome, endereço ou CNPJ..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Lista de Condomínios */}
            <div className="space-y-6">
              {condominiums.map((condominium) => (
                <Card key={condominium.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold">{condominium.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(condominium.status)}`}>
                              {condominium.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{condominium.address}</span>
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
                  </CardHeader>
                  <CardContent>
                    {/* Estatísticas do Condomínio */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{condominium.totalApartments}</div>
                        <div className="text-xs text-muted-foreground">Apartamentos</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{condominium.totalResidents}</div>
                        <div className="text-xs text-muted-foreground">Moradores</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{condominium.occupancyRate}%</div>
                        <div className="text-xs text-muted-foreground">Ocupação</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">R$ {condominium.monthlyRevenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Receita Mensal</div>
                      </div>
                    </div>

                    {/* Informações Detalhadas */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informações de Contato */}
                      <div>
                        <h4 className="font-semibold mb-3">Informações de Contato</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{condominium.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{condominium.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span>Gestor: {condominium.manager}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Desde: {new Date(condominium.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Estrutura e Amenidades */}
                      <div>
                        <h4 className="font-semibold mb-3">Estrutura</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Blocos/Torres:</span>
                            <div className="mt-1">
                              {condominium.blocks.map((block, index) => (
                                <span key={index} className="inline-block mr-2 mb-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                                  {block.name} ({block.apartments} apt, {block.floors} and)
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Amenidades:</span>
                            <div className="mt-1">
                              {condominium.amenities.map((amenity, index) => (
                                <span key={index} className="inline-block mr-2 mb-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CNPJ */}
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-xs text-muted-foreground">CNPJ: {condominium.cnpj}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
