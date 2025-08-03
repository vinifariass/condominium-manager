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
  Filter,
  X,
  Search,
  Building2,
  User,
  DollarSign,
  Calendar,
  CheckCircle
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

interface FilterOptions {
  searchTerm: string;
  selectedCondominiums: number[];
  selectedRoles: string[];
  selectedStatuses: string[];
  salaryMin: string;
  salaryMax: string;
  admissionDateFrom: string;
  admissionDateTo: string;
  selectedBenefits: string[];
}

interface EmployeeFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onFiltersApply: (filteredEmployees: Employee[]) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function EmployeeFilters({ 
  open, 
  onOpenChange, 
  employees, 
  onFiltersApply, 
  filters, 
  onFiltersChange 
}: EmployeeFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

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
    "Porteiro", "Porteiro Noturno", "Síndico", "Síndica", 
    "Síndico Profissional", "Síndica Profissional", 
    "Administrador", "Administradora", "Gerente Predial",
    "Zelador", "Zelador Geral", "Manutenção", "Limpeza", 
    "Supervisor de Segurança"
  ];

  const statuses = ["Ativo", "Inativo", "Licença"];

  const benefits = [
    "Vale Transporte", "Vale Alimentação", "Plano de Saúde",
    "Participação nos Lucros", "Adicional Noturno", 
    "Periculosidade", "Carro da Empresa"
  ];

  const toggleArrayValue = (array: any[], value: any) => {
    return array.includes(value) 
      ? array.filter(item => item !== value)
      : [...array, value];
  };

  const handleLocalFilterChange = (field: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    let filtered = employees;

    // Filtro por termo de busca
    if (localFilters.searchTerm) {
      const searchLower = localFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.phone.includes(searchLower) ||
        emp.document.includes(searchLower)
      );
    }

    // Filtro por condomínios
    if (localFilters.selectedCondominiums.length > 0) {
      filtered = filtered.filter(emp => 
        localFilters.selectedCondominiums.includes(emp.condominiumId)
      );
    }

    // Filtro por cargos
    if (localFilters.selectedRoles.length > 0) {
      filtered = filtered.filter(emp => 
        localFilters.selectedRoles.includes(emp.role)
      );
    }

    // Filtro por status
    if (localFilters.selectedStatuses.length > 0) {
      filtered = filtered.filter(emp => 
        localFilters.selectedStatuses.includes(emp.status)
      );
    }

    // Filtro por faixa salarial
    if (localFilters.salaryMin) {
      filtered = filtered.filter(emp => 
        emp.salary >= Number(localFilters.salaryMin)
      );
    }
    if (localFilters.salaryMax) {
      filtered = filtered.filter(emp => 
        emp.salary <= Number(localFilters.salaryMax)
      );
    }

    // Filtro por data de admissão
    if (localFilters.admissionDateFrom) {
      filtered = filtered.filter(emp => 
        new Date(emp.admissionDate) >= new Date(localFilters.admissionDateFrom)
      );
    }
    if (localFilters.admissionDateTo) {
      filtered = filtered.filter(emp => 
        new Date(emp.admissionDate) <= new Date(localFilters.admissionDateTo)
      );
    }

    // Filtro por benefícios
    if (localFilters.selectedBenefits.length > 0) {
      filtered = filtered.filter(emp => 
        localFilters.selectedBenefits.some(benefit => 
          emp.benefits.includes(benefit)
        )
      );
    }

    onFiltersChange(localFilters);
    onFiltersApply(filtered);
    onOpenChange(false);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      searchTerm: "",
      selectedCondominiums: [],
      selectedRoles: [],
      selectedStatuses: [],
      salaryMin: "",
      salaryMax: "",
      admissionDateFrom: "",
      admissionDateTo: "",
      selectedBenefits: []
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onFiltersApply(employees);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchTerm) count++;
    if (localFilters.selectedCondominiums.length > 0) count++;
    if (localFilters.selectedRoles.length > 0) count++;
    if (localFilters.selectedStatuses.length > 0) count++;
    if (localFilters.salaryMin || localFilters.salaryMax) count++;
    if (localFilters.admissionDateFrom || localFilters.admissionDateTo) count++;
    if (localFilters.selectedBenefits.length > 0) count++;
    return count;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {getActiveFiltersCount() > 0 && (
              <Badge variant="default">
                {getActiveFiltersCount()} filtro(s) ativo(s)
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure os filtros para encontrar funcionários específicos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Busca por texto */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Busca Geral
            </Label>
            <Input
              placeholder="Nome, e-mail, telefone ou CPF..."
              value={localFilters.searchTerm}
              onChange={(e) => handleLocalFilterChange("searchTerm", e.target.value)}
            />
          </div>

          {/* Condomínios */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Condomínios
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {condominiums.map(cond => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => handleLocalFilterChange(
                    "selectedCondominiums", 
                    toggleArrayValue(localFilters.selectedCondominiums, cond.id)
                  )}
                  className={`p-2 text-sm rounded-md border transition-colors text-left ${
                    localFilters.selectedCondominiums.includes(cond.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {cond.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cargos */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cargos
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleLocalFilterChange(
                    "selectedRoles", 
                    toggleArrayValue(localFilters.selectedRoles, role)
                  )}
                  className={`p-2 text-sm rounded-md border transition-colors text-left ${
                    localFilters.selectedRoles.includes(role)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </Label>
            <div className="flex gap-2">
              {statuses.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleLocalFilterChange(
                    "selectedStatuses", 
                    toggleArrayValue(localFilters.selectedStatuses, status)
                  )}
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    localFilters.selectedStatuses.includes(status)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Faixa Salarial */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Faixa Salarial
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin" className="text-sm text-muted-foreground">
                  Salário Mínimo
                </Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="R$ 0,00"
                  value={localFilters.salaryMin}
                  onChange={(e) => handleLocalFilterChange("salaryMin", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salaryMax" className="text-sm text-muted-foreground">
                  Salário Máximo
                </Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="R$ 0,00"
                  value={localFilters.salaryMax}
                  onChange={(e) => handleLocalFilterChange("salaryMax", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Data de Admissão */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período de Admissão
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom" className="text-sm text-muted-foreground">
                  De
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.admissionDateFrom}
                  onChange={(e) => handleLocalFilterChange("admissionDateFrom", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm text-muted-foreground">
                  Até
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.admissionDateTo}
                  onChange={(e) => handleLocalFilterChange("admissionDateTo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-3">
            <Label>Benefícios</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {benefits.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => handleLocalFilterChange(
                    "selectedBenefits", 
                    toggleArrayValue(localFilters.selectedBenefits, benefit)
                  )}
                  className={`p-2 text-sm rounded-md border transition-colors text-left ${
                    localFilters.selectedBenefits.includes(benefit)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-muted border-input"
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button onClick={applyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
