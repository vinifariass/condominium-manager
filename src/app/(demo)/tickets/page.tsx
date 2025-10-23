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
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Clock,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  User,
  MapPin,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Shield,
  Wifi
} from "lucide-react";

export default function TicketsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Dados simulados de chamados baseados nos condomínios reais
  const tickets = [
    {
      id: 1,
      title: "Vazamento no banheiro do apartamento 301",
      description: "Há um vazamento constante na torneira da pia do banheiro. A água está gotejando e causando desperdício.",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      apartment: "301",
      resident: "Maria Santos",
      residentPhone: "(21) 99999-8888",
      residentEmail: "maria.santos@email.com",
      category: "Hidráulica",
      priority: "Média",
      status: "Em Andamento",
      createdAt: "2024-01-15T10:30:00",
      updatedAt: "2024-01-16T14:20:00",
      assignedTo: "Paulo Santos",
      estimatedCompletion: "2024-01-18",
      cost: 150.00,
      comments: [
        {
          author: "João Silva",
          date: "2024-01-15T10:45:00",
          text: "Chamado registrado. Verificarei hoje à tarde."
        },
        {
          author: "Paulo Santos",
          date: "2024-01-16T14:20:00",
          text: "Peças pedidas ao fornecedor. Instalação amanhã."
        }
      ]
    },
    {
      id: 2,
      title: "Lâmpada queimada no corredor do 5º andar",
      description: "A lâmpada do corredor próximo ao elevador está queimada há 3 dias, deixando o local muito escuro.",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      apartment: "Área Comum",
      resident: "Carlos Santos",
      residentPhone: "(21) 98765-1234",
      residentEmail: "carlos.santos@santosdumont.com.br",
      category: "Elétrica",
      priority: "Alta",
      status: "Aberto",
      createdAt: "2024-01-14T08:15:00",
      updatedAt: "2024-01-14T08:15:00",
      assignedTo: null,
      estimatedCompletion: "2024-01-17",
      cost: 25.00,
      comments: []
    },
    {
      id: 3,
      title: "Portão eletrônico com defeito",
      description: "O portão da garagem não está abrindo com o controle remoto. Precisa ser verificado urgentemente.",
      condominium: "Condomínio Griffe",
      condominiumId: 2,
      apartment: "Área Comum",
      resident: "Ana Paula Griffe",
      residentPhone: "(21) 98765-5678",
      residentEmail: "ana.griffe@griffe.com.br",
      category: "Segurança",
      priority: "Alta",
      status: "Concluído",
      createdAt: "2024-01-10T16:20:00",
      updatedAt: "2024-01-12T11:30:00",
      assignedTo: "Pedro Oliveira",
      estimatedCompletion: "2024-01-12",
      cost: 320.00,
      comments: [
        {
          author: "Pedro Oliveira",
          date: "2024-01-11T09:00:00",
          text: "Motor do portão substituído."
        },
        {
          author: "Ana Paula Griffe",
          date: "2024-01-12T11:30:00",
          text: "Testado e funcionando perfeitamente. Obrigada!"
        }
      ]
    },
    {
      id: 4,
      title: "Ar condicionado do salão de festas não liga",
      description: "O ar condicionado do salão de festas não está funcionando. Evento marcado para o fim de semana.",
      condominium: "Condomínio Griffe",
      condominiumId: 2,
      apartment: "Salão de Festas",
      resident: "Roberto Silva",
      residentPhone: "(21) 99888-7777",
      residentEmail: "roberto.silva@email.com",
      category: "Climatização",
      priority: "Alta",
      status: "Em Andamento",
      createdAt: "2024-01-16T14:45:00",
      updatedAt: "2024-01-17T10:15:00",
      assignedTo: "Pedro Oliveira",
      estimatedCompletion: "2024-01-19",
      cost: 200.00,
      comments: [
        {
          author: "Pedro Oliveira",
          date: "2024-01-17T10:15:00",
          text: "Verificando se é problema no compressor."
        }
      ]
    },
    {
      id: 5,
      title: "Vazamento na piscina",
      description: "A piscina está perdendo água constantemente. Nível baixando todos os dias.",
      condominium: "Condomínio Artagus",
      condominiumId: 3,
      apartment: "Área de Lazer",
      resident: "Roberto Artagus",
      residentPhone: "(21) 98765-2468",
      residentEmail: "roberto.artagus@artagus.com.br",
      category: "Hidráulica",
      priority: "Média",
      status: "Aguardando Orçamento",
      createdAt: "2024-01-13T11:20:00",
      updatedAt: "2024-01-15T16:40:00",
      assignedTo: "José Ferreira",
      estimatedCompletion: "2024-01-22",
      cost: 850.00,
      comments: [
        {
          author: "José Ferreira",
          date: "2024-01-15T16:40:00",
          text: "Necessário contratar empresa especializada."
        }
      ]
    },
    {
      id: 6,
      title: "Internet da portaria instável",
      description: "A conexão de internet da portaria está caindo constantemente, prejudicando o sistema de monitoramento.",
      condominium: "Condomínio Artagus",
      condominiumId: 3,
      apartment: "Portaria",
      resident: "José Ferreira",
      residentPhone: "(21) 98765-1357",
      residentEmail: "jose.ferreira@artagus.com.br",
      category: "Tecnologia",
      priority: "Média",
      status: "Aberto",
      createdAt: "2024-01-17T09:10:00",
      updatedAt: "2024-01-17T09:10:00",
      assignedTo: null,
      estimatedCompletion: "2024-01-20",
      cost: 120.00,
      comments: []
    },
    {
      id: 7,
      title: "Elevador social com ruído excessivo",
      description: "O elevador social está fazendo muito barulho durante o funcionamento, causando incômodo aos moradores.",
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      apartment: "Área Comum",
      resident: "Ana Costa",
      residentPhone: "(21) 99777-6666",
      residentEmail: "ana.costa@email.com",
      category: "Manutenção",
      priority: "Média",
      status: "Em Andamento",
      createdAt: "2024-01-12T15:30:00",
      updatedAt: "2024-01-16T13:45:00",
      assignedTo: "Paulo Santos",
      estimatedCompletion: "2024-01-20",
      cost: 450.00,
      comments: [
        {
          author: "Paulo Santos",
          date: "2024-01-16T13:45:00",
          text: "Empresa de elevadores chamada para manutenção."
        }
      ]
    },
    {
      id: 8,
      title: "Infiltração na parede do apartamento 1502",
      description: "Há uma mancha de umidade crescendo na parede da sala. Pode ser infiltração do apartamento de cima.",
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      apartment: "1502",
      resident: "Pedro Oliveira",
      residentPhone: "(21) 99666-5555",
      residentEmail: "pedro.oliveira@email.com",
      category: "Hidráulica",
      priority: "Alta",
      status: "Aberto",
      createdAt: "2024-01-17T16:00:00",
      updatedAt: "2024-01-17T16:00:00",
      assignedTo: null,
      estimatedCompletion: "2024-01-25",
      cost: 0,
      comments: []
    },
    {
      id: 9,
      title: "Porteiro eletrônico do apartamento 205 sem áudio",
      description: "O porteiro eletrônico não está transmitindo áudio. Consigo ver as imagens mas não escuto nem falo.",
      condominium: "Condomínio Recanto",
      condominiumId: 5,
      apartment: "205",
      resident: "Carla Recanto",
      residentPhone: "(21) 99999-0000",
      residentEmail: "carla.recanto@email.com",
      category: "Segurança",
      priority: "Média",
      status: "Concluído",
      createdAt: "2024-01-08T10:20:00",
      updatedAt: "2024-01-10T14:15:00",
      assignedTo: "João Recanto",
      estimatedCompletion: "2024-01-10",
      cost: 80.00,
      comments: [
        {
          author: "João Recanto",
          date: "2024-01-10T14:15:00",
          text: "Cabo de áudio substituído. Funcionando normalmente."
        }
      ]
    },
    {
      id: 10,
      title: "Vazamento no teto da academia",
      description: "Há goteiras no teto da academia quando chove. Equipamentos podem ser danificados.",
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      apartment: "Academia",
      resident: "Fernanda Vivenda",
      residentPhone: "(21) 98765-7419",
      residentEmail: "fernanda.vivenda@vivenda.com.br",
      category: "Hidráulica",
      priority: "Alta",
      status: "Aguardando Orçamento",
      createdAt: "2024-01-14T12:30:00",
      updatedAt: "2024-01-16T09:20:00",
      assignedTo: "Ricardo Mendes",
      estimatedCompletion: "2024-01-30",
      cost: 1200.00,
      comments: [
        {
          author: "Ricardo Mendes",
          date: "2024-01-16T09:20:00",
          text: "Necessário refazer impermeabilização da laje."
        }
      ]
    },
    {
      id: 11,
      title: "Iluminação da quadra poliesportiva queimada",
      description: "Metade das lâmpadas da quadra poliesportiva estão queimadas, impossibilitando o uso noturno.",
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      apartment: "Quadra Poliesportiva",
      resident: "Carlos Vivenda",
      residentPhone: "(21) 98888-9999",
      residentEmail: "carlos.vivenda@email.com",
      category: "Elétrica",
      priority: "Média",
      status: "Em Andamento",
      createdAt: "2024-01-15T18:45:00",
      updatedAt: "2024-01-17T08:30:00",
      assignedTo: "Ricardo Mendes",
      estimatedCompletion: "2024-01-19",
      cost: 180.00,
      comments: [
        {
          author: "Ricardo Mendes",
          date: "2024-01-17T08:30:00",
          text: "Lâmpadas LED pedidas. Instalação hoje."
        }
      ]
    },
    {
      id: 12,
      title: "Bomba d'água com defeito",
      description: "A bomba d'água do prédio está falhando. Pressão da água muito baixa nos andares superiores.",
      condominium: "Condomínio OCAPORAN",
      condominiumId: 7,
      apartment: "Casa de Máquinas",
      resident: "Pedro Ocaporan",
      residentPhone: "(21) 98765-9630",
      residentEmail: "pedro.ocaporan@ocaporan.com.br",
      category: "Hidráulica",
      priority: "Alta",
      status: "Aberto",
      createdAt: "2024-01-17T07:15:00",
      updatedAt: "2024-01-17T07:15:00",
      assignedTo: null,
      estimatedCompletion: "2024-01-22",
      cost: 800.00,
      comments: []
    },
    {
      id: 13,
      title: "Fechadura eletrônica da porta principal travada",
      description: "A fechadura eletrônica da porta principal não está funcionando. Moradores não conseguem entrar.",
      condominium: "Condomínio Romeu",
      condominiumId: 8,
      apartment: "Entrada Principal",
      resident: "Luiza Romeu",
      residentPhone: "(21) 98765-1472",
      residentEmail: "luiza.romeu@romeu.com.br",
      category: "Segurança",
      priority: "Crítica",
      status: "Em Andamento",
      createdAt: "2024-01-17T20:30:00",
      updatedAt: "2024-01-17T21:15:00",
      assignedTo: "Carlos Romeu",
      estimatedCompletion: "2024-01-18",
      cost: 250.00,
      comments: [
        {
          author: "Carlos Romeu",
          date: "2024-01-17T21:15:00",
          text: "Técnico chamado urgentemente. Chegará às 22h."
        }
      ]
    },
    {
      id: 14,
      title: "Problema no sistema de interfone",
      description: "O sistema de interfone está falhando. Moradores não conseguem se comunicar com a portaria.",
      condominium: "Condomínio Visconde Albuquerque",
      condominiumId: 9,
      apartment: "Sistema Predial",
      resident: "Ricardo Albuquerque",
      residentPhone: "(21) 98765-3698",
      residentEmail: "ricardo.albuquerque@viscondalbuquerque.com.br",
      category: "Tecnologia",
      priority: "Alta",
      status: "Aguardando Orçamento",
      createdAt: "2024-01-16T11:40:00",
      updatedAt: "2024-01-17T10:20:00",
      assignedTo: "Beatriz Albuquerque",
      estimatedCompletion: "2024-01-25",
      cost: 1500.00,
      comments: [
        {
          author: "Beatriz Albuquerque",
          date: "2024-01-17T10:20:00",
          text: "Central antiga precisa ser substituída."
        }
      ]
    },
    {
      id: 15,
      title: "Limpeza especial após festa no salão",
      description: "Necessária limpeza especial no salão de festas após evento de ontem. Há muito sujeira e restos de comida.",
      condominium: "Condomínio Visconde Albuquerque",
      condominiumId: 9,
      apartment: "Salão de Festas",
      resident: "Marcos Albuquerque",
      residentPhone: "(21) 98888-5555",
      residentEmail: "marcos.albuquerque@email.com",
      category: "Limpeza",
      priority: "Baixa",
      status: "Concluído",
      createdAt: "2024-01-14T08:00:00",
      updatedAt: "2024-01-14T16:30:00",
      assignedTo: "Amanda Costa",
      estimatedCompletion: "2024-01-14",
      cost: 120.00,
      comments: [
        {
          author: "Amanda Costa",
          date: "2024-01-14T16:30:00",
          text: "Limpeza completa realizada. Salão liberado."
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "text-blue-600 bg-blue-100";
      case "Em Andamento":
        return "text-yellow-600 bg-yellow-100";
      case "Aguardando Orçamento":
        return "text-orange-600 bg-orange-100";
      case "Concluído":
        return "text-green-600 bg-green-100";
      case "Cancelado":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return "text-red-600 bg-red-100";
      case "Alta":
        return "text-orange-600 bg-orange-100";
      case "Média":
        return "text-yellow-600 bg-yellow-100";
      case "Baixa":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Hidráulica":
        return <Droplets className="h-4 w-4" />;
      case "Elétrica":
        return <Zap className="h-4 w-4" />;
      case "Climatização":
        return <Wind className="h-4 w-4" />;
      case "Segurança":
        return <Shield className="h-4 w-4" />;
      case "Tecnologia":
        return <Wifi className="h-4 w-4" />;
      case "Manutenção":
        return <Wrench className="h-4 w-4" />;
      case "Limpeza":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ContentLayout title="Chamados">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chamados</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os chamados de manutenção dos condomínios
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Chamado</DialogTitle>
                <DialogDescription>Abra um novo chamado de manutenção ou solicitação</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" placeholder="Descreva brevemente o problema" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Input id="category" placeholder="Elétrica, Hidráulica..." required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Prioridade *</Label>
                    <Input id="priority" placeholder="Alta, Média, Baixa" required />
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {tickets.filter(ticket => ticket.status === "Em Andamento").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sendo resolvidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter(ticket => ticket.status === "Concluído").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((tickets.filter(ticket => ticket.status === "Concluído").length / tickets.length) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">R$</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(tickets.reduce((total, ticket) => total + ticket.cost, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimado/Realizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar chamados..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Condomínio
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Prioridade
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Chamados</CardTitle>
            <CardDescription>
              Todos os chamados registrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-6 lg:gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          {getCategoryIcon(ticket.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{ticket.condominium}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{ticket.apartment}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="truncate">{ticket.resident}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{ticket.residentPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Categoria:</span> {ticket.category}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Responsável:</span> {ticket.assignedTo || "Não atribuído"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Criado: {formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Previsão:</span> {new Date(ticket.estimatedCompletion).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Custo:</span> {formatCurrency(ticket.cost)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.comments.length} comentários</span>
                      </div>
                    </div>
                  </div>

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
