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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Plus,
  Calendar,
  Users,
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  AlertCircle,
  Clock,
  MoreVertical,
  FileCheck,
  FileX,
  CalendarDays,
  User,
  Building
} from "lucide-react";

// Interfaces
interface MedicalCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  doctorName: string;
  crm: string;
  document: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  rejectedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
  notes?: string;
  medicalCondition?: string;
  isRecurring: boolean;
  workRestrictions?: string;
}

export default function MedicalCertificatesPage() {
  // Estados
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'João Silva',
      employeeRole: 'Porteiro',
      startDate: '2024-08-01',
      endDate: '2024-08-03',
      days: 3,
      reason: 'Gripe e febre alta',
      doctorName: 'Dr. Carlos Santos',
      crm: 'CRM-SP 123456',
      document: 'atestado_joao_001.pdf',
      status: 'approved',
      submittedAt: '2024-07-31T10:00:00',
      approvedBy: 'Maria Administradora',
      approvedAt: '2024-07-31T14:30:00',
      notes: 'Atestado válido, funcionário retornou no dia 04/08',
      medicalCondition: 'Síndrome gripal',
      isRecurring: false
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Maria Santos',
      employeeRole: 'Faxineira',
      startDate: '2024-08-05',
      endDate: '2024-08-05',
      days: 1,
      reason: 'Consulta médica cardiologia',
      doctorName: 'Dr. Ana Silva',
      crm: 'CRM-SP 789123',
      document: 'atestado_maria_002.pdf',
      status: 'pending',
      submittedAt: '2024-08-04T14:30:00',
      medicalCondition: 'Consulta de rotina',
      isRecurring: false
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Pedro Lima',
      employeeRole: 'Zelador',
      startDate: '2024-07-28',
      endDate: '2024-08-10',
      days: 14,
      reason: 'Cirurgia de hérnia',
      doctorName: 'Dr. Roberto Costa',
      crm: 'CRM-RJ 456789',
      document: 'atestado_pedro_003.pdf',
      status: 'approved',
      submittedAt: '2024-07-25T09:15:00',
      approvedBy: 'Maria Administradora',
      approvedAt: '2024-07-25T16:20:00',
      notes: 'Cirurgia eletiva aprovada, retorno previsto para 11/08',
      medicalCondition: 'Pós-operatório de herniorrafia',
      isRecurring: false,
      workRestrictions: 'Não carregar peso superior a 5kg por 30 dias'
    },
    {
      id: '4',
      employeeId: '1',
      employeeName: 'João Silva',
      employeeRole: 'Porteiro',
      startDate: '2024-08-15',
      endDate: '2024-08-15',
      days: 1,
      reason: 'Exame médico admissional',
      doctorName: 'Dr. Fernando Oliveira',
      crm: 'CRM-SP 321654',
      document: 'atestado_joao_004.pdf',
      status: 'rejected',
      submittedAt: '2024-08-14T11:45:00',
      rejectedBy: 'Maria Administradora',
      rejectedAt: '2024-08-14T15:30:00',
      notes: 'Exame admissional não é considerado atestado médico válido',
      medicalCondition: 'Exame ocupacional',
      isRecurring: false
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<MedicalCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Formulário para novo atestado
  const [newCertificate, setNewCertificate] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    doctorName: '',
    crm: '',
    medicalCondition: '',
    workRestrictions: '',
    isRecurring: false,
    document: null as File | null
  });

  // Lista de funcionários mock
  const employees = [
    { id: '1', name: 'João Silva', role: 'Porteiro' },
    { id: '2', name: 'Maria Santos', role: 'Faxineira' },
    { id: '3', name: 'Pedro Lima', role: 'Zelador' },
    { id: '4', name: 'Ana Costa', role: 'Faxineira' },
    { id: '5', name: 'Carlos Oliveira', role: 'Porteiro' },
    { id: '6', name: 'Fernanda Silva', role: 'Recepcionista' }
  ];

  // Dados filtrados
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = searchTerm === '' || 
        cert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const today = new Date();
        const certDate = new Date(cert.startDate);
        
        switch (dateFilter) {
          case 'this_week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return certDate >= weekAgo;
          case 'this_month':
            return certDate.getMonth() === today.getMonth() && certDate.getFullYear() === today.getFullYear();
          case 'last_month':
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
            return certDate.getMonth() === lastMonth.getMonth() && certDate.getFullYear() === lastMonth.getFullYear();
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [certificates, searchTerm, statusFilter, dateFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = certificates.length;
    const pending = certificates.filter(c => c.status === 'pending').length;
    const approved = certificates.filter(c => c.status === 'approved').length;
    const rejected = certificates.filter(c => c.status === 'rejected').length;
    const totalDays = certificates.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.days, 0);
    
    return { total, pending, approved, rejected, totalDays };
  }, [certificates]);

  // Handlers
  const handleCreateCertificate = () => {
    if (!newCertificate.employeeId || !newCertificate.startDate || !newCertificate.endDate || !newCertificate.doctorName) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const employee = employees.find(e => e.id === newCertificate.employeeId);
    const startDate = new Date(newCertificate.startDate);
    const endDate = new Date(newCertificate.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const certificate: MedicalCertificate = {
      id: Date.now().toString(),
      employeeId: newCertificate.employeeId,
      employeeName: employee?.name || '',
      employeeRole: employee?.role || '',
      startDate: newCertificate.startDate,
      endDate: newCertificate.endDate,
      days,
      reason: newCertificate.reason,
      doctorName: newCertificate.doctorName,
      crm: newCertificate.crm,
      document: newCertificate.document?.name || 'documento.pdf',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      medicalCondition: newCertificate.medicalCondition,
      workRestrictions: newCertificate.workRestrictions,
      isRecurring: newCertificate.isRecurring
    };

    setCertificates([certificate, ...certificates]);
    setNewCertificate({
      employeeId: '',
      startDate: '',
      endDate: '',
      reason: '',
      doctorName: '',
      crm: '',
      medicalCondition: '',
      workRestrictions: '',
      isRecurring: false,
      document: null
    });
    setIsCreateModalOpen(false);
  };

  const handleApproveCertificate = (id: string) => {
    setCertificates(certificates.map(cert => 
      cert.id === id 
        ? { 
            ...cert, 
            status: 'approved' as const,
            approvedBy: 'Maria Administradora',
            approvedAt: new Date().toISOString()
          }
        : cert
    ));
  };

  const handleRejectCertificate = (id: string, notes: string = '') => {
    setCertificates(certificates.map(cert => 
      cert.id === id 
        ? { 
            ...cert, 
            status: 'rejected' as const,
            rejectedBy: 'Maria Administradora',
            rejectedAt: new Date().toISOString(),
            notes: notes || 'Atestado rejeitado'
          }
        : cert
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <ContentLayout title="Gestão de Atestados Médicos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Atestados Médicos</h1>
            <p className="text-muted-foreground">
              Gerencie atestados médicos dos funcionários do condomínio
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Atestado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Atestado Médico</DialogTitle>
                <DialogDescription>
                  Registre um novo atestado médico para um funcionário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Funcionário *</Label>
                  <Select value={newCertificate.employeeId} onValueChange={(value) => 
                    setNewCertificate({...newCertificate, employeeId: value})
                  }>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data Início *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newCertificate.startDate}
                      onChange={(e) => setNewCertificate({...newCertificate, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data Fim *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newCertificate.endDate}
                      onChange={(e) => setNewCertificate({...newCertificate, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo/Sintomas *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Ex: Gripe, febre alta, consulta médica..."
                    value={newCertificate.reason}
                    onChange={(e) => setNewCertificate({...newCertificate, reason: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="medicalCondition">Condição Médica (CID)</Label>
                  <Input
                    id="medicalCondition"
                    placeholder="Ex: J00 - Resfriado comum"
                    value={newCertificate.medicalCondition}
                    onChange={(e) => setNewCertificate({...newCertificate, medicalCondition: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Nome do Médico *</Label>
                    <Input
                      id="doctorName"
                      placeholder="Dr. João Silva"
                      value={newCertificate.doctorName}
                      onChange={(e) => setNewCertificate({...newCertificate, doctorName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crm">CRM</Label>
                    <Input
                      id="crm"
                      placeholder="CRM-SP 123456"
                      value={newCertificate.crm}
                      onChange={(e) => setNewCertificate({...newCertificate, crm: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workRestrictions">Restrições de Trabalho</Label>
                  <Textarea
                    id="workRestrictions"
                    placeholder="Ex: Não carregar peso, repouso relativo..."
                    value={newCertificate.workRestrictions}
                    onChange={(e) => setNewCertificate({...newCertificate, workRestrictions: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={newCertificate.isRecurring}
                    onChange={(e) => setNewCertificate({...newCertificate, isRecurring: e.target.checked})}
                    className="rounded border-border"
                  />
                  <Label htmlFor="isRecurring">Condição recorrente</Label>
                </div>

                <div>
                  <Label htmlFor="document">Documento do Atestado *</Label>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setNewCertificate({...newCertificate, document: e.target.files?.[0] || null})}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Aceito: PDF, JPG, PNG (máx. 5MB)
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateCertificate} className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Registrar Atestado
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">atestados registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">aguardando análise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">atestados válidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">atestados inválidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dias Afastados</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDays}</div>
              <p className="text-xs text-muted-foreground">dias aprovados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por funcionário, motivo ou médico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="this_week">Esta Semana</SelectItem>
              <SelectItem value="this_month">Este Mês</SelectItem>
              <SelectItem value="last_month">Mês Passado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Atestados */}
        <div className="space-y-4">
          {filteredCertificates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum atestado encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Não há atestados que correspondam aos filtros selecionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">{certificate.employeeName}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {certificate.employeeRole}
                        </Badge>
                        {getStatusBadge(certificate.status)}
                        {certificate.isRecurring && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Recorrente
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span><strong>Período:</strong> {formatDate(certificate.startDate)} até {formatDate(certificate.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span><strong>Dias:</strong> {certificate.days} dias</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span><strong>Motivo:</strong> {certificate.reason}</span>
                          </div>
                          {certificate.medicalCondition && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span><strong>CID:</strong> {certificate.medicalCondition}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span><strong>Médico:</strong> {certificate.doctorName}</span>
                          </div>
                          {certificate.crm && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span><strong>CRM:</strong> {certificate.crm}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span><strong>Enviado:</strong> {formatDateTime(certificate.submittedAt)}</span>
                          </div>
                          {certificate.approvedAt && (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span><strong>Aprovado:</strong> {formatDateTime(certificate.approvedAt)}</span>
                            </div>
                          )}
                          {certificate.rejectedAt && (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span><strong>Rejeitado:</strong> {formatDateTime(certificate.rejectedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {certificate.workRestrictions && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Restrições de Trabalho:</span>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            {certificate.workRestrictions}
                          </p>
                        </div>
                      )}

                      {certificate.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Observações:</strong> {certificate.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(certificate);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {certificate.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveCertificate(certificate.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectCertificate(certificate.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCertificate(certificate);
                            setIsViewModalOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Documento
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {certificate.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveCertificate(certificate.id)}>
                                <FileCheck className="h-4 w-4 mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRejectCertificate(certificate.id)}
                                className="text-red-600"
                              >
                                <FileX className="h-4 w-4 mr-2" />
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Atestado Médico</DialogTitle>
            </DialogHeader>
            {selectedCertificate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Funcionário</Label>
                    <p className="font-medium">{selectedCertificate.employeeName}</p>
                    <p className="text-muted-foreground">{selectedCertificate.employeeRole}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedCertificate.status)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Período de Afastamento</Label>
                    <p>{formatDate(selectedCertificate.startDate)} até {formatDate(selectedCertificate.endDate)}</p>
                    <p className="text-muted-foreground">{selectedCertificate.days} dias</p>
                  </div>
                  <div>
                    <Label>Médico Responsável</Label>
                    <p>{selectedCertificate.doctorName}</p>
                    {selectedCertificate.crm && <p className="text-muted-foreground">{selectedCertificate.crm}</p>}
                  </div>
                </div>

                <div>
                  <Label>Motivo/Sintomas</Label>
                  <p className="text-sm mt-1">{selectedCertificate.reason}</p>
                </div>

                {selectedCertificate.medicalCondition && (
                  <div>
                    <Label>Condição Médica (CID)</Label>
                    <p className="text-sm mt-1">{selectedCertificate.medicalCondition}</p>
                  </div>
                )}

                {selectedCertificate.workRestrictions && (
                  <div>
                    <Label>Restrições de Trabalho</Label>
                    <div className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {selectedCertificate.workRestrictions}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Documento</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedCertificate.document}</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {selectedCertificate.notes && (
                  <div>
                    <Label>Observações</Label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {selectedCertificate.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-4 border-t">
                  <p>Enviado em: {formatDateTime(selectedCertificate.submittedAt)}</p>
                  {selectedCertificate.approvedBy && selectedCertificate.approvedAt && (
                    <p>Aprovado por: {selectedCertificate.approvedBy} em {formatDateTime(selectedCertificate.approvedAt)}</p>
                  )}
                  {selectedCertificate.rejectedBy && selectedCertificate.rejectedAt && (
                    <p>Rejeitado por: {selectedCertificate.rejectedBy} em {formatDateTime(selectedCertificate.rejectedAt)}</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
