"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal,
  Trash2,
  Download,
  FileText,
  UserX,
  Archive,
  Mail,
  Phone,
  History,
  AlertTriangle
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

interface EmployeeActionsMenuProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onView: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
  onDeactivate: (employee: Employee) => void;
}

export function EmployeeActionsMenu({ 
  employee, 
  onEdit, 
  onView, 
  onDelete, 
  onDeactivate 
}: EmployeeActionsMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reset states when employee changes
  useEffect(() => {
    setIsDeleteDialogOpen(false);
    setIsDeactivateDialogOpen(false);
    setIsMenuOpen(false);
  }, [employee.id]);

  // Function to reset all states
  const resetStates = () => {
    setIsDeleteDialogOpen(false);
    setIsDeactivateDialogOpen(false);
    setIsMenuOpen(false);
  };

  const handleExportEmployee = () => {
    // Criar dados para exportação
    const employeeData = {
      "Nome": employee.name,
      "CPF": employee.document,
      "Cargo": employee.role,
      "Condomínio": employee.condominium,
      "E-mail": employee.email,
      "Telefone": employee.phone,
      "Salário": `R$ ${employee.salary.toFixed(2)}`,
      "Status": employee.status,
      "Data de Admissão": new Date(employee.admissionDate).toLocaleDateString('pt-BR'),
      "Turno": employee.shift,
      "Endereço": employee.address,
      "Contato de Emergência": employee.emergencyContact,
      "Benefícios": employee.benefits.join(", ")
    };

    // Converter para CSV
    const csvContent = Object.entries(employeeData)
      .map(([key, value]) => `"${key}","${value}"`)
      .join('\n');

    // Download do arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `funcionario_${employee.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateReport = () => {
    // Gerar relatório do funcionário
    const reportData = {
      employee,
      generatedAt: new Date().toLocaleString('pt-BR'),
      workingMonths: Math.floor((new Date().getTime() - new Date(employee.admissionDate).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      totalBenefits: employee.benefits.length
    };

    const reportContent = `
RELATÓRIO DO FUNCIONÁRIO
========================

Nome: ${employee.name}
CPF: ${employee.document}
Cargo: ${employee.role}
Condomínio: ${employee.condominium}

INFORMAÇÕES DE CONTATO
---------------------
E-mail: ${employee.email}
Telefone: ${employee.phone}
Endereço: ${employee.address}
Contato de Emergência: ${employee.emergencyContact}

INFORMAÇÕES PROFISSIONAIS
-------------------------
Status: ${employee.status}
Data de Admissão: ${new Date(employee.admissionDate).toLocaleDateString('pt-BR')}
Tempo na Empresa: ${reportData.workingMonths} meses
Turno de Trabalho: ${employee.shift}
Salário: R$ ${employee.salary.toFixed(2)}

BENEFÍCIOS (${employee.benefits.length})
---------
${employee.benefits.map(benefit => `• ${benefit}`).join('\n')}

Relatório gerado em: ${reportData.generatedAt}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${employee.name.replace(/\s+/g, '_')}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Contato - ${employee.name}`);
    const body = encodeURIComponent(`Olá ${employee.name},\n\nEspero que esteja bem.\n\nAtenciosamente,\n`);
    window.open(`mailto:${employee.email}?subject=${subject}&body=${body}`);
  };

  const handleCall = () => {
    window.open(`tel:${employee.phone}`);
  };

  const handleDelete = () => {
    onDelete(employee.id);
    resetStates();
  };

  const handleDeactivate = () => {
    const deactivatedEmployee = { ...employee, status: "Inativo" };
    onDeactivate(deactivatedEmployee);
    resetStates();
  };

  // Função para lidar com ações que fecham o menu
  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Ações do Funcionário</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleMenuAction(() => onView(employee))}>
            <FileText className="mr-2 h-4 w-4" />
            Ver Detalhes
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleMenuAction(() => onEdit(employee))}>
            <History className="mr-2 h-4 w-4" />
            Editar Informações
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleMenuAction(handleSendEmail)}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar E-mail
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleMenuAction(handleCall)}>
            <Phone className="mr-2 h-4 w-4" />
            Ligar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleMenuAction(handleExportEmployee)}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados (CSV)
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleMenuAction(handleGenerateReport)}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {employee.status === "Ativo" ? (
            <DropdownMenuItem 
              onClick={() => {
                setIsDeactivateDialogOpen(true);
                setIsMenuOpen(false);
              }}
              className="text-yellow-600"
            >
              <UserX className="mr-2 h-4 w-4" />
              Desativar Funcionário
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => handleMenuAction(() => onDeactivate({ ...employee, status: "Ativo" }))}
              className="text-green-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Reativar Funcionário
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setIsMenuOpen(false);
            }}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Funcionário
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            // Reset do estado do menu quando o dialog é fechado
            setTimeout(() => setIsMenuOpen(false), 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o funcionário{" "}
              <span className="font-semibold">{employee.name}</span>?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ Esta ação não pode ser desfeita. Todos os dados do funcionário serão perdidos permanentemente.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                // Pequeno delay para evitar conflitos de estado
                setTimeout(() => setIsMenuOpen(false), 50);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Desativação */}
      <Dialog 
        open={isDeactivateDialogOpen} 
        onOpenChange={(open) => {
          setIsDeactivateDialogOpen(open);
          if (!open) {
            // Reset do estado do menu quando o dialog é fechado
            setTimeout(() => setIsMenuOpen(false), 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <UserX className="h-5 w-5" />
              Confirmar Desativação
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desativar o funcionário{" "}
              <span className="font-semibold">{employee.name}</span>?
              <br />
              <br />
              O funcionário será marcado como "Inativo" mas seus dados serão preservados.
              Você pode reativá-lo a qualquer momento.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeactivateDialogOpen(false);
                // Pequeno delay para evitar conflitos de estado
                setTimeout(() => setIsMenuOpen(false), 50);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleDeactivate}
            >
              <UserX className="mr-2 h-4 w-4" />
              Desativar Funcionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
