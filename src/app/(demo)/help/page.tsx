"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Play,
  FileText,
  Users,
  Building2,
  Calendar,
  Settings,
  DollarSign,
  Bell,
  Key,
  MapPin,
  BarChart3,
  Search,
  Lightbulb,
  BookOpen,
  Video,
  Download
} from "lucide-react";

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>("getting-started");

  const helpSections = [
    {
      id: "getting-started",
      title: "Primeiros Passos",
      icon: Lightbulb,
      description: "Aprenda o básico para começar a usar o sistema",
      color: "bg-blue-500",
      items: [
        {
          title: "Acessando o Dashboard",
          description: "Como navegar pela tela principal e entender os indicadores",
          steps: [
            "Faça login no sistema com suas credenciais",
            "Na tela principal (Dashboard), você verá um resumo geral",
            "Os cards superiores mostram estatísticas importantes",
            "Use a sidebar esquerda para navegar entre as seções"
          ]
        },
        {
          title: "Navegação no Sistema",
          description: "Como usar o menu lateral e encontrar as funcionalidades",
          steps: [
            "Clique no ícone de menu (☰) para expandir/recolher a sidebar",
            "As opções estão organizadas por categorias (Gestão, Financeiro, etc.)",
            "Use o campo de busca para encontrar páginas rapidamente",
            "Algumas seções possuem submenus - clique para expandir"
          ]
        }
      ]
    },
    {
      id: "condominiums",
      title: "Gestão de Condomínios",
      icon: Building2,
      description: "Como gerenciar condomínios, blocos e apartamentos",
      color: "bg-green-500",
      items: [
        {
          title: "Cadastrando um Condomínio",
          description: "Passo a passo para adicionar um novo condomínio",
          steps: [
            "Acesse 'Condomínios' no menu lateral",
            "Clique no botão '+ Novo Condomínio'",
            "Preencha as informações básicas (nome, endereço, CNPJ)",
            "Defina as configurações gerais (taxa, número de blocos)",
            "Salve as informações"
          ]
        },
        {
          title: "Gerenciando Apartamentos",
          description: "Como cadastrar e organizar apartamentos por bloco",
          steps: [
            "Acesse 'Apartamentos' no menu",
            "Selecione o condomínio desejado",
            "Clique em '+ Novo Apartamento'",
            "Defina bloco, número, metragem e proprietário",
            "Configure status (ocupado, vago, etc.)"
          ]
        }
      ]
    },
    {
      id: "residents",
      title: "Gestão de Moradores",
      icon: Users,
      description: "Como cadastrar e gerenciar moradores e visitantes",
      color: "bg-purple-500",
      items: [
        {
          title: "Cadastro de Moradores",
          description: "Como adicionar novos moradores ao sistema",
          steps: [
            "Vá para 'Moradores' no menu",
            "Clique em '+ Novo Morador'",
            "Preencha dados pessoais (nome, CPF, telefone)",
            "Associe ao apartamento correspondente",
            "Defina tipo (proprietário, inquilino, dependente)"
          ]
        },
        {
          title: "Controle de Visitantes",
          description: "Como registrar e autorizar visitantes",
          steps: [
            "Acesse 'Controle de Acesso' > 'Visitantes'",
            "Para visitas programadas: use 'Pré-autorizar Visitante'",
            "Para visitas no momento: use 'Registrar Entrada'",
            "Confirme dados do visitante e apartamento de destino",
            "O sistema gerará um registro de entrada/saída"
          ]
        }
      ]
    },
    {
      id: "areas",
      title: "Áreas Comuns e Reservas",
      icon: MapPin,
      description: "Como gerenciar espaços comuns e reservas",
      color: "bg-orange-500",
      items: [
        {
          title: "Configurando Áreas Comuns",
          description: "Como cadastrar espaços para reserva",
          steps: [
            "Acesse 'Áreas Comuns' no menu",
            "Clique em 'Editar' na área desejada",
            "Configure capacidade, horários e valores",
            "Defina regras de uso e políticas",
            "Ative/desative a área conforme necessário"
          ]
        },
        {
          title: "Gerenciando Reservas",
          description: "Como aprovar e controlar reservas de espaços",
          steps: [
            "Vá para 'Reservas' no menu",
            "Use o calendário para visualizar agendamentos",
            "Clique em uma data para criar nova reserva",
            "Para aprovar: clique em 'Aprovar' nas reservas pendentes",
            "Use os filtros para organizar por status ou período"
          ]
        }
      ]
    },
    {
      id: "financial",
      title: "Gestão Financeira",
      icon: DollarSign,
      description: "Como controlar receitas, despesas e relatórios",
      color: "bg-emerald-500",
      items: [
        {
          title: "Controle de Receitas",
          description: "Como registrar pagamentos e taxas",
          steps: [
            "Acesse 'Financeiro' > 'Receitas'",
            "Registre pagamentos de taxa condominial",
            "Adicione receitas extras (multas, reservas)",
            "Acompanhe inadimplência por apartamento",
            "Gere comprovantes quando necessário"
          ]
        },
        {
          title: "Gestão de Despesas",
          description: "Como controlar gastos do condomínio",
          steps: [
            "Vá para 'Financeiro' > 'Despesas'",
            "Categorize despesas (manutenção, limpeza, etc.)",
            "Anexe comprovantes e notas fiscais",
            "Controle orçamento mensal",
            "Gere relatórios de gastos"
          ]
        }
      ]
    },
    {
      id: "reports",
      title: "Relatórios e Comunicação",
      icon: BarChart3,
      description: "Como gerar relatórios e se comunicar com moradores",
      color: "bg-cyan-500",
      items: [
        {
          title: "Gerando Relatórios",
          description: "Como criar e exportar relatórios do sistema",
          steps: [
            "Acesse 'Relatórios' no menu",
            "Escolha o tipo de relatório desejado",
            "Defina período e filtros",
            "Visualize os dados antes de exportar",
            "Baixe em PDF ou Excel conforme necessário"
          ]
        },
        {
          title: "Comunicação com Moradores",
          description: "Como enviar avisos e notificações",
          steps: [
            "Vá para 'Avisos' ou 'Notificações'",
            "Redija a mensagem desejada",
            "Selecione destinatários (todos ou específicos)",
            "Defina prioridade e data de publicação",
            "Acompanhe visualizações e confirmações"
          ]
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <ContentLayout title="Como usar o sistema">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Central de Ajuda</CardTitle>
                <CardDescription>
                  Guias completos para usar todas as funcionalidades do sistema de gestão condominial
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Video className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Vídeo Tutorial</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="h-5 w-5 text-green-500" />
                <span className="text-sm">Manual PDF</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Search className="h-5 w-5 text-purple-500" />
                <span className="text-sm">Buscar Ajuda</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <span className="text-sm">Suporte</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Sections */}
        <div className="space-y-4">
          {helpSections.map((section) => {
            const isOpen = openSection === section.id;
            const IconComponent = section.icon;
            
            return (
              <Card key={section.id}>
                <CardHeader 
                  className="cursor-pointer" 
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${section.color} rounded-lg`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
                
                {isOpen && (
                  <CardContent>
                    <div className="space-y-6">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                          <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="space-y-2">
                            {item.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-3">
                                <Badge variant="outline" className="mt-0.5 text-xs px-2 py-1">
                                  {stepIndex + 1}
                                </Badge>
                                <span className="text-sm text-foreground">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Support Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Precisa de mais ajuda?</CardTitle>
            <CardDescription>
              Nossa equipe de suporte está pronta para ajudar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">📧</div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">suporte@condominio.com</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">📞</div>
                <h3 className="font-medium">Telefone</h3>
                <p className="text-sm text-muted-foreground">(11) 1234-5678</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-medium">Chat</h3>
                <p className="text-sm text-muted-foreground">Segunda a Sexta, 8h-18h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
