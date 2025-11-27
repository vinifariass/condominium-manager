"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Check,
  X,
  Cloud,
  Shield,
  Database,
  Headphones,
  Settings,
  Zap,
  MessageSquare,
  Phone,
  Calculator,
  AlertCircle,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Essencial para pequenos condomínios',
      monthlyPrice: 197,
      yearlyPrice: 1970,
      maxUnits: 50,
      maxResidents: 200,
      features: [
        { name: 'Gestão de Moradores', included: true },
        { name: 'Controle de Visitantes', included: true },
        { name: 'Gestão de Apartamentos', included: true },
        { name: 'Relatórios Básicos', included: true },
        { name: 'Suporte por Email', included: true },
        { name: 'Backup Automático', included: true },
        { name: 'Notificações SMS', included: false },
        { name: 'Notificações WhatsApp', included: false },
        { name: 'Gestão Financeira', included: false },
        { name: 'App Mobile', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      description: 'A escolha ideal para a maioria',
      monthlyPrice: 347,
      yearlyPrice: 3470,
      maxUnits: 200,
      maxResidents: 800,
      popular: true,
      features: [
        { name: 'Gestão de Moradores', included: true },
        { name: 'Controle de Visitantes', included: true },
        { name: 'Gestão de Apartamentos', included: true },
        { name: 'Relatórios Avançados', included: true },
        { name: 'Suporte Prioritário', included: true },
        { name: 'Backup com Retenção', included: true },
        { name: 'Notificações SMS (500/mês)', included: true },
        { name: 'Notificações WhatsApp (1k/mês)', included: true },
        { name: 'Gestão Financeira', included: true },
        { name: 'App Mobile', included: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Para grandes operações',
      monthlyPrice: 597,
      yearlyPrice: 5970,
      maxUnits: 500,
      maxResidents: 2000,
      features: [
        { name: 'Gestão Multi-condomínio', included: true },
        { name: 'Controle com Catracas', included: true },
        { name: 'Gestão Ilimitada', included: true },
        { name: 'BI e Relatórios Custom', included: true },
        { name: 'Gerente de Conta', included: true },
        { name: 'Backup em Tempo Real', included: true },
        { name: 'SMS Ilimitado', included: true },
        { name: 'WhatsApp Ilimitado', included: true },
        { name: 'Financeiro Completo', included: true },
        { name: 'App White-label', included: true }
      ]
    }
  ];

  const benefits = [
    { icon: Cloud, title: 'Hospedagem Inclusa', desc: 'Servidores de alta performance' },
    { icon: Shield, title: 'Segurança Total', desc: 'Criptografia e LGPD' },
    { icon: Database, title: 'Backup Diário', desc: 'Seus dados sempre seguros' },
    { icon: Headphones, title: 'Suporte Expert', desc: 'Equipe especializada' },
    { icon: Settings, title: 'Updates Grátis', desc: 'Melhorias constantes' },
    { icon: Zap, title: 'Alta Velocidade', desc: 'Otimizado para o dia a dia' }
  ];

  return (
    <ContentLayout title="Planos e Preços">
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-background p-4 md:p-8 font-sans">

        {/* Header Section */}
        <div className="mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white rounded-full p-0.5">
              <Plus className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-black dark:text-white">Planos flexíveis</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black dark:text-white">
            Preços.
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-xl md:text-2xl font-medium text-black dark:text-white">
              ©2025
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-full border shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                Anual <span className="text-[10px] ml-1 opacity-80">(-17%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, index) => {
            const isDark = plan.popular;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);

            return (
              <div
                key={plan.id}
                className={`
                  rounded-2xl p-8 flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-2
                  animate-in fade-in slide-in-from-bottom-8
                  ${isDark ? 'bg-[#111111] text-white shadow-2xl' : 'bg-white text-black shadow-sm border border-gray-100'}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-medium tracking-tight">{plan.name}</h2>
                </div>

                <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}<br />
                  Até {plan.maxUnits} unidades • {plan.maxResidents} moradores
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">R$ {price}</span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className={`text-xs mt-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      Faturado anualmente R$ {plan.yearlyPrice}
                    </p>
                  )}
                </div>

                <Button
                  className={`
                    w-full rounded-full h-12 font-medium text-base mb-12 transition-transform active:scale-95
                    ${isDark
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'}
                  `}
                >
                  Começar Agora
                </Button>

                <div className="mt-auto">
                  <p className={`text-xs uppercase tracking-wider mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    O que está incluído:
                  </p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className={`mt-0.5 rounded-full p-0.5 ${isDark ? 'bg-gray-800' : 'bg-black'}`}>
                          {feature.included ? (
                            <Plus className="w-2 h-2 text-white" />
                          ) : (
                            <X className="w-2 h-2 text-white" />
                          )}
                        </div>
                        <span className={`${isDark
                            ? (feature.included ? 'text-gray-300' : 'text-gray-600 line-through')
                            : (feature.included ? 'text-gray-700' : 'text-gray-400 line-through')
                          }`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Por que escolher a Condely?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <b.icon className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{b.title}</h4>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Info */}
          <div className="bg-[#FFF8E1] dark:bg-yellow-950/30 rounded-2xl p-8 border border-yellow-100 dark:border-yellow-900">
            <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Custos de Mensagens
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">SMS</span>
                </div>
                <span className="text-sm font-bold text-yellow-900 dark:text-yellow-100">R$ 0,08 /envio</span>
              </div>
              <div className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">WhatsApp</span>
                </div>
                <span className="text-sm font-bold text-yellow-900 dark:text-yellow-100">R$ 0,12 /envio</span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                * No plano Empresarial, o envio é ilimitado sem custo adicional.
              </p>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-6 bg-white rounded-2xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
          <h3 className="text-xl font-bold mb-6">Perguntas Frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-gray-500">Sim, não há fidelidade nos planos mensais. Você pode cancelar ou alterar seu plano quando quiser.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Como funciona o suporte?</h4>
              <p className="text-sm text-gray-500">Oferecemos suporte via email para todos os planos, e suporte prioritário/dedicado nos planos superiores.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Preciso de cartão de crédito?</h4>
              <p className="text-sm text-gray-500">Para o teste grátis de 30 dias não é necessário. Após isso, aceitamos cartão e boleto.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Meus dados estão seguros?</h4>
              <p className="text-sm text-gray-500">Absolutamente. Utilizamos criptografia de ponta e backups diários para garantir a segurança total.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-6 bg-black text-white rounded-2xl p-12 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-1000">
          <h3 className="text-2xl font-bold mb-4">Precisa de algo específico?</h3>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Para grandes administradoras ou necessidades especiais, temos planos customizados.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full">
              <Phone className="w-4 h-4 mr-2" /> Falar com Vendas
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full">
              <Mail className="w-4 h-4 mr-2" /> Enviar Email
            </Button>
          </div>
        </div>

      </div>
    </ContentLayout>
  );
}
