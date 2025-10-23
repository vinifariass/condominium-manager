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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Download,
  FileText,
  Table,
  FileSpreadsheet,
  Users,
  CheckCircle,
  Calendar,
  Building2
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

interface BulkExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
}

export function BulkExportModal({ open, onOpenChange, employees }: BulkExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'txt'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'document', 'role', 'condominium', 'email', 'phone', 'salary', 'status'
  ]);
  const [isExporting, setIsExporting] = useState(false);

  const availableFields = [
    { key: 'name', label: 'Nome' },
    { key: 'document', label: 'CPF' },
    { key: 'role', label: 'Cargo' },
    { key: 'condominium', label: 'Condomínio' },
    { key: 'email', label: 'E-mail' },
    { key: 'phone', label: 'Telefone' },
    { key: 'salary', label: 'Salário' },
    { key: 'status', label: 'Status' },
    { key: 'admissionDate', label: 'Data de Admissão' },
    { key: 'shift', label: 'Turno' },
    { key: 'address', label: 'Endereço' },
    { key: 'emergencyContact', label: 'Contato de Emergência' },
    { key: 'benefits', label: 'Benefícios' }
  ];

  const toggleField = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey)
        ? prev.filter(key => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map(field => field.key));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const formatEmployeeData = (employee: Employee) => {
    const data: any = {};
    
    selectedFields.forEach(fieldKey => {
      switch (fieldKey) {
        case 'salary':
          data[fieldKey] = `R$ ${employee.salary.toFixed(2)}`;
          break;
        case 'admissionDate':
          data[fieldKey] = new Date(employee.admissionDate).toLocaleDateString('pt-BR');
          break;
        case 'benefits':
          data[fieldKey] = employee.benefits.join(', ');
          break;
        default:
          data[fieldKey] = employee[fieldKey as keyof Employee];
      }
    });
    
    return data;
  };

  const exportAsCSV = () => {
    const headers = selectedFields.map(fieldKey => 
      availableFields.find(field => field.key === fieldKey)?.label || fieldKey
    );
    
    const csvContent = [
      headers.join(','),
      ...employees.map(employee => {
        const data = formatEmployeeData(employee);
        return selectedFields.map(field => `"${data[field] || ''}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `funcionarios_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAsJSON = () => {
    const jsonData = employees.map(employee => formatEmployeeData(employee));
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    downloadFile(blob, `funcionarios_${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportAsTXT = () => {
    const txtContent = employees.map(employee => {
      const data = formatEmployeeData(employee);
      const lines = selectedFields.map(fieldKey => {
        const label = availableFields.find(field => field.key === fieldKey)?.label || fieldKey;
        return `${label}: ${data[fieldKey] || ''}`;
      });
      return lines.join('\n');
    }).join('\n\n' + '='.repeat(50) + '\n\n');

    const fullContent = `RELATÓRIO DE FUNCIONÁRIOS
Gerado em: ${new Date().toLocaleString('pt-BR')}
Total de funcionários: ${employees.length}

${'='.repeat(50)}

${txtContent}`;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8;' });
    downloadFile(blob, `funcionarios_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      switch (selectedFormat) {
        case 'csv':
          exportAsCSV();
          break;
        case 'json':
          exportAsJSON();
          break;
        case 'txt':
          exportAsTXT();
          break;
      }
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatsData = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'Ativo').length;
    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const condominiums = new Set(employees.map(emp => emp.condominiumId)).size;
    
    return {
      total: employees.length,
      active: activeEmployees,
      totalSalary,
      condominiums
    };
  };

  const stats = getStatsData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportação em Lote
          </DialogTitle>
          <DialogDescription>
            Exporte dados de {employees.length} funcionário(s) selecionado(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(stats.totalSalary)}
              </div>
              <div className="text-sm text-muted-foreground">Folha Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.condominiums}</div>
              <div className="text-sm text-muted-foreground">Condomínios</div>
            </div>
          </div>

          {/* Formato de Exportação */}
          <div className="space-y-3">
            <Label>Formato de Exportação</Label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedFormat === 'csv'
                    ? 'border-primary bg-primary/5'
                    : 'border-input hover:bg-muted/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Table className="h-8 w-8" />
                  <span className="font-medium">CSV</span>
                  <span className="text-xs text-muted-foreground">Excel, Planilhas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('json')}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedFormat === 'json'
                    ? 'border-primary bg-primary/5'
                    : 'border-input hover:bg-muted/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8" />
                  <span className="font-medium">JSON</span>
                  <span className="text-xs text-muted-foreground">Dados estruturados</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('txt')}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedFormat === 'txt'
                    ? 'border-primary bg-primary/5'
                    : 'border-input hover:bg-muted/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8" />
                  <span className="font-medium">TXT</span>
                  <span className="text-xs text-muted-foreground">Relatório legível</span>
                </div>
              </button>
            </div>
          </div>

          {/* Campos para Exportação */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Campos para Exportação</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllFields}
                >
                  Selecionar Todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllFields}
                >
                  Limpar Seleção
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFields.map(field => (
                <button
                  key={field.key}
                  type="button"
                  onClick={() => toggleField(field.key)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedFields.includes(field.key)
                      ? 'border-primary bg-primary/5'
                      : 'border-input hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedFields.includes(field.key) && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm font-medium">{field.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedFields.length > 0 && (
              <div className="mt-3">
                <Label className="text-sm text-muted-foreground">
                  Campos selecionados ({selectedFields.length}):
                </Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedFields.map(fieldKey => {
                    const field = availableFields.find(f => f.key === fieldKey);
                    return (
                      <Badge key={fieldKey} variant="secondary" className="text-xs">
                        {field?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleExport}
            disabled={selectedFields.length === 0 || isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exportando...' : `Exportar ${selectedFormat.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
