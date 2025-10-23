"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Users
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

interface NewEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeCreate: (employee: Employee) => void;
}

export function NewEmployeeModal({ open, onOpenChange, onEmployeeCreate }: NewEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    condominium: "",
    condominiumId: 1,
    email: "",
    phone: "",
    document: "",
    salary: "",
    status: "Ativo",
    admissionDate: "",
    shift: "",
    address: "",
    emergencyContact: "",
    benefits: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const condominiums = [
    { id: 1, name: "Condomínio Santos Dumont" },
    { id: 2, name: "Condomínio Griffe" },
    { id: 3, name: "Condomínio Artagus" },
    { id: 4, name: "Condomínio Cachoeira Dourada" },
    { id: 5, name: "Condomínio Recanto" },
    { id: 6, name: "Condomínio Vivenda" },
    { id: 7, name: "Condomínio OCAPORAN" },
    { id: 8, name: "Condomínio Romeu" },
    { id: 9, name: "Condomínio Visconde Albuquerque" }
  ];

  const roles = [
    "Porteiro",
    "Porteiro Noturno", 
    "Síndico",
    "Síndica",
    "Síndico Profissional",
    "Síndica Profissional",
    "Administrador",
    "Administradora",
    "Gerente Predial",
    "Zelador",
    "Zelador Geral",
    "Manutenção",
    "Limpeza",
    "Supervisor de Segurança"
  ];

  const shifts = [
    "Manhã (06:00-14:00)",
    "Tarde (14:00-22:00)",
    "Noite (22:00-06:00)",
    "Comercial (08:00-18:00)",
    "Comercial (09:00-18:00)",
    "Comercial (08:30-17:30)",
    "Flexível"
  ];

  const availableBenefits = [
    "Vale Transporte",
    "Vale Alimentação", 
    "Plano de Saúde",
    "Participação nos Lucros",
    "Adicional Noturno",
    "Periculosidade",
    "Carro da Empresa"
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-populate condominium name when condominiumId changes
    if (field === "condominiumId") {
      const selectedCondominium = condominiums.find(c => c.id === Number(value));
      if (selectedCondominium) {
        setFormData(prev => ({
          ...prev,
          condominium: selectedCondominium.name,
          condominiumId: selectedCondominium.id
        }));
      }
    }
  };

  const toggleBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a new ID (in a real app, this would come from the backend)
      const newId = Date.now();

      const newEmployee: Employee = {
        id: newId,
        name: formData.name,
        role: formData.role,
        condominium: formData.condominium,
        condominiumId: formData.condominiumId,
        email: formData.email,
        phone: formData.phone,
        document: formData.document,
        salary: Number(formData.salary),
        status: formData.status,
        admissionDate: formData.admissionDate,
        shift: formData.shift,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        benefits: formData.benefits
      };

      onEmployeeCreate(newEmployee);
      
      // Reset form
      setFormData({
        name: "",
        role: "",
        condominium: "",
        condominiumId: 1,
        email: "",
        phone: "",
        document: "",
        salary: "",
        status: "Ativo",
        admissionDate: "",
        shift: "",
        address: "",
        emergencyContact: "",
        benefits: []
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Novo Funcionário
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do novo funcionário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">CPF *</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => handleInputChange("document", e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contato de Emergência</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Nome - (00) 00000-0000"
              />
            </div>
          </div>

          {/* Informações Profissionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Profissionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condominium">Condomínio *</Label>
                <select
                  id="condominium"
                  value={formData.condominiumId}
                  onChange={(e) => handleInputChange("condominiumId", Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {condominiums.map(cond => (
                    <option key={cond.id} value={cond.id}>
                      {cond.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo *</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Selecione um cargo</option>
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salário *</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Data de Admissão *</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">Turno de Trabalho *</Label>
                <select
                  id="shift"
                  value={formData.shift}
                  onChange={(e) => handleInputChange("shift", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Selecione um turno</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Licença">Licença</option>
                </select>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefícios</h3>
            <div className="flex flex-wrap gap-2">
              {availableBenefits.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleBenefit(benefit)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.benefits.includes(benefit)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
            {formData.benefits.length > 0 && (
              <div className="space-y-2">
                <Label>Benefícios Selecionados:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map(benefit => (
                    <Badge key={benefit} variant="default">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Funcionário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
