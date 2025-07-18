"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard,
  Check,
  X,
  Loader2,
  Shield,
  Lock,
  Calendar,
  Mail,
  Phone,
  User,
  Building2,
  MapPin,
  CreditCard as CardIcon,
  Banknote,
  Smartphone,
  CheckCircle,
  ArrowLeft,
  Receipt,
  Download
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  setupFee: number;
  maxUnits: number;
  maxResidents: number;
  popular?: boolean;
  color: string;
  icon: any;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  billingCycle: 'monthly' | 'yearly';
}

export default function CheckoutModal({ isOpen, onClose, plan, billingCycle }: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | 'boleto'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Dados pessoais
    fullName: '',
    email: '',
    phone: '',
    document: '',
    
    // Dados do condomínio
    condominiumName: '',
    units: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Dados do cartão
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    
    // Termos
    acceptTerms: false,
    acceptNewsletter: false
  });

  if (!isOpen || !plan) return null;

  const getCurrentPrice = () => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
  };

  const getTotalPrice = () => {
    const monthlyPrice = getCurrentPrice();
    const setupFee = plan.setupFee;
    return monthlyPrice + setupFee;
  };

  const calculateSavings = () => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = monthlyTotal - plan.yearlyPrice;
      const percentage = Math.round((savings / monthlyTotal) * 100);
      return { savings, percentage };
    }
    return { savings: 0, percentage: 0 };
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '');
    const matches = v.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    const match = matches ? `${matches[1]}${matches[2] ? ' ' : ''}${matches[2]}${matches[3] ? ' ' : ''}${matches[3]}${matches[4] ? ' ' : ''}${matches[4]}` : v;
    return match;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simula processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setStep('success');
  };

  const savings = calculateSavings();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'details' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (step === 'payment') setStep('details');
                    else if (step === 'processing') return; // Não permite voltar durante processamento
                    else if (step === 'success') onClose();
                  }}
                  disabled={step === 'processing'}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {step === 'details' && 'Detalhes do Pedido'}
                  {step === 'payment' && 'Pagamento'}
                  {step === 'processing' && 'Processando Pagamento'}
                  {step === 'success' && 'Pagamento Aprovado!'}
                </h2>
                <p className="text-muted-foreground">
                  Plano {plan.name} - {billingCycle === 'monthly' ? 'Mensal' : 'Anual'}
                </p>
              </div>
            </div>
            {step !== 'processing' && (
              <Button variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Etapa 1: Detalhes */}
            {step === 'details' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Seus Dados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CPF/CNPJ</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <input
                        type="tel"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Dados do Condomínio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Nome do Condomínio</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.condominiumName}
                        onChange={(e) => handleInputChange('condominiumName', e.target.value)}
                        placeholder="Residencial Jardim das Flores"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Número de Unidades</label>
                      <input
                        type="number"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.units}
                        onChange={(e) => handleInputChange('units', e.target.value)}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CEP</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Endereço</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Rua das Flores, 123"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cidade</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estado</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="SP"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => setStep('payment')} 
                    className="flex-1"
                    disabled={!formData.fullName || !formData.email || !formData.condominiumName}
                  >
                    Continuar para Pagamento
                  </Button>
                </div>
              </>
            )}

            {/* Etapa 2: Pagamento */}
            {step === 'payment' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <button
                        onClick={() => setPaymentMethod('credit')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentMethod === 'credit' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Cartão de Crédito</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <Smartphone className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">PIX</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          paymentMethod === 'boleto' ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <Banknote className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Boleto</span>
                      </button>
                    </div>

                    {paymentMethod === 'credit' && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Número do Cartão</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Nome no Cartão</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            placeholder="Nome como está no cartão"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Validade</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">CVV</label>
                            <input
                              type="text"
                              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'pix' && (
                      <div className="text-center py-8">
                        <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h4 className="font-medium mb-2">Pagamento via PIX</h4>
                        <p className="text-sm text-muted-foreground">
                          Após confirmar, você receberá o código PIX para pagamento instantâneo.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'boleto' && (
                      <div className="text-center py-8">
                        <Banknote className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <h4 className="font-medium mb-2">Pagamento via Boleto</h4>
                        <p className="text-sm text-muted-foreground">
                          O boleto será gerado e enviado por email. Vencimento em 3 dias úteis.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={formData.acceptTerms}
                          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        />
                        <span className="text-sm">
                          Aceito os <button className="text-primary hover:underline">termos de uso</button> e 
                          <button className="text-primary hover:underline ml-1">política de privacidade</button>
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded"
                          checked={formData.acceptNewsletter}
                          onChange={(e) => handleInputChange('acceptNewsletter', e.target.checked)}
                        />
                        <span className="text-sm">Quero receber novidades e ofertas por email</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    onClick={handlePayment} 
                    className="flex-1"
                    disabled={!formData.acceptTerms || (paymentMethod === 'credit' && (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv))}
                  >
                    Finalizar Pagamento
                  </Button>
                </div>
              </>
            )}

            {/* Etapa 3: Processando */}
            {step === 'processing' && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <h3 className="text-xl font-semibold mb-2">Processando Pagamento</h3>
                <p className="text-muted-foreground">
                  Aguarde enquanto processamos seu pagamento de forma segura...
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Transação 256-bit SSL criptografada</span>
                </div>
              </div>
            )}

            {/* Etapa 4: Sucesso */}
            {step === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold mb-2">Pagamento Aprovado!</h3>
                <p className="text-muted-foreground mb-6">
                  Seu plano foi ativado com sucesso. Você receberá um email com todos os detalhes.
                </p>
                
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Próximos passos:</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 text-left">
                    <li>✅ Acesso liberado em até 5 minutos</li>
                    <li>✅ Credenciais enviadas por email</li>
                    <li>✅ Treinamento gratuito agendado</li>
                    <li>✅ Suporte técnico disponível</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Recibo
                  </Button>
                  <Button onClick={onClose} className="flex-1">
                    <Receipt className="h-4 w-4 mr-2" />
                    Acessar Sistema
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded">
                    <plan.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Faturamento {billingCycle === 'monthly' ? 'mensal' : 'anual'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plano {billingCycle === 'monthly' ? 'mensal' : 'anual'}</span>
                    <span>R$ {getCurrentPrice()}/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de implementação</span>
                    <span>R$ {plan.setupFee}</span>
                  </div>
                  {billingCycle === 'yearly' && savings.savings > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Desconto anual</span>
                      <span>-R$ {savings.savings}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total primeiro mês</span>
                    <span>R$ {getTotalPrice()}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Inclui {plan.maxUnits} unidades</p>
                  <p>• Até {plan.maxResidents} moradores</p>
                  <p>• Suporte técnico incluído</p>
                  <p>• Backup automático</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-secondary/10 rounded">
                  <Lock className="h-3 w-3" />
                  <span>Pagamento 100% seguro e criptografado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
