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
  Upload,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Settings,
  Edit,
  Trash2,
  FileCheck,
  FileX,
  CalendarDays
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
  document: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  doctorName?: string;
  crm?: string;
  medicalFacility?: string;
}

interface CertificateFormData {
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  doctorName: string;
  crm: string;
  medicalFacility: string;
  notes: string;
  document: File | null;
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
      reason: 'Gripe',
      document: 'atestado_joao_001.pdf',
      status: 'approved',
      submittedAt: '2024-07-31T10:00:00',
      approvedBy: 'Admin Sistema',
      doctorName: 'Dr. Carlos Santos',
      crm: '12345-SP',
      medicalFacility: 'Clínica São João',
      notes: 'Atestado válido, funcionário deve retornar após recuperação completa'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Maria Santos',
      employeeRole: 'Faxineira',
      startDate: '2024-08-05',
      endDate: '2024-08-05',
      days: 1,
      reason: 'Consulta médica',
      document: 'atestado_maria_002.pdf',
      status: 'pending',
      submittedAt: '2024-08-04T14:30:00',
      doctorName: 'Dra. Ana Lima',
      crm: '67890-SP',
      medicalFacility: 'Hospital Municipal'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Carlos Oliveira',
      employeeRole: 'Zelador',
      startDate: '2024-07-28',
      endDate: '2024-07-30',
      days: 3,
      reason: 'Cirurgia menor',
      document: 'atestado_carlos_003.pdf',
      status: 'rejected',
      submittedAt: '2024-07-27T16:45:00',
      rejectedBy: 'Admin Sistema',
      notes: 'Documento ilegível, solicitar nova via',
      doctorName: 'Dr. Pedro Costa',
      crm: '11111-SP',
      medicalFacility: 'Hospital São Paulo'
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Ana Costa',
      employeeRole: 'Administradora',
      startDate: '2024-08-02',
      endDate: '2024-08-04',
      days: 3,
      reason: 'Dengue',
      document: 'atestado_ana_004.pdf',
      status: 'approved',
      submittedAt: '2024-08-01T09:15:00',
      approvedBy: 'Admin Sistema',
      doctorName: 'Dr. Roberto Silva',
      crm: '22222-SP',
      medicalFacility: 'UBS Central'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<MedicalCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Formulário
  const [formData, setFormData] = useState<CertificateFormData>({
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: '',
    doctorName: '',
    crm: '',
    medicalFacility: '',
    notes: '',
    document: null
  });

  // Lista de funcionários mock
  const employees = [
    { id: '1', name: 'João Silva', role: 'Porteiro' },
    { id: '2', name: 'Maria Santos', role: 'Faxineira' },
    { id: '3', name: 'Carlos Oliveira', role: 'Zelador' },
    { id: '4', name: 'Ana Costa', role: 'Administradora' },
    { id: '5', name: 'Pedro Lima', role: 'Segurança' },
    { id: '6', name: 'Lucia Ferreira', role: 'Recepcionista' }
  ];

  // Função para calcular dias
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Handlers
  const handleInputChange = (field: keyof CertificateFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calcular dias automaticamente quando ambas as datas estão preenchidas
    if (field === 'startDate' || field === 'endDate') {
      const newFormData = { ...formData, [field]: value };
      if (newFormData.startDate && newFormData.endDate) {
        // Atualizar preview de dias se necessário
      }
    }
  };

