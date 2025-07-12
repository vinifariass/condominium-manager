import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HeadphonesIcon, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Wrench,
  Edit,
  Eye,
  Play,
  X
} from "lucide-react";

export default function TicketsPage() {
  // Dados simulados - substituir por dados reais da API
  const tickets = [
    {
      id: 1,
      title: "Problema no elevador social",
      description: "O elevador do bloco A está fazendo ruído estranho e parando entre andares",
      category: "Manutenção",
      priority: "Alta",
      status: "Aberto",
      requester: {
        name: "Maria Silva",
        apartment: "Apt 201 - Bloco A",
        phone: "(11) 99999-9999",
        email: "maria@email.com"
      },
      assignedTo: "João Silva (Zelador)",
      createdAt: "2024-01-15T09:30:00",
      updatedAt: "2024-01-15T09:30:00",
      estimatedTime: "2 horas",
      comments: [
        {
          id: 1,
          author: "Maria Silva",
          message: "O elevador está parado há 30 minutos",
          timestamp: "2024-01-15T09:30:00"
        }
      ]
    },
    {
      id: 2,
      title: "Vazamento na área da piscina",
      description: "Há água vazando no vestiário masculino da piscina",
      category: "Hidráulica",
      priority: "Média",
      status: "Em Andamento",
      requester: {
        name: "João Santos",
        apartment: "Apt 105 - Bloco A",
        phone: "(11) 88888-8888",
        email: "joao@email.com"
      },
      assignedTo: "Carlos Pereira (Técnico)",
      createdAt: "2024-01-14T14:20:00",
      updatedAt: "2024-01-15T08:15:00",
      estimatedTime: "4 horas",
      comments: [
        {
          id: 1,
          author: "João Santos",
          message: "O vazamento começou ontem à noite",
          timestamp: "2024-01-14T14:20:00"
        },
        {
          id: 2,
          author: "Carlos Pereira",
          message: "Iniciando reparo. Material já solicitado.",
          timestamp: "2024-01-15T08:15:00"
        }
      ]
    },
    {
      id: 3,
      title: "Lâmpada queimada no hall",
      description: "Lâmpada do hall principal do térreo está queimada",
      category: "Elétrica",
      priority: "Baixa",
      status: "Concluído",
      requester: {
        name: "Ana Costa",
        apartment: "Apt 302 - Bloco B",
        phone: "(11) 77777-7777",
        email: "ana@email.com"
      },
      assignedTo: "Roberto Lima (Porteiro)",
      createdAt: "2024-01-13T16:45:00",
      updatedAt: "2024-01-14T10:30:00",
      estimatedTime: "30 minutos",
      comments: [
        {
          id: 1,
          author: "Ana Costa",
          message: "A lâmpada está piscando há alguns dias",
          timestamp: "2024-01-13T16:45:00"
        },
        {
          id: 2,
          author: "Roberto Lima",
          message: "Lâmpada substituída com sucesso",
          timestamp: "2024-01-14T10:30:00"
        }
      ]
    },
    {
      id: 4,
      title: "Portão da garagem com defeito",
      description: "O portão automático não abre com o controle remoto",
      category: "Manutenção",
      priority: "Alta",
      status: "Aguardando Peças",
      requester: {
        name: "Pedro Oliveira",
        apartment: "Apt 150 - Bloco C",
        phone: "(11) 66666-6666",
        email: "pedro@email.com"
      },
      assignedTo: "Técnico Externo",
      createdAt: "2024-01-12T07:15:00",
      updatedAt: "2024-01-14T15:20:00",
      estimatedTime: "1 dia",
      comments: [
        {
          id: 1,
          author: "Pedro Oliveira",
          message: "Não consigo entrar na garagem há 2 dias",
          timestamp: "2024-01-12T07:15:00"
        },
        {
          id: 2,
          author: "Administração",
          message: "Técnico chamado. Aguardando chegada das peças.",
          timestamp: "2024-01-14T15:20:00"
        }
      ]
    },
    {
      id: 5,
      title: "Ruído no interfone",
      description: "Interfone do apartamento com chiado e dificuldade de comunicação",
      category: "Eletrônica",
      priority: "Média",
      status: "Cancelado",
      requester: {
        name: "Lucia Ferreira",
        apartment: "Apt 85 - Bloco B",
        phone: "(11) 55555-5555",
        email: "lucia@email.com"
      },
      assignedTo: null,
      createdAt: "2024-01-10T12:30:00",
      updatedAt: "2024-01-11T09:15:00",
      estimatedTime: null,
      comments: [
        {
          id: 1,
          author: "Lucia Ferreira",
          message: "O interfone está com muito chiado",
          timestamp: "2024-01-10T12:30:00"
        },
        {
          id: 2,
          author: "Administração",
          message: "Solicitante resolveu o problema internamente",
          timestamp: "2024-01-11T09:15:00"
        }
      ]
    }
  ];

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(ticket => ticket.status === "Aberto").length,
    inProgress: tickets.filter(ticket => ticket.status === "Em Andamento").length,
    completed: tickets.filter(ticket => ticket.status === "Concluído").length,
    highPriority: tickets.filter(ticket => ticket.priority === "Alta").length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "bg-red-100 text-red-800";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800";
      case "Concluído":
        return "bg-green-100 text-green-800";
      case "Aguardando Peças":
        return "bg-blue-100 text-blue-800";
      case "Cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "text-red-600";
      case "Média":
        return "text-yellow-600";
      case "Baixa":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto":
        return <AlertTriangle className="h-4 w-4" />;
      case "Em Andamento":
        return <Clock className="h-4 w-4" />;
      case "Concluído":
        return <CheckCircle className="h-4 w-4" />;
      case "Aguardando Peças":
        return <Wrench className="h-4 w-4" />;
      case "Cancelado":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <ContentLayout title="Chamados">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
              <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">
                Todos os registros
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abertos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.openTickets}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Sendo atendidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Finalizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">
                Urgentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Chamados</CardTitle>
                <CardDescription>Gerencie todas as solicitações e problemas reportados</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Chamado
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar chamados..."
                  className="pl-8 w-full p-2 border rounded-md"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ticket.status)}
                            <span className="font-medium">#{ticket.id} - {ticket.title}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">{ticket.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{ticket.requester.name}</p>
                              <p className="text-xs text-muted-foreground">{ticket.requester.apartment}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Categoria</p>
                            <p className="font-medium">{ticket.category}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Responsável</p>
                            <p className="font-medium">{ticket.assignedTo || "Não atribuído"}</p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Tempo Estimado</p>
                            <p className="font-medium">{ticket.estimatedTime || "N/A"}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Criado: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Atualizado: {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {ticket.comments.length} comentário{ticket.comments.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {ticket.status === "Aberto" && (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
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
          </CardContent>
        </Card>

        {/* Chamados por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Categoria</CardTitle>
            <CardDescription>Distribuição das solicitações por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(tickets.map(ticket => ticket.category))).map((category) => {
                const categoryTickets = tickets.filter(ticket => ticket.category === category);
                const openCount = categoryTickets.filter(ticket => ticket.status === "Aberto").length;
                const inProgressCount = categoryTickets.filter(ticket => ticket.status === "Em Andamento").length;
                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {categoryTickets.length} chamado{categoryTickets.length !== 1 ? 's' : ''} total
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-red-600">{openCount} aberto{openCount !== 1 ? 's' : ''}</span>
                        <span className="text-yellow-600">{inProgressCount} em andamento</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
