"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MapPin,
  UserPlus,
  Edit,
  Shield,
  User
} from "lucide-react";

export default function ResidentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Dados simulados - substituir por dados reais da API
  const residents = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-9999",
      apartment: "101",
      block: "A",
      role: "Proprietário",
      status: "Ativo",
      avatar: null,
      cpf: "123.456.789-00",
      birthDate: "1985-03-15",
      createdAt: "2023-01-15"
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao@email.com", 
      phone: "(11) 88888-8888",
      apartment: "101",
      block: "A",
      role: "Dependente",
      status: "Ativo",
      avatar: null,
      cpf: "987.654.321-00",
      birthDate: "2010-08-22",
      createdAt: "2023-01-15"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "(11) 77777-7777",
      apartment: "201",
      block: "A", 
      role: "Proprietário",
      status: "Ativo",
      avatar: null,
      cpf: "456.789.123-00",
      birthDate: "1990-12-05",
      createdAt: "2023-02-20"
    },
    {
      id: 4,
      name: "Carlos Santos",
      email: "carlos@email.com",
      phone: "(11) 66666-6666",
      apartment: "302",
      block: "B",
      role: "Inquilino",
      status: "Ativo",
      avatar: null,
      cpf: "789.123.456-00",
      birthDate: "1982-07-10",
      createdAt: "2023-03-10"
    },
    {
      id: 5,
      name: "Julia Oliveira",
      email: "julia@email.com",
      phone: "(11) 55555-5555",
      apartment: "105",
      block: "A",
      role: "Proprietário",
      status: "Inativo",
      avatar: null,
      cpf: "321.654.987-00",
      birthDate: "1995-11-30",
      createdAt: "2023-01-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "text-green-600 bg-green-100";
      case "Inativo":
        return "text-red-600 bg-red-100";
      case "Pendente":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Proprietário":
        return "text-blue-600 bg-blue-100";
      case "Inquilino":
        return "text-purple-600 bg-purple-100";
      case "Dependente":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Proprietário":
        return <Shield className="h-3 w-3" />;
      case "Inquilino":
        return <User className="h-3 w-3" />;
      case "Dependente":
        return <UserPlus className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const activeResidents = residents.filter(r => r.status === "Ativo");
  const totalResidents = residents.length;
  const proprietarios = residents.filter(r => r.role === "Proprietário").length;
  const inquilinos = residents.filter(r => r.role === "Inquilino").length;

  return (
    <ContentLayout title="Moradores">
      <div className="space-y-6">
        {/* Header com Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResidents}</div>
              <p className="text-xs text-muted-foreground">
                {activeResidents.length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proprietários</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{proprietarios}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((proprietarios / totalResidents) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inquilinos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{inquilinos}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inquilinos / totalResidents) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dependentes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {residents.filter(r => r.role === "Dependente").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Menores e familiares
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gerenciamento de Moradores */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciar Moradores</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os moradores do condomínio
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Morador
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Novo Morador</DialogTitle>
                    <DialogDescription>
                      Adicione um novo morador ao condomínio
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="João Silva"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="joao@email.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="apartment">Apartamento *</Label>
                        <Input
                          id="apartment"
                          placeholder="101"
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
                  placeholder="Buscar por nome, email, apartamento..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Lista de Moradores */}
            <div className="space-y-4">
              {residents.map((resident) => (
                <div key={resident.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={resident.avatar || ""} />
                        <AvatarFallback>
                          {resident.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{resident.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRoleColor(resident.role)}`}>
                            {getRoleIcon(resident.role)}
                            <span>{resident.role}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.status)}`}>
                            {resident.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>Apt {resident.apartment} - Bloco {resident.block}</span>
                          </div>
                          {resident.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{resident.phone}</span>
                            </div>
                          )}
                          {resident.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{resident.email}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>CPF: {resident.cpf}</span>
                          <span className="ml-4">Nascimento: {new Date(resident.birthDate).toLocaleDateString('pt-BR')}</span>
                          <span className="ml-4">Cadastrado em: {new Date(resident.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
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
