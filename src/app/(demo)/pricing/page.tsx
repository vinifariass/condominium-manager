"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  Check,
  X,
  Star,
  Users,
  Building2,
  MessageSquare,
  Shield,
  Headphones,
  Zap,
  Calendar,
  BarChart3,
  Settings,
  Cloud,
  Database,
  Phone,
  Mail,
  CreditCard,
  Calculator,
  TrendingUp,
  Award,
  Sparkles,
  AlertCircle
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
  features: {
    name: string;
    included: boolean;
    description?: string;
  }[];
  popular?: boolean;
  color: string;
  icon: any;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para condomínios pequenos com funcionalidades essenciais',
      monthlyPrice: 197,
      yearlyPrice: 1970, // 10 meses
      setupFee: 297,
      maxUnits: 50,
      maxResidents: 200,
      color: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800',
      icon: Building2,
      features: [
        { name: 'Gestão de Moradores', included: true, description: 'Cadastro e controle de moradores' },
        { name: 'Controle de Visitantes', included: true, description: 'Registro e autorização de visitantes' },
        { name: 'Gestão de Apartamentos', included: true, description: 'Controle de unidades e ocupação' },
        { name: 'Relatórios Básicos', included: true, description: 'Relatórios essenciais de gestão' },
        { name: 'Suporte por Email', included: true, description: 'Atendimento via email em horário comercial' },
        { name: 'Backup Automático', included: true, description: 'Backup diário dos dados' },
        { name: 'Notificações SMS', included: false, description: 'Cobrado separadamente: R$ 0,08/SMS' },
        { name: 'Notificações WhatsApp', included: false, description: 'Cobrado separadamente: R$ 0,12/mensagem' },
        { name: 'Gestão Financeira', included: false },
        { name: 'Reserva de Áreas Comuns', included: false },
        { name: 'App Mobile', included: false },
        { name: 'Suporte Telefônico', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      description: 'Solução completa para a maioria dos condomínios',
      monthlyPrice: 347,
      yearlyPrice: 3470, // 10 meses
      setupFee: 497,
      maxUnits: 200,
      maxResidents: 800,
      popular: true,
      color: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800',
      icon: Star,
      features: [
        { name: 'Gestão de Moradores', included: true, description: 'Cadastro completo com histórico' },
        { name: 'Controle de Visitantes', included: true, description: 'Sistema avançado com fotos' },
        { name: 'Gestão de Apartamentos', included: true, description: 'Controle detalhado de unidades' },
        { name: 'Relatórios Avançados', included: true, description: 'Relatórios personalizáveis e dashboards' },
        { name: 'Suporte por Email', included: true, description: 'Atendimento prioritário' },
        { name: 'Backup Automático', included: true, description: 'Backup diário com retenção de 30 dias' },
        { name: 'Notificações SMS', included: true, description: 'Até 500 SMS/mês inclusos (R$ 0,08 extras)' },
        { name: 'Notificações WhatsApp', included: true, description: 'Até 1000 mensagens/mês (R$ 0,12 extras)' },
        { name: 'Gestão Financeira', included: true, description: 'Controle completo de receitas e despesas' },
        { name: 'Reserva de Áreas Comuns', included: true, description: 'Sistema completo de agendamento' },
        { name: 'App Mobile', included: true, description: 'Aplicativo para moradores' },
        { name: 'Suporte Telefônico', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Para grandes condomínios e administradoras',
      monthlyPrice: 597,
      yearlyPrice: 5970, // 10 meses
      setupFee: 997,
      maxUnits: 500,
      maxResidents: 2000,
      color: 'border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800',
      icon: Award,
      features: [
        { name: 'Gestão de Moradores', included: true, description: 'Sistema completo multi-condomínio' },
        { name: 'Controle de Visitantes', included: true, description: 'Sistema integrado com catracas' },
        { name: 'Gestão de Apartamentos', included: true, description: 'Gestão ilimitada de unidades' },
        { name: 'Relatórios Personalizados', included: true, description: 'Relatórios sob demanda e BI' },
        { name: 'Suporte Dedicado', included: true, description: 'Gerente de conta dedicado' },
        { name: 'Backup Avançado', included: true, description: 'Backup em tempo real com retenção de 1 ano' },
        { name: 'Notificações SMS', included: true, description: 'SMS ilimitado (sem custo adicional)' },
        { name: 'Notificações WhatsApp', included: true, description: 'WhatsApp ilimitado (sem custo adicional)' },
        { name: 'Gestão Financeira', included: true, description: 'Módulo financeiro completo com integração bancária' },
        { name: 'Reserva de Áreas Comuns', included: true, description: 'Sistema avançado com pagamento online' },
        { name: 'App Mobile', included: true, description: 'App personalizado com marca do condomínio' },
        { name: 'Suporte Telefônico', included: true, description: 'Suporte 24/7 com SLA garantido' }
      ]
    }
  ];

  const additionalServices = [
    {
      name: 'Pacote SMS 1000',
      price: 80,
      unit: 'por pacote',
      description: '1000 SMS com desconto. Válido por 3 meses'
    },
    {
      name: 'Pacote WhatsApp 2000',
      price: 200,
      unit: 'por pacote',
      description: '2000 mensagens WhatsApp com desconto. Válido por 3 meses'
    },
    {
      name: 'Treinamento Presencial',
      price: 497,
      unit: 'por sessão',
      description: 'Treinamento completo da equipe no local'
    },
    {
      name: 'Customização',
      price: 197,
      unit: 'por hora',
      description: 'Desenvolvimento de funcionalidades específicas'
    },
    {
      name: 'Migração de Dados',
      price: 797,
      unit: 'valor único',
      description: 'Importação de dados do sistema anterior'
    },
    {
      name: 'Integração API',
      price: 997,
      unit: 'por integração',
      description: 'Integração com sistemas externos'
    }
  ];

  const benefits = [
    {
      icon: Cloud,
      title: 'Hospedagem Inclusa',
      description: 'Servidores em nuvem de alta performance com 99.9% de uptime garantido'
    },
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Criptografia de dados, SSL e conformidade com LGPD'
    },
    {
      icon: Database,
      title: 'Backup Automático',
      description: 'Seus dados sempre seguros com backup automático diário'
    },
    {
      icon: Headphones,
      title: 'Suporte Especializado',
      description: 'Equipe técnica especializada em gestão condominial'
    },
    {
      icon: Settings,
      title: 'Atualizações Gratuitas',
      description: 'Novas funcionalidades e melhorias sem custo adicional'
    },
    {
      icon: Zap,
      title: 'Performance Otimizada',
      description: 'Sistema rápido e responsivo, otimizado para uso intenso'
    }
  ];

  const calculateSavings = (plan: PricingPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  const getCurrentPrice = (plan: PricingPlan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
  };

  return (
    <ContentLayout title="Planos e Preços">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Escolha o Plano Ideal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para gestão condominial com preços justos e transparentes
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-2 mt-8 mb-4">
            <span className={billingCycle === 'monthly' ? 'font-medium text-foreground' : 'text-muted-foreground'}>
              Mensal
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                billingCycle === 'yearly' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={billingCycle === 'yearly' ? 'font-medium text-foreground' : 'text-muted-foreground'}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700">
                Economize até 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const savings = calculateSavings(plan);
            const currentPrice = getCurrentPrice(plan);
            
            return (
              <Card 
                key={plan.id}
                className={`relative ${plan.color} ${
                  plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1.5 flex items-center gap-1 shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-8' : 'pt-6'} pb-4`}>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-center">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="pt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">R$ {currentPrice}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                        Economize R$ {savings.savings} ({savings.percentage}% de desconto)
                      </p>
                    )}
                    
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Taxa de implementação: R$ {plan.setupFee}</p>
                      <p>Até {plan.maxUnits} unidades • {plan.maxResidents} moradores</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                            {feature.name}
                          </span>
                          {feature.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selecionado ✓' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SMS/WhatsApp Costs Information */}
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="h-5 w-5" />
              Importante: Custos de SMS e WhatsApp
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              Os planos incluem a plataforma e funcionalidades, mas os custos de envio são cobrados separadamente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-yellow-700 dark:text-yellow-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• R$ 0,08 por SMS enviado</li>
                  <li>• Cobrança apenas pelo que usar</li>
                  <li>• Entrega garantida via operadoras</li>
                  <li>• Relatório detalhado de envios</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• R$ 0,12 por mensagem WhatsApp</li>
                  <li>• API oficial do WhatsApp Business</li>
                  <li>• Templates pré-aprovados</li>
                  <li>• Suporte a mídia e documentos</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Estimativa de Uso Mensal por Porte do Condomínio
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-800 dark:text-blue-300">Pequeno (até 50 unidades)</div>
                  <div className="text-blue-700 dark:text-blue-400 mt-1">
                    ~150 notificações/mês<br />
                    <strong>R$ 15 - R$ 30</strong>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-800 dark:text-blue-300">Médio (até 200 unidades)</div>
                  <div className="text-blue-700 dark:text-blue-400 mt-1">
                    ~600 notificações/mês<br />
                    <strong>R$ 60 - R$ 120</strong>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-800 dark:text-blue-300">Grande (até 500 unidades)</div>
                  <div className="text-blue-700 dark:text-blue-400 mt-1">
                    ~1500 notificações/mês<br />
                    <strong>R$ 150 - R$ 300</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">💡 Dicas para Economizar</h4>
              <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                <li>• Configure notificações apenas para situações essenciais</li>
                <li>• Use templates inteligentes que reduzem a necessidade de múltiplas mensagens</li>
                <li>• Priorize WhatsApp para comunicações longas (melhor custo-benefício)</li>
                <li>• Configure horários específicos para envio de lembretes em lote</li>
              </ul>
            </div>

            <div className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
              <strong>Nota importante:</strong> Você tem controle total sobre quando e como as notificações são enviadas. 
              É possível configurar apenas para situações essenciais (visitantes, emergências) para reduzir custos.
              No plano Empresarial, os custos de SMS/WhatsApp estão inclusos sem limite.
            </div>
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Serviços Adicionais
            </CardTitle>
            <CardDescription>
              Serviços extras para personalizar sua experiência
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalServices.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-2xl font-bold text-primary mt-2">
                    R$ {service.price} <span className="text-sm font-normal text-muted-foreground">{service.unit}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">O que está incluído em todos os planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Comparação Detalhada dos Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Funcionalidade</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-3 px-2">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans[0].features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2 font-medium">{feature.name}</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3 px-2">
                          {plan.features[index].included ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium">Como funcionam os custos de SMS e WhatsApp?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Os planos incluem a funcionalidade, mas SMS (R$ 0,08/cada) e WhatsApp (R$ 0,12/cada) são cobrados 
                conforme o uso. No plano Empresarial, estão inclusos sem limite. Você pode comprar pacotes com desconto.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium">Posso trocar de plano a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                Upgrades são aplicados imediatamente, downgrades no próximo ciclo de cobrança.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium">Como funciona a cobrança?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                A cobrança é recorrente (mensal ou anual) via cartão de crédito ou boleto bancário. 
                A taxa de implementação é cobrada apenas uma vez no início.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium">Há período de teste gratuito?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sim, oferecemos 30 dias de teste gratuito em qualquer plano, 
                sem necessidade de cartão de crédito para começar.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium">Os dados ficam seguros?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sim, utilizamos criptografia de ponta, servidores seguros e backup automático. 
                Somos compliance com LGPD e seguimos as melhores práticas de segurança.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">Precisa de um plano personalizado?</h3>
            <p className="text-primary-foreground/90 mb-6 max-w-md mx-auto">
              Entre em contato conosco para planos customizados para grandes administradoras 
              ou condomínios com necessidades específicas.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="secondary">
                <Phone className="h-4 w-4 mr-2" />
                (11) 3456-7890
              </Button>
              <Button variant="secondary">
                <Mail className="h-4 w-4 mr-2" />
                vendas@condominio.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
