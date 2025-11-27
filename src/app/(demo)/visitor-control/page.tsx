"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck,
  Users,
  Phone,
  MessageSquare,
  Bell,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Car,
  Package,
  Shield,
  Eye,
  Smartphone,
  MessageCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notificationService } from "@/lib/notification-service";

interface Visitor {
  id: number;
  name: string;
  phone: string;
  document: string;
  visitingResident: string;
  apartment: string;
  block: string;
  residentPhone: string;
  purpose: string;
  arrivalTime: Date;
  status: 'waiting' | 'authorized' | 'denied' | 'entered' | 'left';
  type: 'visitor' | 'delivery' | 'service';
  vehiclePlate?: string;
  company?: string;
}

export default function VisitorControlPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: 1,
      name: "Carlos Silva",
      phone: "(11) 99999-1111",
      document: "123.456.789-10",
      visitingResident: "Ana Santos",
      apartment: "101",
      block: "A",
      residentPhone: "(11) 98888-7777",
      purpose: "Visita pessoal",
      arrivalTime: new Date(),
      status: 'waiting',
      type: 'visitor'
    },
    {
      id: 2,
      name: "João Entregador",
      phone: "(11) 77777-5555",
      document: "987.654.321-00",
      visitingResident: "Maria Costa",
      apartment: "205",
      block: "B",
      residentPhone: "(11) 96666-4444",
      purpose: "Entrega de produtos",
      arrivalTime: new Date(Date.now() - 300000), // 5 minutos atrás
      status: 'waiting',
      type: 'delivery',
      company: "Correios"
    }
  ]);

  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    phone: "",
    document: "",
    visitingResident: "",
    apartment: "",
    block: "",
    residentPhone: "",
    purpose: "",
    type: 'visitor' as 'visitor' | 'delivery' | 'service',
    vehiclePlate: "",
    company: ""
  });

  // Simular chegada de visitante e enviar notificação
  const handleNotifyResident = async (visitor: Visitor) => {
    setIsLoading(visitor.id);

    try {
      if (visitor.type === 'visitor') {
        // Notificação para visitante comum
        await notificationService.notifyVisitorArrival(
          visitor.visitingResident,
          visitor.residentPhone,
          visitor.name,
          visitor.phone,
          "Condomínio Exemplo",
          `${visitor.apartment} - Bloco ${visitor.block}`
        );
      } else if (visitor.type === 'delivery') {
        // Notificação para entrega
        await notificationService.sendNotification({
          template: {
            id: 'delivery_arrival',
            name: 'Chegada de Entrega',
            sms: `Entrega para ${visitor.visitingResident} - Apt ${visitor.apartment}. Empresa: ${visitor.company}. Autorizar entrada?`,
            whatsapp: `📦 *Entrega Chegou!*\n\nPara: ${visitor.visitingResident}\nApartamento: ${visitor.apartment}\nEmpresa: ${visitor.company}\nDescrição: ${visitor.purpose}\n\nAutorizar entrada do entregador?`,
            variables: ['resident_name', 'apartment', 'delivery_company', 'description']
          },
          recipients: [{
            name: visitor.visitingResident,
            phone: visitor.residentPhone,
            apartment: visitor.apartment,
            preferredMethod: 'whatsapp'
          }],
          variables: {
            resident_name: visitor.visitingResident,
            apartment: visitor.apartment,
            delivery_company: visitor.company || 'N/A',
            description: visitor.purpose
          },
          priority: 'high'
        });
      }

      // Atualizar status do visitante
      setVisitors(prev => prev.map(v =>
        v.id === visitor.id
          ? { ...v, status: 'authorized' as const }
          : v
      ));

      console.log(`Notificação enviada para ${visitor.visitingResident}`);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    } finally {
      setIsLoading(null);
    }
  };

  // Registrar novo visitante
  const handleRegisterVisitor = async (e: React.FormEvent) => {
    e.preventDefault();

    const visitor: Visitor = {
      id: Date.now(),
      ...newVisitor,
      arrivalTime: new Date(),
      status: 'waiting'
    };

    setVisitors(prev => [visitor, ...prev]);

    // Enviar notificação automaticamente
    await handleNotifyResident(visitor);

    // Limpar formulário
    setNewVisitor({
      name: "",
      phone: "",
      document: "",
      visitingResident: "",
      apartment: "",
      block: "",
      residentPhone: "",
      purpose: "",
      type: 'visitor',
      vehiclePlate: "",
      company: ""
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case 'authorized':
        return <Badge className="bg-green-100 text-green-800">Autorizado</Badge>;
      case 'denied':
        return <Badge variant="destructive">Negado</Badge>;
      case 'entered':
        return <Badge className="bg-blue-100 text-blue-800">Entrada</Badge>;
      case 'left':
        return <Badge variant="outline">Saída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visitor':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'delivery':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'service':
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <ContentLayout title="Controle de Visitantes">
      <div className="space-y-6">
        {/* Header com estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{visitors.filter(v => v.status === 'waiting').length}</p>
                  <p className="text-xs text-muted-foreground">Aguardando</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{visitors.filter(v => v.status === 'authorized').length}</p>
                  <p className="text-xs text-muted-foreground">Autorizados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{visitors.length}</p>
                  <p className="text-xs text-muted-foreground">Total Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {visitors.filter(v =>
                      v.status === 'waiting' &&
                      (Date.now() - v.arrivalTime.getTime()) > 300000 // 5 minutos
                    ).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pendentes 5min+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de registro */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Novo Visitante</CardTitle>
            <CardDescription>
              Registre a chegada de visitantes, entregas ou prestadores de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterVisitor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={newVisitor.type}
                    onValueChange={(value) => setNewVisitor({ ...newVisitor, type: value as any })}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitor">Visitante</SelectItem>
                      <SelectItem value="delivery">Entrega</SelectItem>
                      <SelectItem value="service">Prestador de Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Nome do Visitante</label>
                  <input
                    type="text"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <input
                    type="tel"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Documento (CPF/RG)</label>
                  <input
                    type="text"
                    value={newVisitor.document}
                    onChange={(e) => setNewVisitor({ ...newVisitor, document: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Placa do Veículo (opcional)</label>
                  <input
                    type="text"
                    value={newVisitor.vehiclePlate}
                    onChange={(e) => setNewVisitor({ ...newVisitor, vehiclePlate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="ABC-1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Visitando (Morador)</label>
                  <input
                    type="text"
                    value={newVisitor.visitingResident}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitingResident: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Apartamento</label>
                  <input
                    type="text"
                    value={newVisitor.apartment}
                    onChange={(e) => setNewVisitor({ ...newVisitor, apartment: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bloco</label>
                  <input
                    type="text"
                    value={newVisitor.block}
                    onChange={(e) => setNewVisitor({ ...newVisitor, block: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tel. do Morador</label>
                  <input
                    type="tel"
                    value={newVisitor.residentPhone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, residentPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="(11) 98888-7777"
                    required
                  />
                </div>
              </div>

              {newVisitor.type === 'delivery' && (
                <div>
                  <label className="text-sm font-medium">Empresa/Transportadora</label>
                  <input
                    type="text"
                    value={newVisitor.company}
                    onChange={(e) => setNewVisitor({ ...newVisitor, company: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="Ex: Correios, Mercado Livre, etc."
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Motivo da Visita</label>
                <input
                  type="text"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Ex: Visita pessoal, entrega de produtos, etc."
                  required
                />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <UserCheck className="h-4 w-4 mr-2" />
                Registrar e Notificar Morador
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de visitantes */}
        <Card>
          <CardHeader>
            <CardTitle>Visitantes do Dia</CardTitle>
            <CardDescription>Lista de todos os visitantes registrados hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitors.map((visitor) => (
                <div key={visitor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(visitor.type)}
                      <div>
                        <h4 className="font-medium">{visitor.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {visitor.document} • {visitor.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(visitor.status)}
                      <span className="text-xs text-muted-foreground">
                        {visitor.arrivalTime.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Visitando:</span> {visitor.visitingResident}
                    </div>
                    <div>
                      <span className="font-medium">Apartamento:</span> {visitor.apartment} - Bloco {visitor.block}
                    </div>
                    <div>
                      <span className="font-medium">Motivo:</span> {visitor.purpose}
                    </div>
                  </div>

                  {visitor.company && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Empresa:</span> {visitor.company}
                    </div>
                  )}

                  {visitor.status === 'waiting' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleNotifyResident(visitor)}
                        disabled={isLoading === visitor.id}
                        className="flex items-center gap-2"
                      >
                        {isLoading === visitor.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        Notificar Morador
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setVisitors(prev =>
                          prev.map(v => v.id === visitor.id ? { ...v, status: 'authorized' } : v)
                        )}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Autorizar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setVisitors(prev =>
                          prev.map(v => v.id === visitor.id ? { ...v, status: 'denied' } : v)
                        )}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Negar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
