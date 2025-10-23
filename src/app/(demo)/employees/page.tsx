"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Shield,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  MapPin
} from "lucide-react";

export default function EmployeesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Dados simulados de funcionários baseados nos condomínios reais
  const employees = [
    {
      id: 1,
      name: "João Silva",
      role: "Porteiro",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      email: "joao.silva@santosdumont.com.br",
      phone: "(21) 98765-4321",
      document: "123.456.789-00",
      salary: 2500,
      status: "Ativo",
      admissionDate: "2022-01-15",
      shift: "Manhã (06:00-14:00)",
      address: "Rua das Flores, 123 - Jacarepaguá, RJ",
      emergencyContact: "Maria Silva - (21) 99999-8888",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 2,
      name: "Carlos Santos",
      role: "Síndico Profissional",
      condominium: "Condomínio Santos Dumont",
      condominiumId: 1,
      email: "carlos.santos@santosdumont.com.br",
      phone: "(21) 98765-1234",
      document: "987.654.321-00",
      salary: 8500,
      status: "Ativo",
      admissionDate: "2018-03-15",
      shift: "Comercial (08:00-18:00)",
      address: "Rua Principal, 456 - Barra da Tijuca, RJ",
      emergencyContact: "Ana Santos - (21) 99999-7777",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde", "Participação nos Lucros"]
    },
    {
      id: 3,
      name: "Ana Paula Griffe",
      role: "Administradora",
      condominium: "Condomínio Griffe",
      condominiumId: 2,
      email: "ana.griffe@griffe.com.br",
      phone: "(21) 98765-5678",
      document: "456.789.123-00",
      salary: 7200,
      status: "Ativo",
      admissionDate: "2019-08-22",
      shift: "Comercial (09:00-18:00)",
      address: "Rua da Passagem, 200 - Botafogo, RJ",
      emergencyContact: "Paulo Griffe - (21) 99999-6666",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 4,
      name: "Pedro Oliveira",
      role: "Zelador",
      condominium: "Condomínio Griffe",
      condominiumId: 2,
      email: "pedro.oliveira@griffe.com.br",
      phone: "(21) 98765-9876",
      document: "789.123.456-00",
      salary: 2200,
      status: "Ativo",
      admissionDate: "2021-05-10",
      shift: "Tarde (14:00-22:00)",
      address: "Rua do Trabalho, 789 - Botafogo, RJ",
      emergencyContact: "Rosa Oliveira - (21) 99999-5555",
      benefits: ["Vale Transporte", "Vale Alimentação"]
    },
    {
      id: 5,
      name: "Roberto Artagus",
      role: "Síndico",
      condominium: "Condomínio Artagus",
      condominiumId: 3,
      email: "roberto.artagus@artagus.com.br",
      phone: "(21) 98765-2468",
      document: "321.654.987-00",
      salary: 6800,
      status: "Ativo",
      admissionDate: "2017-11-10",
      shift: "Flexível",
      address: "Rua Santa Clara, 200 - Copacabana, RJ",
      emergencyContact: "Helena Artagus - (21) 99999-4444",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 6,
      name: "José Ferreira",
      role: "Porteiro Noturno",
      condominium: "Condomínio Artagus",
      condominiumId: 3,
      email: "jose.ferreira@artagus.com.br",
      phone: "(21) 98765-1357",
      document: "654.321.789-00",
      salary: 2800,
      status: "Ativo",
      admissionDate: "2020-02-20",
      shift: "Noite (22:00-06:00)",
      address: "Rua da Paz, 321 - Copacabana, RJ",
      emergencyContact: "Antônia Ferreira - (21) 99999-3333",
      benefits: ["Vale Transporte", "Vale Alimentação", "Adicional Noturno"]
    },
    {
      id: 7,
      name: "Maria Cachoeira",
      role: "Gerente Predial",
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      email: "maria.cachoeira@cachoeiraourada.com.br",
      phone: "(21) 98765-8642",
      document: "147.258.369-00",
      salary: 7500,
      status: "Ativo",
      admissionDate: "2020-05-20",
      shift: "Comercial (08:00-17:00)",
      address: "Avenida Rainha Elizabeth, 200 - Ipanema, RJ",
      emergencyContact: "João Cachoeira - (21) 99999-2222",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde", "Carro da Empresa"]
    },
    {
      id: 8,
      name: "Paulo Santos",
      role: "Manutenção",
      condominium: "Condomínio Cachoeira Dourada",
      condominiumId: 4,
      email: "paulo.santos@cachoeiraourada.com.br",
      phone: "(21) 98765-7531",
      document: "258.369.147-00",
      salary: 3200,
      status: "Ativo",
      admissionDate: "2021-08-15",
      shift: "Manhã (07:00-16:00)",
      address: "Rua das Oficinas, 654 - Ipanema, RJ",
      emergencyContact: "Sandra Santos - (21) 99999-1111",
      benefits: ["Vale Transporte", "Vale Alimentação", "Periculosidade"]
    },
    {
      id: 9,
      name: "João Recanto",
      role: "Administrador",
      condominium: "Condomínio Recanto",
      condominiumId: 5,
      email: "joao.recanto@recanto.com.br",
      phone: "(21) 98765-9513",
      document: "369.147.258-00",
      salary: 6200,
      status: "Ativo",
      admissionDate: "2021-01-15",
      shift: "Comercial (09:00-18:00)",
      address: "Rua Visconde de Silva, 150 - Humaitá, RJ",
      emergencyContact: "Carla Recanto - (21) 99999-0000",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 10,
      name: "Fernanda Vivenda",
      role: "Síndica Profissional",
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      email: "fernanda.vivenda@vivenda.com.br",
      phone: "(21) 98765-7419",
      document: "741.852.963-00",
      salary: 9200,
      status: "Ativo",
      admissionDate: "2018-09-10",
      shift: "Comercial (08:00-18:00)",
      address: "Avenida Afrânio de Melo Franco, 100 - Leblon, RJ",
      emergencyContact: "Roberto Vivenda - (21) 98888-9999",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde", "Participação nos Lucros"]
    },
    {
      id: 11,
      name: "Ricardo Mendes",
      role: "Supervisor de Segurança",
      condominium: "Condomínio Vivenda",
      condominiumId: 6,
      email: "ricardo.mendes@vivenda.com.br",
      phone: "(21) 98765-8520",
      document: "852.963.741-00",
      salary: 4500,
      status: "Ativo",
      admissionDate: "2019-11-05",
      shift: "Flexível",
      address: "Rua General Venâncio, 987 - Leblon, RJ",
      emergencyContact: "Lucia Mendes - (21) 98888-8888",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 12,
      name: "Pedro Ocaporan",
      role: "Zelador Geral",
      condominium: "Condomínio OCAPORAN",
      condominiumId: 7,
      email: "pedro.ocaporan@ocaporan.com.br",
      phone: "(21) 98765-9630",
      document: "963.741.852-00",
      salary: 2900,
      status: "Ativo",
      admissionDate: "2019-12-05",
      shift: "Manhã (06:00-14:00)",
      address: "Rua Rias da Rocha, 50 - Copacabana, RJ",
      emergencyContact: "Teresa Ocaporan - (21) 98888-7777",
      benefits: ["Vale Transporte", "Vale Alimentação"]
    },
    {
      id: 13,
      name: "Luiza Romeu",
      role: "Administradora",
      condominium: "Condomínio Romeu",
      condominiumId: 8,
      email: "luiza.romeu@romeu.com.br",
      phone: "(21) 98765-1472",
      document: "159.753.486-00",
      salary: 6800,
      status: "Ativo",
      admissionDate: "2020-03-18",
      shift: "Comercial (08:30-17:30)",
      address: "Rua Cinco de Julho, 300 - Copacabana, RJ",
      emergencyContact: "Carlos Romeu - (21) 98888-6666",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 14,
      name: "Ricardo Albuquerque",
      role: "Síndico",
      condominium: "Condomínio Visconde Albuquerque",
      condominiumId: 9,
      email: "ricardo.albuquerque@viscondalbuquerque.com.br",
      phone: "(21) 98765-3698",
      document: "753.486.159-00",
      salary: 7800,
      status: "Ativo",
      admissionDate: "2019-07-22",
      shift: "Comercial (09:00-18:00)",
      address: "Avenida Visconde de Albuquerque, 500 - Leblon, RJ",
      emergencyContact: "Beatriz Albuquerque - (21) 98888-5555",
      benefits: ["Vale Transporte", "Vale Alimentação", "Plano de Saúde"]
    },
    {
      id: 15,
      name: "Amanda Costa",
      role: "Limpeza",
      condominium: "Condomínio Visconde Albuquerque",
      condominiumId: 9,
      email: "amanda.costa@viscondalbuquerque.com.br",
      phone: "(21) 98765-4785",
      document: "486.159.753-00",
      salary: 1800,
      status: "Ativo",
      admissionDate: "2022-04-10",
      shift: "Manhã (06:00-14:00)",
      address: "Rua Bartolomeu Mitre, 789 - Leblon, RJ",
      emergencyContact: "Marcos Costa - (21) 98888-4444",
      benefits: ["Vale Transporte", "Vale Alimentação"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "text-green-600 bg-green-100";
      case "Inativo":
        return "text-red-600 bg-red-100";
      case "Licença":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Síndico":
      case "Síndica":
      case "Síndico Profissional":
      case "Síndica Profissional":
        return "text-purple-600 bg-purple-100";
      case "Administrador":
      case "Administradora":
      case "Gerente Predial":
        return "text-blue-600 bg-blue-100";
      case "Porteiro":
      case "Porteiro Noturno":
        return "text-orange-600 bg-orange-100";
      case "Zelador":
      case "Zelador Geral":
        return "text-green-600 bg-green-100";
      case "Manutenção":
        return "text-yellow-600 bg-yellow-100";
      case "Limpeza":
        return "text-cyan-600 bg-cyan-100";
      case "Supervisor de Segurança":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salary);
  };

  return (
    <ContentLayout title="Funcionários">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os funcionários dos condomínios
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Funcionário</DialogTitle>
                <DialogDescription>
                  Adicione um novo funcionário ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="emp-name">Nome Completo *</Label>
                  <Input id="emp-name" placeholder="João Silva" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo *</Label>
                    <Input id="role" placeholder="Porteiro, Zelador..." required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emp-phone">Telefone *</Label>
                    <Input id="emp-phone" placeholder="(00) 00000-0000" required />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={() => setDialogOpen(false)}>Criar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {employees.filter(emp => emp.status === "Ativo").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {((employees.filter(emp => emp.status === "Ativo").length / employees.length) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Folha de Pagamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatSalary(employees.reduce((total, emp) => total + emp.salary, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Total mensal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Condomínios Atendidos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(employees.map(emp => emp.condominiumId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Diferentes unidades
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
                    placeholder="Buscar funcionários..."
                    className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-input"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Funcionários</CardTitle>
            <CardDescription>
              Todos os funcionários cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors dark:border-border"
                >
                  <div className="flex-1 space-y-3 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-4">
                    <div className="lg:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{employee.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(employee.role)}>
                              {employee.role}
                            </Badge>
                            <Badge className={getStatusColor(employee.status)}>
                              {employee.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{employee.condominium}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{employee.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Admissão: {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Salário:</span> {formatSalary(employee.salary)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Turno:</span> {employee.shift}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{employee.address}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">CPF:</span> {employee.document}
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
