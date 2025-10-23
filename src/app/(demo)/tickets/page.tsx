"use client";

import React, { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Wifi,
  X,
  ChevronDown,
  Trash2,
  Copy
} from "lucide-react";

// Interfaces para tipagem - preparado para backend
interface TicketComment {
  id?: number;
  author: string;
  date: string;
  text: string;
}

interface TicketData {
  id: number;
  title: string;
  description: string;
  condominium: string;
  condominiumId: number;
  apartment: string;
  resident: string;
  residentPhone: string;
  residentEmail: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
  estimatedCompletion?: string;
  cost: number;
  comments: TicketComment[];
}

// Filtros interface - preparado para backend
interface TicketFilters {
  search: string;
  status: string[];
  category: string[];
  priority: string[];
  condominium: string[];
  apartment: string[];
  assignedTo: string[];
  dateRange: {
    start?: string;
    end?: string;
  };
}

// Constantes para filtros - dados que virão do backend
const FILTER_OPTIONS = {
  status: ["Aberto", "Em Andamento", "Aguardando Orçamento", "Concluído"],
  category: ["Hidráulica", "Elétrica", "Segurança", "Climatização", "Tecnologia", "Manutenção", "Limpeza"],
  priority: ["Baixa", "Média", "Alta"],
  condominium: [
    "Condomínio Santos Dumont",
    "Condomínio Vila Rica", 
    "Condomínio Artagus",
    "Condomínio Cachoeira Dourada"
  ],
  apartment: ["101", "102", "103", "201", "202", "203", "301", "302", "303", "401", "402", "403"]
};

