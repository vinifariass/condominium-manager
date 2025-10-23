"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  Clock,
  MapPin,
  FileText,
  Users,
  Edit,
  Shield
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  condominium: string;
  condominiumId: number;
  email: string;
  phone: string;
  document: string;
  salary: number;
  status: string;
  admissionDate: string;
  shift: string;
  address: string;
  emergencyContact: string;
  benefits: string[];
}

interface ViewEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
}

export function ViewEmployeeModal({ open, onOpenChange, employee, onEdit }: ViewEmployeeModalProps) {
  if (!employee) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Funcionário
          </DialogTitle>
          <DialogDescription>
            Informações completas do funcionário
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com foto e informações básicas */}
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-muted/20 rounded-lg">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge className={getRoleColor(employee.role)}>
                    {employee.role}
                  </Badge>
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{employee.condominium}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Desde {formatDate(employee.admissionDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => onEdit(employee)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">E-mail:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Telefone:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.phone}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Endereço:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.address}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Contato de Emergência:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informações Profissionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">CPF:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.document}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Salário:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{formatSalary(employee.salary)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Turno:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{employee.shift}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data de Admissão:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{formatDate(employee.admissionDate)}</p>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefícios</h3>
            <div className="p-4 border rounded-lg">
              {employee.benefits.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {employee.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum benefício cadastrado</p>
              )}
            </div>
          </div>

          {/* Informações Estatísticas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estatísticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.floor((new Date().getTime() - new Date(employee.admissionDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                </div>
                <p className="text-sm text-muted-foreground">Meses na empresa</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {employee.benefits.length}
                </div>
                <p className="text-sm text-muted-foreground">Benefícios ativos</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {employee.status === "Ativo" ? "✓" : "✗"}
                </div>
                <p className="text-sm text-muted-foreground">Status atual</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
