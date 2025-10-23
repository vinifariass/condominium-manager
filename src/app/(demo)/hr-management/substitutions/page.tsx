"use client";

import React, { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  Plus,
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Settings,
  Edit,
  Trash2,
  Eye,
  Users,
  CalendarDays
} from "lucide-react";

// Interfaces
interface Substitution {
  id: string;
  originalEmployeeId: string;
  originalEmployeeName: string;
  originalEmployeeRole: string;
  substituteEmployeeId: string;
  substituteEmployeeName: string;
  substituteEmployeeRole: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night' | 'full';
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

interface SubstitutionFormData {
  originalEmployeeId: string;
  substituteEmployeeId: string;
  date: string;
  shift: string;
  reason: string;
  notes: string;
}

export default function SubstitutionsPage() {
  // Estados
  const [substitutions, setSubstitutions] = useState<Substitution[]>([
    {
      id: '1',
      originalEmployeeId: '1',
      originalEmployeeName: 'João Silva',
      originalEmployeeRole: 'Porteiro',
      substituteEmployeeId: '3',
      substituteEmployeeName: 'Carlos Oliveira',
      substituteEmployeeRole: 'Porteiro',
      date: '2024-08-05',
      shift: 'morning',
      reason: 'Atestado médico',
      status: 'completed',
      notes: 'Substituição realizada com sucesso',
      createdAt: '2024-08-01T10:00:00',
      confirmedAt: '2024-08-01T11:30:00',
      completedAt: '2024-08-05T18:00:00'
    },
    {
      id: '2',
      originalEmployeeId: '2',
      originalEmployeeName: 'Maria Santos',
      originalEmployeeRole: 'Faxineira',
      substituteEmployeeId: '4',
      substituteEmployeeName: 'Ana Costa',
      substituteEmployeeRole: 'Faxineira',
      date: '2024-08-06',
      shift: 'full',
      reason: 'Consulta médica',
      status: 'confirmed',
      notes: 'Substituição confirmada, Ana Costa ciente dos procedimentos',
      createdAt: '2024-08-04T14:30:00',
      confirmedAt: '2024-08-04T15:00:00'
    },
    {
      id: '3',
      originalEmployeeId: '5',
      originalEmployeeName: 'Pedro Lima',
      originalEmployeeRole: 'Segurança',
      substituteEmployeeId: '6',
      substituteEmployeeName: 'Roberto Santos',
      substituteEmployeeRole: 'Segurança',
      date: '2024-08-07',
      shift: 'night',
      reason: 'Emergência familiar',
      status: 'pending',
      notes: 'Aguardando confirmação do substituto',
      createdAt: '2024-08-05T16:45:00'
    },
    {
      id: '4',
      originalEmployeeId: '1',
      originalEmployeeName: 'João Silva',
      originalEmployeeRole: 'Porteiro',
      substituteEmployeeId: '3',
      substituteEmployeeName: 'Carlos Oliveira',
      substituteEmployeeRole: 'Porteiro',
      date: '2024-08-08',
      shift: 'afternoon',
      reason: 'Férias',
      status: 'pending',
      createdAt: '2024-08-05T09:15:00'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubstitution, setSelectedSubstitution] = useState<Substitution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Formulário
  const [formData, setFormData] = useState<SubstitutionFormData>({
    originalEmployeeId: '',
    substituteEmployeeId: '',
    date: '',
    shift: '',
    reason: '',
    notes: ''
  });

  // Lista de funcionários mock
  const employees = [
    { id: '1', name: 'João Silva', role: 'Porteiro' },
    { id: '2', name: 'Maria Santos', role: 'Faxineira' },
    { id: '3', name: 'Carlos Oliveira', role: 'Porteiro' },
    { id: '4', name: 'Ana Costa', role: 'Faxineira' },
    { id: '5', name: 'Pedro Lima', role: 'Segurança' },
    { id: '6', name: 'Roberto Santos', role: 'Segurança' },
    { id: '7', name: 'Lucia Ferreira', role: 'Recepcionista' }
  ];

  const shifts = [
    { value: 'morning', label: 'Manhã (06:00-14:00)' },
    { value: 'afternoon', label: 'Tarde (14:00-22:00)' },
    { value: 'night', label: 'Noite (22:00-06:00)' },
    { value: 'full', label: 'Integral (08:00-17:00)' }
  ];

  // Handlers
  const handleInputChange = (field: keyof SubstitutionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSubstitution = () => {
    if (!formData.originalEmployeeId || !formData.substituteEmployeeId || !formData.date || !formData.shift || !formData.reason) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const originalEmployee = employees.find(e => e.id === formData.originalEmployeeId);
    const substituteEmployee = employees.find(e => e.id === formData.substituteEmployeeId);

    const newSubstitution: Substitution = {
      id: Date.now().toString(),
      originalEmployeeId: formData.originalEmployeeId,
      originalEmployeeName: originalEmployee?.name || '',
      originalEmployeeRole: originalEmployee?.role || '',
      substituteEmployeeId: formData.substituteEmployeeId,
      substituteEmployeeName: substituteEmployee?.name || '',
      substituteEmployeeRole: substituteEmployee?.role || '',
      date: formData.date,
      shift: formData.shift as any,
      reason: formData.reason,
      status: 'pending',
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    setSubstitutions([newSubstitution, ...substitutions]);
    
    // Reset form
    setFormData({
      originalEmployeeId: '',
      substituteEmployeeId: '',
      date: '',
      shift: '',
      reason: '',
      notes: ''
    });
    
    setIsCreateModalOpen(false);
  };

  const handleConfirmSubstitution = (id: string) => {
    setSubstitutions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: 'confirmed' as const, confirmedAt: new Date().toISOString() }
        : sub
    ));
  };

  const handleCompleteSubstitution = (id: string) => {
    setSubstitutions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: 'completed' as const, completedAt: new Date().toISOString() }
        : sub
    ));
  };

  const handleCancelSubstitution = (id: string) => {
    setSubstitutions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: 'cancelled' as const }
        : sub
    ));
  };

  const handleDeleteSubstitution = (id: string) => {
    setSubstitutions(prev => prev.filter(sub => sub.id !== id));
  };

  const handleViewSubstitution = (substitution: Substitution) => {
    setSelectedSubstitution(substitution);
    setIsViewModalOpen(true);
  };

  // Filtros
  const filteredSubstitutions = useMemo(() => {
    return substitutions.filter(sub => {
      const matchesSearch = searchTerm === '' || 
        sub.originalEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.substituteEmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const subDate = new Date(sub.date);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            return subDate.toDateString() === now.toDateString();
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return subDate >= now && subDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            return subDate >= now && subDate <= monthFromNow;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [substitutions, searchTerm, statusFilter, dateFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = substitutions.length;
    const pending = substitutions.filter(s => s.status === 'pending').length;
    const confirmed = substitutions.filter(s => s.status === 'confirmed').length;
    const completed = substitutions.filter(s => s.status === 'completed').length;
    const cancelled = substitutions.filter(s => s.status === 'cancelled').length;
    
    return { total, pending, confirmed, completed, cancelled };
  }, [substitutions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmado</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>;
    }
  };

  const getShiftLabel = (shift: string) => {
    const shiftMap = {
      'morning': 'Manhã',
      'afternoon': 'Tarde',
      'night': 'Noite',
      'full': 'Integral'
    };
    return shiftMap[shift as keyof typeof shiftMap] || shift;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Obter funcionários compatíveis (mesmo role)
  const getCompatibleEmployees = (originalEmployeeId: string) => {
    const originalEmployee = employees.find(e => e.id === originalEmployeeId);
    if (!originalEmployee) return [];
    
    return employees.filter(e => 
      e.id !== originalEmployeeId && 
      e.role === originalEmployee.role
    );
  };

  return (
    <ContentLayout title="Substituições">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Substituições de Funcionários</h1>
            <p className="text-muted-foreground">
              Gerencie substituições e escalas de funcionários
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Substituição
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Todas as substituições
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando confirmação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground">
                Prontas para execução
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Finalizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <p className="text-xs text-muted-foreground">
                Não realizadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por funcionário, substituto ou motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Próxima Semana</SelectItem>
              <SelectItem value="month">Próximo Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Substituições */}
        <div className="grid gap-4">
          {filteredSubstitutions.map((substitution) => (
            <Card key={substitution.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-lg">
                          {substitution.originalEmployeeName} → {substitution.substituteEmployeeName}
                        </h3>
                      </div>
                      {getStatusBadge(substitution.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Funcionário Original:</span> {substitution.originalEmployeeName} ({substitution.originalEmployeeRole})</p>
                        <p><span className="font-medium text-foreground">Substituto:</span> {substitution.substituteEmployeeName} ({substitution.substituteEmployeeRole})</p>
                        <p><span className="font-medium text-foreground">Data:</span> {formatDate(substitution.date)}</p>
                        <p><span className="font-medium text-foreground">Turno:</span> {getShiftLabel(substitution.shift)}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Motivo:</span> {substitution.reason}</p>
                        <p><span className="font-medium text-foreground">Criado em:</span> {formatDateTime(substitution.createdAt)}</p>
                        {substitution.confirmedAt && (
                          <p><span className="font-medium text-foreground">Confirmado em:</span> {formatDateTime(substitution.confirmedAt)}</p>
                        )}
                        {substitution.completedAt && (
                          <p><span className="font-medium text-foreground">Concluído em:</span> {formatDateTime(substitution.completedAt)}</p>
                        )}
                      </div>
                    </div>

                    {substitution.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Observações:</span> {substitution.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSubstitution(substitution)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {substitution.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleConfirmSubstitution(substitution.id)}
                              className="text-blue-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelSubstitution(substitution.id)}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {substitution.status === 'confirmed' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleCompleteSubstitution(substitution.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Concluído
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteSubstitution(substitution.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSubstitutions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma substituição encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Tente ajustar os filtros de pesquisa'
                    : 'Agende a primeira substituição'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Substituição
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Criação */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agendar Substituição</DialogTitle>
              <DialogDescription>
                Agende uma substituição de funcionário para uma data específica
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Funcionário a ser substituído */}
              <div className="space-y-4">
                <h4 className="font-medium">Funcionário a ser Substituído</h4>
                <div>
                  <Label htmlFor="originalEmployee">Funcionário *</Label>
                  <Select 
                    value={formData.originalEmployeeId} 
                    onValueChange={(value) => {
                      handleInputChange('originalEmployeeId', value);
                      // Reset substituto quando muda o funcionário original
                      handleInputChange('substituteEmployeeId', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Funcionário substituto */}
              <div className="space-y-4">
                <h4 className="font-medium">Funcionário Substituto</h4>
                <div>
                  <Label htmlFor="substituteEmployee">Substituto *</Label>
                  <Select 
                    value={formData.substituteEmployeeId} 
                    onValueChange={(value) => handleInputChange('substituteEmployeeId', value)}
                    disabled={!formData.originalEmployeeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.originalEmployeeId 
                          ? "Selecione primeiro o funcionário original" 
                          : "Selecionar substituto"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {getCompatibleEmployees(formData.originalEmployeeId).map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.originalEmployeeId && getCompatibleEmployees(formData.originalEmployeeId).length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Nenhum funcionário compatível disponível (mesmo cargo)
                    </p>
                  )}
                </div>
              </div>

              {/* Data e turno */}
              <div className="space-y-4">
                <h4 className="font-medium">Data e Turno</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shift">Turno *</Label>
                    <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar turno" />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map(shift => (
                          <SelectItem key={shift.value} value={shift.value}>
                            {shift.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <Label htmlFor="reason">Motivo *</Label>
                <Input
                  id="reason"
                  placeholder="Ex: Atestado médico, férias, emergência familiar..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                />
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Instruções especiais para o substituto, informações importantes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateSubstitution} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Agendar Substituição
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            {selectedSubstitution && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes da Substituição</DialogTitle>
                  <DialogDescription>
                    Informações completas da substituição
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {selectedSubstitution.originalEmployeeName} → {selectedSubstitution.substituteEmployeeName}
                    </h3>
                    {getStatusBadge(selectedSubstitution.status)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Funcionário Original</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Nome:</span> {selectedSubstitution.originalEmployeeName}</p>
                        <p><span className="font-medium">Cargo:</span> {selectedSubstitution.originalEmployeeRole}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Funcionário Substituto</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Nome:</span> {selectedSubstitution.substituteEmployeeName}</p>
                        <p><span className="font-medium">Cargo:</span> {selectedSubstitution.substituteEmployeeRole}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Detalhes da Substituição</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Data:</span> {formatDate(selectedSubstitution.date)}</p>
                      <p><span className="font-medium">Turno:</span> {getShiftLabel(selectedSubstitution.shift)}</p>
                      <p><span className="font-medium">Motivo:</span> {selectedSubstitution.reason}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Histórico</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Criado em:</span> {formatDateTime(selectedSubstitution.createdAt)}</p>
                      {selectedSubstitution.confirmedAt && (
                        <p><span className="font-medium">Confirmado em:</span> {formatDateTime(selectedSubstitution.confirmedAt)}</p>
                      )}
                      {selectedSubstitution.completedAt && (
                        <p><span className="font-medium">Concluído em:</span> {formatDateTime(selectedSubstitution.completedAt)}</p>
                      )}
                    </div>
                  </div>
                  
                  {selectedSubstitution.notes && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Observações</h4>
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {selectedSubstitution.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsViewModalOpen(false)}
                      className="flex-1"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