export default function TicketsPage() {
  // Estados para filtros
  const [filters, setFilters] = useState<TicketFilters>({
    search: "",
    status: [],
    category: [],
    priority: [],
    condominium: [],
    apartment: [],
    assignedTo: [],
    dateRange: {}
  });

  // Estados para modal de visualização
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Função para abrir modal de visualização
  const openViewModal = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  // Função para abrir modal de edição
  const openEditModal = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  // Função para fechar modais
  const closeModals = () => {
    setSelectedTicket(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Funções para ações dos tickets
  const handleDeleteTicket = (ticket: TicketData) => {
    if (confirm(`Tem certeza que deseja excluir o ticket "${ticket.title}"?`)) {
      // TODO: Implementar exclusão via action
      console.log('Excluindo ticket:', ticket.id);
    }
  };

  const handleDuplicateTicket = (ticket: TicketData) => {
    // TODO: Implementar duplicação via action
    console.log('Duplicando ticket:', ticket.id);
  };

  // Dados simulados de chamados baseados nos condomínios reais
  const allTickets: TicketData[] = [
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

  // Função para filtrar tickets - preparada para integração com backend
  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => {
      // Filtro de pesquisa por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.resident.toLowerCase().includes(searchLower) ||
          ticket.apartment.toLowerCase().includes(searchLower) ||
          ticket.condominium.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por status
      if (filters.status.length > 0 && !filters.status.includes(ticket.status)) {
        return false;
      }

      // Filtro por categoria
      if (filters.category.length > 0 && !filters.category.includes(ticket.category)) {
        return false;
      }

      // Filtro por prioridade
      if (filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
        return false;
      }

      // Filtro por condomínio
      if (filters.condominium.length > 0 && !filters.condominium.includes(ticket.condominium)) {
        return false;
      }

      // Filtro por apartamento
      if (filters.apartment.length > 0 && !filters.apartment.includes(ticket.apartment)) {
        return false;
      }

      // TODO: Filtro por data (quando integrar com backend)
      // if (filters.dateRange.start || filters.dateRange.end) {
      //   // Implementar filtro por data
      // }

      return true;
    });
  }, [allTickets, filters]);

  // Funções para manipular filtros
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const toggleFilterOption = (filterType: keyof typeof FILTER_OPTIONS, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilter = (filterType: keyof typeof FILTER_OPTIONS) => {
    setFilters(prev => ({ ...prev, [filterType]: [] }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      status: [],
      category: [],
      priority: [],
      condominium: [],
      apartment: [],
      assignedTo: [],
      dateRange: {}
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Aguardando Orçamento":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Crítica":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Alta":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Média":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Baixa":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
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
            <h1 className="text-3xl font-bold text-foreground">Chamados</h1>
            <p className="text-muted-foreground mt-1">
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
              <div className="text-2xl font-bold">{filteredTickets.length}</div>
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
                {filteredTickets.filter(ticket => ticket.status === "Em Andamento").length}
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
                {filteredTickets.filter(ticket => ticket.status === "Concluído").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredTickets.length > 0 ? ((filteredTickets.filter(ticket => ticket.status === "Concluído").length / filteredTickets.length) * 100).toFixed(1) : 0}% do total
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
                {formatCurrency(filteredTickets.reduce((total: number, ticket: TicketData) => total + ticket.cost, 0))}
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
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar chamados..."
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Status {filters.status.length > 0 && `(${filters.status.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.status.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('status', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.status.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.status.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('status')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Condomínio {filters.condominium.length > 0 && `(${filters.condominium.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.condominium.map((option: string) => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('condominium', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.condominium.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.condominium.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('condominium')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Prioridade {filters.priority.length > 0 && `(${filters.priority.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.priority.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('priority', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.priority.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.priority.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('priority')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Categoria {filters.category.length > 0 && `(${filters.category.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.category.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('category', option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        {filters.category.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.category.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('category')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Apartamento {filters.apartment.length > 0 && `(${filters.apartment.length})`}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {FILTER_OPTIONS.apartment.map(option => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => toggleFilterOption('apartment', option)}
                        className="flex items-center justify-between"
                      >
                        <span>Apt {option}</span>
                        {filters.apartment.includes(option) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                    {filters.apartment.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearFilter('apartment')}>
                          <X className="h-4 w-4 mr-2" />
                          Limpar seleção
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
          </CardContent>
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
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-6 lg:gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {getCategoryIcon(ticket.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{ticket.condominium}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{ticket.apartment}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="truncate">{ticket.resident}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{ticket.residentPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Categoria:</span> {ticket.category}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Responsável:</span> {ticket.assignedTo || "Não atribuído"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Criado: {formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Previsão:</span> {ticket.estimatedCompletion ? new Date(ticket.estimatedCompletion).toLocaleDateString('pt-BR') : 'Não definida'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Custo:</span> {formatCurrency(ticket.cost)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.comments.length} comentários</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => openViewModal(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openEditModal(ticket)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTicket(ticket)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTicket(ticket)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Visualização de Ticket */}
        {isViewModalOpen && selectedTicket && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModals}
          >
            <div 
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header do Modal */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {getCategoryIcon(selectedTicket.category)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
                      <p className="text-muted-foreground">#{selectedTicket.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={closeModals}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Coluna Principal - Detalhes */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Informações Básicas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Detalhes do Chamado</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="font-medium text-sm">Descrição</label>
                          <p className="text-muted-foreground mt-1">{selectedTicket.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-medium text-sm">Categoria</label>
                            <p className="text-muted-foreground mt-1">{selectedTicket.category}</p>
                          </div>
                          <div>
                            <label className="font-medium text-sm">Prioridade</label>
                            <Badge className={`mt-1 ${getPriorityColor(selectedTicket.priority)}`}>
                              {selectedTicket.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-medium text-sm">Status</label>
                            <Badge className={`mt-1 ${getStatusColor(selectedTicket.status)}`}>
                              {selectedTicket.status}
                            </Badge>
                          </div>
                          <div>
                            <label className="font-medium text-sm">Custo Estimado</label>
                            <p className="text-muted-foreground mt-1">{formatCurrency(selectedTicket.cost)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-medium text-sm">Data de Criação</label>
                            <p className="text-muted-foreground mt-1">{formatDate(selectedTicket.createdAt)}</p>
                          </div>
                          <div>
                            <label className="font-medium text-sm">Última Atualização</label>
                            <p className="text-muted-foreground mt-1">{formatDate(selectedTicket.updatedAt)}</p>
                          </div>
                        </div>
                        
                        {selectedTicket.estimatedCompletion && (
                          <div>
                            <label className="font-medium text-sm">Previsão de Conclusão</label>
                            <p className="text-muted-foreground mt-1">{formatDate(selectedTicket.estimatedCompletion)}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Localização */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Localização</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-medium text-sm">Condomínio</label>
                            <p className="text-muted-foreground mt-1">{selectedTicket.condominium}</p>
                          </div>
                          <div>
                            <label className="font-medium text-sm">Apartamento</label>
                            <p className="text-muted-foreground mt-1">{selectedTicket.apartment || 'Área comum'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comentários */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Comentários ({selectedTicket.comments.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedTicket.comments.map((comment, index) => (
                            <div key={index} className="border-l-4 border-primary pl-4 py-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{comment.author}</span>
                                <span className="text-sm text-muted-foreground">{formatDate(comment.date)}</span>
                              </div>
                              <p className="text-muted-foreground">{comment.text}</p>
                            </div>
                          ))}
                          {selectedTicket.comments.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">Nenhum comentário ainda</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Coluna Lateral - Informações do Solicitante e Ações */}
                  <div className="space-y-6">
                    {/* Solicitante */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Solicitante</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedTicket.resident}</p>
                            <p className="text-sm text-muted-foreground">Solicitante</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedTicket.residentPhone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{selectedTicket.residentEmail}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Responsável */}
                    {selectedTicket.assignedTo && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Responsável</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{selectedTicket.assignedTo}</p>
                              <p className="text-sm text-muted-foreground">Técnico responsável</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Ações */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ações</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Chamado
                        </Button>
                        <Button className="w-full" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Adicionar Comentário
                        </Button>
                        {selectedTicket.status === 'Aberto' && (
                          <Button className="w-full" variant="default">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Resolvido
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm font-medium">Chamado criado</p>
                              <p className="text-xs text-muted-foreground">{formatDate(selectedTicket.createdAt)}</p>
                            </div>
                          </div>
                          {selectedTicket.comments.map((comment, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                              <div>
                                <p className="text-sm font-medium">Comentário por {comment.author}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Botões do Modal */}
                <div className="flex justify-end space-x-2 mt-6 px-6 pb-6">
                  <Button variant="outline" onClick={closeModals}>
                    Fechar
                  </Button>
                  <Button onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edição */}
        {isEditModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Editar Ticket</h2>
                <Button variant="ghost" onClick={closeModals}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Título</label>
                  <input 
                    type="text"
                    defaultValue={selectedTicket.title}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição</label>
                  <textarea 
                    defaultValue={selectedTicket.description}
                    rows={3}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select 
                      defaultValue={selectedTicket.status}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Aberto">Aberto</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Aguardando Orçamento">Aguardando Orçamento</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prioridade</label>
                    <select 
                      defaultValue={selectedTicket.priority}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <select 
                      defaultValue={selectedTicket.category}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Hidráulica">Hidráulica</option>
                      <option value="Elétrica">Elétrica</option>
                      <option value="Segurança">Segurança</option>
                      <option value="Climatização">Climatização</option>
                      <option value="Tecnologia">Tecnologia</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Limpeza">Limpeza</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Condomínio</label>
                    <input 
                      type="text"
                      defaultValue={selectedTicket.condominium}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Apartamento</label>
                    <input 
                      type="text"
                      defaultValue={selectedTicket.apartment}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Morador</label>
                    <input 
                      type="text"
                      defaultValue={selectedTicket.resident}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Telefone</label>
                    <input 
                      type="text"
                      defaultValue={selectedTicket.residentPhone}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input 
                      type="email"
                      defaultValue={selectedTicket.residentEmail}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Responsável</label>
                    <input 
                      type="text"
                      defaultValue={selectedTicket.assignedTo || ""}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custo Estimado</label>
                    <input 
                      type="number"
                      step="0.01"
                      defaultValue={selectedTicket.cost}
                      className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Previsão de Conclusão</label>
                  <input 
                    type="date"
                    defaultValue={selectedTicket.estimatedCompletion || ""}
                    className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </form>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  // TODO: Implementar salvamento via action
                  console.log('Salvando ticket editado');
                  closeModals();
                }}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
