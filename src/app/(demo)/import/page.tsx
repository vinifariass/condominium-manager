"use client";

import React, { useState, useRef } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  Eye,
  Trash2,
  Save,
  FileText,
  Calendar,
  Wrench,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  Settings,
  Bell,
  Building2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceRecord {
  id: string;
  data: string;
  servico: string;
  status: 'valid' | 'invalid' | 'warning';
  errors: string[];
  warnings: string[];
  originalRow: number;
}

interface ValidationResult {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  warningRecords: number;
  records: ServiceRecord[];
}

interface NotificationSettings {
  sms: boolean;
  whatsapp: boolean;
  telegram: boolean;
  email: boolean;
  daysBeforeExpiry: number;
}

interface Condominium {
  id: string;
  name: string;
  address: string;
}

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [selectedCondominium, setSelectedCondominium] = useState<string>("");
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sms: false,
    whatsapp: true,
    telegram: false,
    email: true,
    daysBeforeExpiry: 7
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lista de condomínios disponíveis (simulação)
  const condominiums: Condominium[] = [
    { id: "1", name: "Residencial Villa Verde", address: "Rua das Flores, 123" },
    { id: "2", name: "Edifício Sunset", address: "Av. Principal, 456" },
    { id: "3", name: "Condomínio Jardim das Acácias", address: "Rua dos Ipês, 789" },
    { id: "4", name: "Residencial Parque Imperial", address: "Av. Central, 321" },
    { id: "5", name: "Edifício Royal Tower", address: "Rua Premium, 654" }
  ];

  // Lista de serviços válidos (simulação)
  const validServices = [
    'Limpeza de Piscina',
    'Manutenção de Elevador',
    'Jardinagem',
    'Pintura',
    'Dedetização',
    'Limpeza de Caixa d\'Água',
    'Portaria',
    'Segurança',
    'Manutenção Elétrica',
    'Manutenção Hidráulica',
    'Limpeza Geral'
  ];

  const handleCondominiumChange = (condominiumId: string) => {
    setSelectedCondominium(condominiumId);
    // Reset validação e importação quando mudar condomínio
    setValidationResult(null);
    setImportComplete(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationResult(null);
      setImportComplete(false);
    }
  };

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    // Aceita formatos: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
    const dateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$|^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
    
    if (!dateRegex.test(dateStr)) return false;
    
    try {
      // Tenta converter para data válida
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  };

  const validateService = (service: string): { isValid: boolean; suggestion?: string } => {
    if (!service) return { isValid: false };
    
    const normalizedService = service.trim().toLowerCase();
    const exactMatch = validServices.find(s => s.toLowerCase() === normalizedService);
    
    if (exactMatch) return { isValid: true };
    
    // Busca por similaridade
    const suggestion = validServices.find(s => 
      s.toLowerCase().includes(normalizedService) || 
      normalizedService.includes(s.toLowerCase())
    );
    
    return { isValid: false, suggestion };
  };

  const processFile = async () => {
    if (!selectedFile || !selectedCondominium) return;
    
    setIsProcessing(true);
    
    // Simula processamento de arquivo Excel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dados simulados como se fossem extraídos do Excel
    const mockData = [
      { data: '15/01/2024', servico: 'Limpeza de Piscina' },
      { data: '20/01/2024', servico: 'Manutenção Elevador' }, // Erro: nome incorreto
      { data: '25/01/2024', servico: 'Jardinagem' },
      { data: '30/01/2024', servico: 'Pintura Externa' }, // Warning: nome parecido
      { data: 'data_invalida', servico: 'Limpeza Geral' }, // Erro: data inválida
      { data: '05/02/2024', servico: '' }, // Erro: serviço vazio
      { data: '10/02/2024', servico: 'Dedetização' },
      { data: '15/02/2024', servico: 'Portaria' },
    ];
    
    const records: ServiceRecord[] = mockData.map((row, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      let status: 'valid' | 'invalid' | 'warning' = 'valid';
      
      // Validar data
      if (!validateDate(row.data)) {
        errors.push('Data inválida. Use formato DD/MM/AAAA');
        status = 'invalid';
      }
      
      // Validar serviço
      const serviceValidation = validateService(row.servico);
      if (!serviceValidation.isValid) {
        if (!row.servico.trim()) {
          errors.push('Serviço não pode estar vazio');
          status = 'invalid';
        } else if (serviceValidation.suggestion) {
          warnings.push(`Serviço similar encontrado: "${serviceValidation.suggestion}"`);
          if (status !== 'invalid') status = 'warning';
        } else {
          errors.push('Serviço não encontrado na lista de serviços válidos');
          status = 'invalid';
        }
      }
      
      return {
        id: `record-${index}`,
        data: row.data,
        servico: row.servico,
        status,
        errors,
        warnings,
        originalRow: index + 2 // +2 porque linha 1 é header
      };
    });
    
    const validRecords = records.filter(r => r.status === 'valid').length;
    const invalidRecords = records.filter(r => r.status === 'invalid').length;
    const warningRecords = records.filter(r => r.status === 'warning').length;
    
    setValidationResult({
      totalRecords: records.length,
      validRecords,
      invalidRecords,
      warningRecords,
      records
    });
    
    setIsProcessing(false);
  };

  const handleImport = async () => {
    if (!validationResult) return;
    
    setIsImporting(true);
    
    // Simula salvamento no banco de dados
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsImporting(false);
    setImportComplete(true);
  };

  const handleNotificationChange = (type: keyof NotificationSettings, value: boolean | number) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const downloadTemplate = () => {
    // Cria um arquivo Excel de exemplo
    const csvContent = `Data,Serviço
15/01/2024,Limpeza de Piscina
20/01/2024,Manutenção de Elevador
25/01/2024,Jardinagem
30/01/2024,Pintura
05/02/2024,Dedetização
10/02/2024,Limpeza de Caixa d'Água
15/02/2024,Portaria
20/02/2024,Segurança
25/02/2024,Manutenção Elétrica
01/03/2024,Manutenção Hidráulica`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_servicos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Válido</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Atenção</Badge>;
      case 'invalid':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Erro</Badge>;
      default:
        return null;
    }
  };

  return (
    <ContentLayout title="Importação de Serviços">
      <div className="space-y-6">
        
        {/* Header e Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Importar Serviços via Excel
            </CardTitle>
            <CardDescription>
              Importe dados de serviços a partir de planilhas Excel/CSV com validação automática
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Como preparar sua planilha:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-medium">1.</span>
                  <span>A planilha deve ter duas colunas: <strong>"Data"</strong> e <strong>"Serviço"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">2.</span>
                  <span>As datas devem estar no formato DD/MM/AAAA (ex: 15/01/2024)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">3.</span>
                  <span>Os serviços devem usar exatamente os nomes da lista de serviços válidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>A primeira linha deve conter os cabeçalhos das colunas</span>
                </li>
              </ul>
            </div>

            {/* Serviços Válidos */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Serviços Válidos:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                {validServices.map((service, index) => (
                  <Badge key={index} variant="outline" className="justify-start">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Botão para baixar template */}
            <div className="flex justify-center">
              <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Baixar Planilha de Exemplo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seleção do Condomínio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              1. Selecionar Condomínio
            </CardTitle>
            <CardDescription>
              Escolha o condomínio para o qual os serviços serão importados e notificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Condomínio de Destino
                </label>
                <Select value={selectedCondominium} onValueChange={handleCondominiumChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o condomínio..." />
                  </SelectTrigger>
                  <SelectContent>
                    {condominiums.map((condo) => (
                      <SelectItem key={condo.id} value={condo.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{condo.name}</span>
                          <span className="text-xs text-muted-foreground">{condo.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCondominium && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Condomínio selecionado: {condominiums.find(c => c.id === selectedCondominium)?.name}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Os alertas de vencimento incluirão o nome deste condomínio nas notificações
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload de Arquivo */}
        <Card>
          <CardHeader>
            <CardTitle>2. Selecionar Arquivo</CardTitle>
            <CardDescription>
              Faça upload da sua planilha Excel (.xlsx) ou CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Selecionar arquivo Excel ou CSV"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => fileInputRef.current?.click()} 
                      variant="outline"
                      size="sm"
                    >
                      Escolher Outro
                    </Button>
                    <Button 
                      onClick={processFile} 
                      disabled={isProcessing || !selectedCondominium}
                      size="sm"
                    >
                      {isProcessing ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : !selectedCondominium ? (
                        <>
                          <Building2 className="h-4 w-4 mr-2" />
                          Selecione um Condomínio
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Validar Dados
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Clique para selecionar um arquivo</p>
                    <p className="text-sm text-muted-foreground">
                      Suporta Excel (.xlsx, .xls) e CSV
                    </p>
                  </div>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4"
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultado da Validação */}
        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle>3. Resultado da Validação</CardTitle>
              <CardDescription>
                Verificação dos dados importados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Resumo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{validationResult.totalRecords}</div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{validationResult.validRecords}</div>
                  <div className="text-sm text-green-600">Válidos</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{validationResult.warningRecords}</div>
                  <div className="text-sm text-yellow-600">Atenção</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{validationResult.invalidRecords}</div>
                  <div className="text-sm text-red-600">Erros</div>
                </div>
              </div>

              {/* Lista de Registros */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {validationResult.records.map((record) => (
                  <div 
                    key={record.id} 
                    className={`border rounded-lg p-4 ${
                      record.status === 'valid' ? 'border-green-200 bg-green-50/50 dark:bg-green-950/10' :
                      record.status === 'warning' ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/10' :
                      'border-red-200 bg-red-50/50 dark:bg-red-950/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(record.status)}
                          <span className="font-medium">Linha {record.originalRow}</span>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Data:</span> {record.data}
                          </div>
                          <div>
                            <span className="font-medium">Serviço:</span> {record.servico}
                          </div>
                        </div>
                        {(record.errors.length > 0 || record.warnings.length > 0) && (
                          <div className="mt-2 space-y-1">
                            {record.errors.map((error, index) => (
                              <div key={index} className="text-sm text-red-600 dark:text-red-400">
                                ❌ {error}
                              </div>
                            ))}
                            {record.warnings.map((warning, index) => (
                              <div key={index} className="text-sm text-yellow-600 dark:text-yellow-400">
                                ⚠️ {warning}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setValidationResult(null);
                    setSelectedFile(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={validationResult.validRecords === 0 || isImporting}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Importar {validationResult.validRecords} Registros Válidos
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configurações de Notificação */}
        {validationResult && !importComplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                4. Configurar Alertas de Vencimento
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber os alertas quando os serviços estiverem próximos do vencimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Dias antes do vencimento */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Alertar quantos dias antes do vencimento?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={notificationSettings.daysBeforeExpiry}
                    onChange={(e) => handleNotificationChange('daysBeforeExpiry', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Dias antes do vencimento para enviar alerta"
                  />
                  <span className="text-sm text-muted-foreground">dias antes do vencimento</span>
                </div>
              </div>

              {/* Métodos de notificação */}
              <div>
                <label className="text-sm font-medium mb-4 block">
                  Selecione os métodos de notificação:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* WhatsApp */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    notificationSettings.whatsapp 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                      : 'border-border hover:border-green-300'
                  }`}
                  onClick={() => handleNotificationChange('whatsapp', !notificationSettings.whatsapp)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                      <input
                        type="checkbox"
                        checked={notificationSettings.whatsapp}
                        onChange={() => {}} // Controlado pelo onClick do div
                        className="rounded"
                        aria-label="Ativar notificações via WhatsApp"
                      />
                    </div>
                    <h4 className="font-medium">WhatsApp</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Receba alertas via WhatsApp Business
                    </p>
                    {notificationSettings.whatsapp && (
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                        ✓ Ativo - Mensagens automáticas
                      </div>
                    )}
                  </div>

                  {/* SMS */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    notificationSettings.sms 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                      : 'border-border hover:border-blue-300'
                  }`}
                  onClick={() => handleNotificationChange('sms', !notificationSettings.sms)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <input
                        type="checkbox"
                        checked={notificationSettings.sms}
                        onChange={() => {}} // Controlado pelo onClick do div
                        className="rounded"
                        aria-label="Ativar notificações via SMS"
                      />
                    </div>
                    <h4 className="font-medium">SMS</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mensagens de texto no celular
                    </p>
                    {notificationSettings.sms && (
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                        ✓ Ativo - R$ 0,08 por SMS
                      </div>
                    )}
                  </div>

                  {/* Telegram */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    notificationSettings.telegram 
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' 
                      : 'border-border hover:border-cyan-300'
                  }`}
                  onClick={() => handleNotificationChange('telegram', !notificationSettings.telegram)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Send className="h-6 w-6 text-cyan-600" />
                      <input
                        type="checkbox"
                        checked={notificationSettings.telegram}
                        onChange={() => {}} // Controlado pelo onClick do div
                        className="rounded"
                        aria-label="Ativar notificações via Telegram"
                      />
                    </div>
                    <h4 className="font-medium">Telegram</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mensagens via bot do Telegram
                    </p>
                    {notificationSettings.telegram && (
                      <div className="mt-2 text-xs text-cyan-600 dark:text-cyan-400">
                        ✓ Ativo - Gratuito via bot
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    notificationSettings.email 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                      : 'border-border hover:border-purple-300'
                  }`}
                  onClick={() => handleNotificationChange('email', !notificationSettings.email)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Mail className="h-6 w-6 text-purple-600" />
                      <input
                        type="checkbox"
                        checked={notificationSettings.email}
                        onChange={() => {}} // Controlado pelo onClick do div
                        className="rounded"
                        aria-label="Ativar notificações via Email"
                      />
                    </div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Notificações por email
                    </p>
                    {notificationSettings.email && (
                      <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                        ✓ Ativo - Incluído no plano
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resumo das configurações */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Resumo das Notificações:
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    • Alertas serão enviados <span className="font-medium">{notificationSettings.daysBeforeExpiry} dias antes</span> do vencimento
                  </p>
                  <p>
                    • Métodos ativos: {
                      [
                        notificationSettings.whatsapp && 'WhatsApp',
                        notificationSettings.sms && 'SMS', 
                        notificationSettings.telegram && 'Telegram',
                        notificationSettings.email && 'Email'
                      ].filter(Boolean).join(', ') || 'Nenhum método selecionado'
                    }
                  </p>
                  {(notificationSettings.sms) && (
                    <p className="text-yellow-600 dark:text-yellow-400">
                      • Custo estimado: R$ {((validationResult?.validRecords || 0) * 0.08).toFixed(2)} por mês (considerando 1 SMS por serviço)
                    </p>
                  )}
                </div>
              </div>

              {/* Preview da Mensagem */}
              {selectedCondominium && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <MessageSquare className="h-4 w-4" />
                    Preview da Mensagem de Alerta:
                  </h4>
                  <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 text-sm">
                    <div className="font-mono text-gray-800 dark:text-gray-200">
                      🏢 <strong>Condomínio:</strong> {condominiums.find(c => c.id === selectedCondominium)?.name}<br/>
                      📅 <strong>Data de Vencimento:</strong> 15/01/2024<br/>
                      🔧 <strong>Serviço:</strong> Limpeza de Piscina<br/>
                      <br/>
                      ⚠️ Este serviço vence em {notificationSettings.daysBeforeExpiry} dias. Verifique se está tudo em ordem!
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    * Esta mensagem será enviada pelos métodos selecionados para cada serviço próximo do vencimento
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Importação Final */}
        {validationResult && !importComplete && (
          <Card>
            <CardHeader>
              <CardTitle>5. Confirmar Importação</CardTitle>
              <CardDescription>
                Revise as configurações e confirme a importação dos dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Botões de Ação */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setValidationResult(null);
                    setSelectedFile(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={validationResult.validRecords === 0 || isImporting || 
                    (!notificationSettings.whatsapp && !notificationSettings.sms && 
                     !notificationSettings.telegram && !notificationSettings.email)}
                  className="flex-1"
                >
                  {isImporting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Importar {validationResult.validRecords} Registros com Alertas
                    </>
                  )}
                </Button>
              </div>
              
              {(!notificationSettings.whatsapp && !notificationSettings.sms && 
                !notificationSettings.telegram && !notificationSettings.email) && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Selecione pelo menos um método de notificação para continuar
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sucesso */}
        {importComplete && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Importação Concluída!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    {validationResult?.validRecords} registros foram importados com sucesso para <strong>{condominiums.find(c => c.id === selectedCondominium)?.name}</strong> com alertas configurados.
                  </p>
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🏢 <strong>Condomínio:</strong> {condominiums.find(c => c.id === selectedCondominium)?.name}
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      📱 <strong>Alertas configurados para:</strong> {
                        [
                          notificationSettings.whatsapp && 'WhatsApp',
                          notificationSettings.sms && 'SMS', 
                          notificationSettings.telegram && 'Telegram',
                          notificationSettings.email && 'Email'
                        ].filter(Boolean).join(', ')
                      }
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      🔔 <strong>Notificações:</strong> {notificationSettings.daysBeforeExpiry} dias antes do vencimento
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      📧 <strong>Formato da mensagem:</strong> Condomínio + Data + Serviço + Alerta de vencimento
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setImportComplete(false);
                      setValidationResult(null);
                      setSelectedFile(null);
                    }}
                  >
                    Nova Importação
                  </Button>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Ver Serviços Importados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentLayout>
  );
}