  const handleCreateCertificate = () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.reason) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const employee = employees.find(e => e.id === formData.employeeId);
    const days = calculateDays(formData.startDate, formData.endDate);

    const newCertificate: MedicalCertificate = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      employeeName: employee?.name || '',
      employeeRole: employee?.role || '',
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      document: formData.document?.name || 'documento.pdf',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      doctorName: formData.doctorName,
      crm: formData.crm,
      medicalFacility: formData.medicalFacility,
      notes: formData.notes
    };

    setCertificates([newCertificate, ...certificates]);
    
    // Reset form
    setFormData({
      employeeId: '',
      startDate: '',
      endDate: '',
      reason: '',
      doctorName: '',
      crm: '',
      medicalFacility: '',
      notes: '',
      document: null
    });
    
    setIsCreateModalOpen(false);
  };

  const handleApproveCertificate = (id: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === id 
        ? { ...cert, status: 'approved' as const, approvedBy: 'Admin Sistema' }
        : cert
    ));
  };

  const handleRejectCertificate = (id: string, reason?: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === id 
        ? { 
            ...cert, 
            status: 'rejected' as const, 
            rejectedBy: 'Admin Sistema',
            notes: reason || 'Documento rejeitado'
          }
        : cert
    ));
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  const handleViewCertificate = (certificate: MedicalCertificate) => {
    setSelectedCertificate(certificate);
    setIsViewModalOpen(true);
  };

  // Filtros
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = searchTerm === '' || 
        cert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const certDate = new Date(cert.submittedAt);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            return certDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return certDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return certDate >= monthAgo;
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
    const totalDays = certificates
      .filter(c => c.status === 'approved')
      .reduce((acc, c) => acc + c.days, 0);
    
    return { total, pending, approved, rejected, totalDays };
  }, [certificates]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <ContentLayout title="Gestão de Atestados">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Atestados Médicos</h1>
            <p className="text-muted-foreground">
              Gerencie atestados médicos dos funcionários do condomínio
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Atestado
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Atestados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Todos os registros
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
                Aguardando análise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                Atestados válidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">
                Documentos inválidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dias Afastados</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
              <p className="text-xs text-muted-foreground">
                Total aprovado
              </p>
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
              <SelectValue placeholder="Status" />
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
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Atestados */}
        <div className="grid gap-4">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <h3 className="font-semibold text-lg">{certificate.employeeName}</h3>
                      </div>
                      {getStatusBadge(certificate.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <p><span className="font-medium text-foreground">Cargo:</span> {certificate.employeeRole}</p>
                        <p><span className="font-medium text-foreground">Período:</span> {formatDate(certificate.startDate)} até {formatDate(certificate.endDate)}</p>
                        <p><span className="font-medium text-foreground">Dias:</span> {certificate.days} {certificate.days === 1 ? 'dia' : 'dias'}</p>
                        <p><span className="font-medium text-foreground">Motivo:</span> {certificate.reason}</p>
                      </div>
                      
                      <div className="space-y-2">
                        {certificate.doctorName && (
                          <p><span className="font-medium text-foreground">Médico:</span> {certificate.doctorName}</p>
                        )}
                        {certificate.crm && (
                          <p><span className="font-medium text-foreground">CRM:</span> {certificate.crm}</p>
                        )}
                        {certificate.medicalFacility && (
                          <p><span className="font-medium text-foreground">Local:</span> {certificate.medicalFacility}</p>
                        )}
                        <p><span className="font-medium text-foreground">Enviado:</span> {formatDateTime(certificate.submittedAt)}</p>
                      </div>
                    </div>

                    {certificate.notes && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm"><span className="font-medium">Observações:</span> {certificate.notes}</p>
                      </div>
                    )}

                    {certificate.status === 'approved' && certificate.approvedBy && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Aprovado por: {certificate.approvedBy}</span>
                      </div>
                    )}

                    {certificate.status === 'rejected' && certificate.rejectedBy && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Rejeitado por: {certificate.rejectedBy}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCertificate(certificate)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {certificate.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApproveCertificate(certificate.id)}
                              className="text-green-600"
                            >
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
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCertificate(certificate.id)}
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

          {filteredCertificates.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum atestado encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Tente ajustar os filtros de pesquisa'
                    : 'Registre o primeiro atestado médico'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Atestado
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Modal de Criação */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Atestado Médico</DialogTitle>
              <DialogDescription>
                Registre um novo atestado médico para um funcionário
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informações do Funcionário */}
              <div className="space-y-4">
                <h4 className="font-medium">Informações do Funcionário</h4>
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
              </div>

              {/* Período do Atestado */}
              <div className="space-y-4">
                <h4 className="font-medium">Período do Atestado</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data Início *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data Fim *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
                
                {formData.startDate && formData.endDate && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Total de dias:</strong> {calculateDays(formData.startDate, formData.endDate)} {calculateDays(formData.startDate, formData.endDate) === 1 ? 'dia' : 'dias'}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="reason">Motivo/Diagnóstico *</Label>
                  <Input
                    id="reason"
                    placeholder="Ex: Gripe, Consulta médica, Cirurgia..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                  />
                </div>
              </div>

              {/* Informações Médicas */}
              <div className="space-y-4">
                <h4 className="font-medium">Informações Médicas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Nome do Médico</Label>
                    <Input
                      id="doctorName"
                      placeholder="Dr. João Silva"
                      value={formData.doctorName}
                      onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crm">CRM</Label>
                    <Input
                      id="crm"
                      placeholder="12345-SP"
                      value={formData.crm}
                      onChange={(e) => handleInputChange('crm', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="medicalFacility">Local do Atendimento</Label>
                  <Input
                    id="medicalFacility"
                    placeholder="Hospital, Clínica, UBS..."
                    value={formData.medicalFacility}
                    onChange={(e) => handleInputChange('medicalFacility', e.target.value)}
                  />
                </div>
              </div>

              {/* Documento */}
              <div className="space-y-4">
                <h4 className="font-medium">Documento do Atestado</h4>
                <div>
                  <Label htmlFor="document">Arquivo do Atestado</Label>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleInputChange('document', e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Aceitos: PDF, JPG, PNG (máx. 5MB)
                  </p>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações adicionais, instruções especiais..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateCertificate} className="flex-1">
                  <FileText className="mr-2 h-4 w-4" />
                  Registrar Atestado
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
            {selectedCertificate && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Atestado Médico</DialogTitle>
                  <DialogDescription>
                    Informações completas do atestado
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedCertificate.employeeName}</h3>
                    {getStatusBadge(selectedCertificate.status)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Informações do Funcionário</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Nome:</span> {selectedCertificate.employeeName}</p>
                        <p><span className="font-medium">Cargo:</span> {selectedCertificate.employeeRole}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Período do Atestado</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">Início:</span> {formatDate(selectedCertificate.startDate)}</p>
                        <p><span className="font-medium">Fim:</span> {formatDate(selectedCertificate.endDate)}</p>
                        <p><span className="font-medium">Dias:</span> {selectedCertificate.days}</p>
                        <p><span className="font-medium">Motivo:</span> {selectedCertificate.reason}</p>
                      </div>
                    </div>
                  </div>
                  
                  {(selectedCertificate.doctorName || selectedCertificate.crm || selectedCertificate.medicalFacility) && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Informações Médicas</h4>
                      <div className="text-sm space-y-1">
                        {selectedCertificate.doctorName && (
                          <p><span className="font-medium">Médico:</span> {selectedCertificate.doctorName}</p>
                        )}
                        {selectedCertificate.crm && (
                          <p><span className="font-medium">CRM:</span> {selectedCertificate.crm}</p>
                        )}
                        {selectedCertificate.medicalFacility && (
                          <p><span className="font-medium">Local:</span> {selectedCertificate.medicalFacility}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Informações do Sistema</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Enviado em:</span> {formatDateTime(selectedCertificate.submittedAt)}</p>
                      <p><span className="font-medium">Documento:</span> {selectedCertificate.document}</p>
                      {selectedCertificate.approvedBy && (
                        <p><span className="font-medium">Aprovado por:</span> {selectedCertificate.approvedBy}</p>
                      )}
                      {selectedCertificate.rejectedBy && (
                        <p><span className="font-medium">Rejeitado por:</span> {selectedCertificate.rejectedBy}</p>
                      )}
                    </div>
                  </div>
                  
                  {selectedCertificate.notes && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Observações</h4>
                      <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        {selectedCertificate.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Documento
                    </Button>
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
