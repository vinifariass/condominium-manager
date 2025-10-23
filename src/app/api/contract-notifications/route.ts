import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data para contratos (mesmo que o arquivo contracts/route.ts)
let mockContracts: Array<{
  id: string;
  serviceId: string;
  serviceName: string;
  condominiumId: string;
  condominiumName: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  value: number;
  paymentFrequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  description: string | null;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: '1',
    serviceId: '1',
    serviceName: 'Limpeza de Apartamento',
    condominiumId: '1',
    condominiumName: 'Residencial Jardim das Flores',
    contractNumber: 'CONT-2025-001',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    value: 3600.00,
    paymentFrequency: 'MONTHLY',
    status: 'ACTIVE',
    description: 'Contrato anual para limpeza de áreas comuns',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    serviceId: '2',
    serviceName: 'Jardinagem',
    condominiumId: '1',
    condominiumName: 'Residencial Jardim das Flores',
    contractNumber: 'CONT-2025-002',
    startDate: '2025-02-01',
    endDate: '2025-09-05', // Vence em 5 dias para teste
    value: 2400.00,
    paymentFrequency: 'QUARTERLY',
    status: 'ACTIVE',
    description: 'Manutenção trimestral dos jardins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    serviceId: '3',
    serviceName: 'Manutenção Elétrica',
    condominiumId: '2',
    condominiumName: 'Condomínio Bela Vista',
    contractNumber: 'CONT-2025-003',
    startDate: '2025-03-01',
    endDate: '2025-09-15', // Vence em 15 dias para teste
    value: 1800.00,
    paymentFrequency: 'MONTHLY',
    status: 'ACTIVE',
    description: 'Suporte elétrico mensal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    serviceId: '4',
    serviceName: 'Pintura',
    condominiumId: '3',
    condominiumName: 'Edifício Central Park',
    contractNumber: 'CONT-2025-004',
    startDate: '2025-01-15',
    endDate: '2025-09-03', // Vence em 3 dias para teste
    value: 5000.00,
    paymentFrequency: 'YEARLY',
    status: 'ACTIVE',
    description: 'Pintura anual das fachadas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Função para calcular dias até vencimento
function getDaysUntilExpiration(endDate: string): number {
  const currentDate = new Date();
  const expirationDate = new Date(endDate);
  const timeDiff = expirationDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Função para formatar data em português
function formatDatePT(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// GET: Verificar contratos próximos ao vencimento e preparar notificações
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Filtrar contratos próximos ao vencimento (30 dias)
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(currentDate.getDate() + 30);

    const expiringContracts = mockContracts.filter(contract => {
      if (contract.status !== 'ACTIVE') return false;
      
      const endDate = new Date(contract.endDate);
      const daysToExpire = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      
      return daysToExpire <= 30 && daysToExpire > 0;
    });

    // Preparar notificações para cada contrato próximo ao vencimento
    const notifications = expiringContracts.map((contract) => {
      const endDate = new Date(contract.endDate);
      const daysLeft = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      const expirationDate = formatDatePT(contract.endDate);
      
      // Definir urgência baseada nos dias restantes
      let urgencyLevel = 'info';
      let urgencyText = '';
      
      if (daysLeft <= 7) {
        urgencyLevel = 'critical';
        urgencyText = '🚨 URGENTE - ';
      } else if (daysLeft <= 15) {
        urgencyLevel = 'warning';
        urgencyText = '⚠️ ATENÇÃO - ';
      } else {
        urgencyLevel = 'info';
        urgencyText = '📅 LEMBRETE - ';
      }

      // Criar mensagem personalizada para cada canal
      const baseMessage = `${urgencyText}Contrato próximo ao vencimento!\n\n` +
        `🏢 Condomínio: ${contract.condominiumName}\n` +
        `🔧 Serviço: ${contract.serviceName}\n` +
        `📋 Contrato: ${contract.contractNumber}\n` +
        `📅 Vencimento: ${expirationDate}\n` +
        `⏰ Dias restantes: ${daysLeft} dias\n` +
        `💰 Valor: R$ ${contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
        `📝 Ação necessária: Entre em contato com o prestador para renovação do contrato.`;

      // Mensagens específicas por canal
      const smsMessage = `${urgencyText}Contrato ${contract.contractNumber} do serviço "${contract.serviceName}" no ${contract.condominiumName} vence em ${daysLeft} dias (${expirationDate}). Valor: R$ ${contract.value.toFixed(2)}. Renove já!`;
      
      const whatsappMessage = baseMessage + `\n\n💬 Responda esta mensagem para mais informações ou para iniciar o processo de renovação.`;
      
      const telegramMessage = baseMessage + `\n\n🤖 Use os comandos /renovar ou /contato para ações rápidas.`;

      return {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        serviceName: contract.serviceName,
        condominiumName: contract.condominiumName,
        expirationDate: contract.endDate,
        daysToExpire: daysLeft,
        urgencyLevel,
        notifications: {
          sms: {
            title: `Contrato ${contract.contractNumber} - Vencimento em ${daysLeft} dias`,
            message: smsMessage,
            type: 'SMS' as const
          },
          whatsapp: {
            title: `Contrato ${contract.contractNumber} - Vencimento em ${daysLeft} dias`,
            message: whatsappMessage,
            type: 'WHATSAPP' as const
          },
          telegram: {
            title: `Contrato ${contract.contractNumber} - Vencimento em ${daysLeft} dias`,
            message: telegramMessage,
            type: 'TELEGRAM' as const
          }
        }
      };
    });

    return NextResponse.json({
      totalExpiringContracts: expiringContracts.length,
      notifications,
      summary: {
        critical: notifications.filter((n: any) => n.urgencyLevel === 'critical').length,
        warning: notifications.filter((n: any) => n.urgencyLevel === 'warning').length,
        info: notifications.filter((n: any) => n.urgencyLevel === 'info').length
      }
    });

  } catch (error) {
    console.error('Erro ao verificar vencimentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Enviar notificações de vencimento para um contrato específico
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      contractId,
      notificationType, // 'SMS', 'WHATSAPP', 'TELEGRAM'
      recipients, // Array de números/IDs
      customMessage // Mensagem personalizada (opcional)
    } = body;

    if (!contractId || !notificationType || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'contractId, notificationType e recipients são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar dados do contrato
    const contract = mockContracts.find(c => c.id === contractId);

    if (!contract) {
      return NextResponse.json(
        { error: 'Contrato não encontrado' },
        { status: 404 }
      );
    }

    // Calcular dias até vencimento
    const daysLeft = getDaysUntilExpiration(contract.endDate);
    const expirationDate = formatDatePT(contract.endDate);

    // Gerar mensagem se não foi fornecida uma customizada
    let message = customMessage;
    if (!message) {
      let urgencyText = '';
      if (daysLeft <= 7) urgencyText = '🚨 URGENTE - ';
      else if (daysLeft <= 15) urgencyText = '⚠️ ATENÇÃO - ';
      else urgencyText = '📅 LEMBRETE - ';

      message = `${urgencyText}Contrato próximo ao vencimento!\n\n` +
        `🏢 Condomínio: ${contract.condominiumName}\n` +
        `🔧 Serviço: ${contract.serviceName}\n` +
        `📋 Contrato: ${contract.contractNumber}\n` +
        `📅 Vencimento: ${expirationDate}\n` +
        `⏰ Dias restantes: ${daysLeft} dias\n` +
        `💰 Valor: R$ ${contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
        `📝 Entre em contato para renovação.`;
    }

    // Enviar notificação usando a API de notificações real
    console.log(`Enviando notificação por ${notificationType} para:`, recipients);
    
    try {
      const notificationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-call': 'true'
        },
        body: JSON.stringify({
          title: `Contrato ${contract.contractNumber} - Vencimento em ${daysLeft} dias`,
          message,
          type: notificationType,
          recipients,
          condominiumId: contract.condominiumId
        })
      });

      let notificationResult;
      if (notificationResponse.ok) {
        notificationResult = await notificationResponse.json();
        console.log('Notificação enviada com sucesso:', notificationResult);
      } else {
        const errorText = await notificationResponse.text();
        console.error('Erro na API de notificações:', errorText);
        throw new Error(`Erro na API de notificações: ${errorText}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Notificação de vencimento enviada com sucesso',
        contract: {
          id: contract.id,
          contractNumber: contract.contractNumber,
          serviceName: contract.serviceName,
          condominiumName: contract.condominiumName,
          expirationDate,
          daysToExpire: daysLeft
        },
        notification: notificationResult
      });

    } catch (notificationError) {
      console.error('Erro ao chamar API de notificações:', notificationError);
      
      // Retornar erro mas com mais detalhes
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar notificação: ' + (notificationError instanceof Error ? notificationError.message : 'Erro desconhecido'),
        contract: {
          id: contract.id,
          contractNumber: contract.contractNumber,
          serviceName: contract.serviceName,
          condominiumName: contract.condominiumName,
          expirationDate,
          daysToExpire: daysLeft
        },
        error: notificationError instanceof Error ? notificationError.message : 'Erro desconhecido'
      });
    }

  } catch (error) {
    console.error('Erro ao enviar notificação de vencimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT: Enviar notificações automáticas para todos os contratos próximos ao vencimento
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      notificationType, // 'SMS', 'WHATSAPP', 'TELEGRAM'
      recipients, // Array de números/IDs (administradores)
      daysThreshold = 30 // Notificar contratos que vencem em X dias
    } = body;

    if (!notificationType || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'notificationType e recipients são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar contratos próximos ao vencimento
    const currentDate = new Date();
    const expiringContracts = mockContracts.filter(contract => {
      if (contract.status !== 'ACTIVE') return false;
      
      const endDate = new Date(contract.endDate);
      const daysToExpire = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      
      return daysToExpire <= daysThreshold && daysToExpire > 0;
    });
    
    if (expiringContracts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum contrato próximo ao vencimento encontrado',
        sentNotifications: 0
      });
    }

    // Simular envio de notificações para cada contrato
    const results = [];
    for (const contract of expiringContracts) {
      try {
        const daysLeft = getDaysUntilExpiration(contract.endDate);
        const expirationDate = formatDatePT(contract.endDate);

        let urgencyText = '';
        if (daysLeft <= 7) urgencyText = '🚨 URGENTE - ';
        else if (daysLeft <= 15) urgencyText = '⚠️ ATENÇÃO - ';
        else urgencyText = '📅 LEMBRETE - ';

        const message = `${urgencyText}Contrato próximo ao vencimento!\n\n` +
          `🏢 Condomínio: ${contract.condominiumName}\n` +
          `🔧 Serviço: ${contract.serviceName}\n` +
          `📋 Contrato: ${contract.contractNumber}\n` +
          `📅 Vencimento: ${expirationDate}\n` +
          `⏰ Dias restantes: ${daysLeft} dias\n` +
          `💰 Valor: R$ ${contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n` +
          `📝 Entre em contato para renovação.`;

        console.log(`Enviando notificação em massa por ${notificationType} para contrato:`, {
          contractNumber: contract.contractNumber,
          message,
          recipients
        });

        // Simular sucesso/falha
        const success = Math.random() > 0.1; // 90% de sucesso

        results.push({
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          success,
          result: {
            status: success ? 'SENT' : 'FAILED',
            message: success ? 'Enviado com sucesso' : 'Falha no envio'
          }
        });

      } catch (error) {
        results.push({
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Notificações processadas: ${successCount} enviadas, ${failureCount} falharam`,
      sentNotifications: successCount,
      failedNotifications: failureCount,
      results
    });

  } catch (error) {
    console.error('Erro ao enviar notificações automáticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
