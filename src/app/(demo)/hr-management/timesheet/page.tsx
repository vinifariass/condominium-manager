"use client";

import React, { useState, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Clock,
  Plus,
  Calendar,
  Search,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  CalendarDays,
  TrendingUp
} from "lucide-react";

// Interfaces
interface TimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave' | 'incomplete';
  notes?: string;
}

interface TimeFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  breakStart: string;
  breakEnd: string;
  notes: string;
}

export default function TimesheetPage() {
  // Estados
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'João Silva',
      employeeRole: 'Porteiro',
      date: '2024-08-05',
      checkIn: '08:00',
      checkOut: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      status: 'present'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Maria Santos',
      employeeRole: 'Faxineira',
      date: '2024-08-05',
      checkIn: '08:15',
      checkOut: '17:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.25,
      regularHours: 8,
      overtimeHours: 0.25,
      status: 'late',
      notes: 'Atraso justificado - trânsito'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Carlos Oliveira',
      employeeRole: 'Porteiro',
      date: '2024-08-05',
      checkIn: '14:00',
      checkOut: '22:00',
      breakStart: '18:00',
      breakEnd: '19:00',
      totalHours: 7,
      regularHours: 7,
      overtimeHours: 0,
      status: 'present'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Ana Costa',
      employeeRole: 'Faxineira',
      date: '2024-08-05',
      checkIn: '08:00',
      checkOut: '16:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 7,
      regularHours: 7,
      overtimeHours: 0,
      status: 'early_leave',
      notes: 'Liberação antecipada - consulta médica'
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'Pedro Lima',
      employeeRole: 'Segurança',
      date: '2024-08-05',
      status: 'absent',
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      notes: 'Atestado médico'
    },
    {
      id: '6',
      employeeId: '6',
      employeeName: 'Roberto Santos',
      employeeRole: 'Segurança',
      date: '2024-08-05',
      checkIn: '22:00',
      breakStart: '02:00',
      breakEnd: '03:00',
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      status: 'incomplete',
      notes: 'Turno em andamento'
    },
    // Registros do dia anterior para comparação
    {
      id: '7',
      employeeId: '1',
      employeeName: 'João Silva',
      employeeRole: 'Porteiro',
      date: '2024-08-04',
      checkIn: '08:00',
      checkOut: '17:30',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8.5,
      regularHours: 8,
      overtimeHours: 0.5,
      status: 'present'
    },
    {
      id: '8',
      employeeId: '2',
      employeeName: 'Maria Santos',
      employeeRole: 'Faxineira',
      date: '2024-08-04',
      checkIn: '08:00',
      checkOut: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      status: 'present'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Formulário
  const [formData, setFormData] = useState<TimeFormData>({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    breakStart: '',
    breakEnd: '',
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

  // Função para calcular horas trabalhadas
  const calculateHours = (checkIn: string, checkOut: string, breakStart?: string, breakEnd?: string) => {
    if (!checkIn || !checkOut) return { totalHours: 0, regularHours: 0, overtimeHours: 0 };

    const timeIn = new Date(`1970-01-01T${checkIn}:00`);
    const timeOut = new Date(`1970-01-01T${checkOut}:00`);
    
    let workMinutes = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60);
    
    // Subtrair intervalo se especificado
    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`1970-01-01T${breakStart}:00`);
      const breakEndTime = new Date(`1970-01-01T${breakEnd}:00`);
      const breakMinutes = (breakEndTime.getTime() - breakStartTime.getTime()) / (1000 * 60);
      workMinutes -= breakMinutes;
    }

    const totalHours = Math.round((workMinutes / 60) * 100) / 100;
    const regularHours = Math.min(totalHours, 8);
    const overtimeHours = Math.max(totalHours - 8, 0);

    return { totalHours, regularHours, overtimeHours };
  };

  // Handlers
  const handleInputChange = (field: keyof TimeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateRecord = () => {
    if (!formData.employeeId || !formData.date) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const employee = employees.find(e => e.id === formData.employeeId);
    const { totalHours, regularHours, overtimeHours } = calculateHours(
      formData.checkIn, 
      formData.checkOut, 
      formData.breakStart, 
      formData.breakEnd
    );

    // Determinar status
    let status: TimeRecord['status'] = 'present';
    if (!formData.checkIn && !formData.checkOut) {
      status = 'absent';
    } else if (!formData.checkOut) {
      status = 'incomplete';
    } else {
      const checkInTime = new Date(`1970-01-01T${formData.checkIn}:00`);
      const expectedStart = new Date(`1970-01-01T08:00:00`);
      
      if (checkInTime > expectedStart) {
        status = 'late';
      }
      
      if (formData.checkOut && totalHours < 7) {
        status = 'early_leave';
      }
    }

    const newRecord: TimeRecord = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      employeeName: employee?.name || '',
      employeeRole: employee?.role || '',
      date: formData.date,
      checkIn: formData.checkIn || undefined,
      checkOut: formData.checkOut || undefined,
      breakStart: formData.breakStart || undefined,
      breakEnd: formData.breakEnd || undefined,
      totalHours,
      regularHours,
      overtimeHours,
      status,
      notes: formData.notes
    };

    setTimeRecords([newRecord, ...timeRecords]);
    
    // Reset form
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      breakStart: '',
      breakEnd: '',
      notes: ''
    });
    
    setIsCreateModalOpen(false);
  };

  // Filtros
  const filteredRecords = useMemo(() => {
    return timeRecords.filter(record => {
      const matchesSearch = searchTerm === '' || 
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const recordDate = new Date(record.date);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            return recordDate.toDateString() === now.toDateString();
          case 'yesterday':
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            return recordDate.toDateString() === yesterday.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return recordDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return recordDate >= monthAgo;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [timeRecords, searchTerm, statusFilter, dateFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = timeRecords.filter(r => r.date === today);
    
    const totalEmployees = employees.length;
    const present = todayRecords.filter(r => ['present', 'late', 'early_leave'].includes(r.status)).length;
    const absent = todayRecords.filter(r => r.status === 'absent').length;
    const incomplete = todayRecords.filter(r => r.status === 'incomplete').length;
    const totalHoursToday = todayRecords.reduce((acc, r) => acc + r.totalHours, 0);
    const totalOvertimeToday = todayRecords.reduce((acc, r) => acc + r.overtimeHours, 0);
    
    // Estatísticas do mês
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthRecords = timeRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
    });
    
    const totalOvertimeMonth = monthRecords.reduce((acc, r) => acc + r.overtimeHours, 0);
    
    return {
      totalEmployees,
      present,
      absent,
      incomplete,
      totalHoursToday: Math.round(totalHoursToday * 100) / 100,
      totalOvertimeToday: Math.round(totalOvertimeToday * 100) / 100,
      totalOvertimeMonth: Math.round(totalOvertimeMonth * 100) / 100
    };
  }, [timeRecords, employees]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Presente</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Ausente</Badge>;
      case 'late':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200"><AlertTriangle className="w-3 h-3 mr-1" />Atrasado</Badge>;
      case 'early_leave':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Timer className="w-3 h-3 mr-1" />Saída Antecipada</Badge>;
      case 'incomplete':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Em Andamento</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (time?: string) => {
    return time || '--:--';
  };

  return (
    <ContentLayout title="Controle de Ponto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Controle de Ponto</h1>
            <p className="text-muted-foreground">
              Gerencie a frequência e horas trabalhadas dos funcionários
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Ponto
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presentes Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <p className="text-xs text-muted-foreground">
                No local de trabalho
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausentes Hoje</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">
                Não compareceram
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.incomplete}</div>
              <p className="text-xs text-muted-foreground">
                Turno ativo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Hoje</CardTitle>
              <Timer className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalHoursToday}h</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalOvertimeToday}h extras
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Extras do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalOvertimeMonth}h</div>
              <p className="text-xs text-muted-foreground">
                Horas extras totais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar funcionário..."
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
              <SelectItem value="present">Presente</SelectItem>
              <SelectItem value="absent">Ausente</SelectItem>
              <SelectItem value="late">Atrasado</SelectItem>
              <SelectItem value="early_leave">Saída Antecipada</SelectItem>
              <SelectItem value="incomplete">Em Andamento</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="all">Todos os Períodos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Registros */}
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-lg">{record.employeeName}</h3>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Cargo:</span> {record.employeeRole}</p>
                        <p><span className="font-medium text-foreground">Data:</span> {formatDate(record.date)}</p>
                        <p><span className="font-medium text-foreground">Entrada:</span> {formatTime(record.checkIn)}</p>
                        <p><span className="font-medium text-foreground">Saída:</span> {formatTime(record.checkOut)}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Intervalo Início:</span> {formatTime(record.breakStart)}</p>
                        <p><span className="font-medium text-foreground">Intervalo Fim:</span> {formatTime(record.breakEnd)}</p>
                        <p><span className="font-medium text-foreground">Total Trabalhado:</span> {record.totalHours}h</p>
                        <p><span className="font-medium text-foreground">Horas Extras:</span> {record.overtimeHours}h</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Horas Regulares:</span> {record.regularHours}h</p>
                        {record.notes && (
                          <div className="mt-2">
                            <p className="font-medium text-foreground">Observações:</p>
                            <p className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'today'
                    ? 'Tente ajustar os filtros de pesquisa'
                    : 'Registre o primeiro ponto do dia'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && dateFilter === 'today' && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Ponto
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
              <DialogTitle>Registrar Ponto</DialogTitle>
              <DialogDescription>
                Registre os horários de trabalho de um funcionário
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Funcionário e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employee">Funcionário *</Label>
                  <Select 
                    value={formData.employeeId} 
                    onValueChange={(value) => handleInputChange('employeeId', value)}
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
                <div>
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>

              {/* Horários de Trabalho */}
              <div className="space-y-4">
                <h4 className="font-medium">Horários de Trabalho</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Entrada</Label>
                    <Input
                      id="checkIn"
                      type="time"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Saída</Label>
                    <Input
                      id="checkOut"
                      type="time"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Intervalo */}
              <div className="space-y-4">
                <h4 className="font-medium">Intervalo</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breakStart">Início do Intervalo</Label>
                    <Input
                      id="breakStart"
                      type="time"
                      value={formData.breakStart}
                      onChange={(e) => handleInputChange('breakStart', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="breakEnd">Fim do Intervalo</Label>
                    <Input
                      id="breakEnd"
                      type="time"
                      value={formData.breakEnd}
                      onChange={(e) => handleInputChange('breakEnd', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Preview de Horas */}
              {formData.checkIn && formData.checkOut && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Resumo de Horas</h4>
                  <div className="text-sm space-y-1">
                    {(() => {
                      const { totalHours, regularHours, overtimeHours } = calculateHours(
                        formData.checkIn, 
                        formData.checkOut, 
                        formData.breakStart, 
                        formData.breakEnd
                      );
                      return (
                        <>
                          <p className="text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Total Trabalhado:</span> {totalHours}h
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Horas Regulares:</span> {regularHours}h
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            <span className="font-medium">Horas Extras:</span> {overtimeHours}h
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  placeholder="Atraso justificado, liberação antecipada, etc..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateRecord} className="flex-1">
                  <Clock className="mr-2 h-4 w-4" />
                  Registrar Ponto
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
      </div>
    </ContentLayout>
  );
}
