import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data para notificações
let mockNotifications: Array<{
  id: string;
  title: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'TELEGRAM';
  recipients: string[];
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  errorMessage?: string;
  userId: string;
  condominiumId: string;
  createdAt: string;
  updatedAt: string;
}> = [];

// GET: Buscar histórico de notificações
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get('condominiumId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let filteredNotifications = mockNotifications;

    if (condominiumId) {
      filteredNotifications = filteredNotifications.filter(n => n.condominiumId === condominiumId);
    }

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    if (status) {
      filteredNotifications = filteredNotifications.filter(n => n.status === status);
    }

    return NextResponse.json(filteredNotifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST: Enviar notificação
export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma chamada interna (pelo header ou origem)
    const userAgent = request.headers.get('user-agent');
    const isInternalCall = userAgent?.includes('node') || request.headers.get('x-internal-call') === 'true';
    
    let session = null;
    if (!isInternalCall) {
      session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
    }

    const body = await request.json();
    const {
      title,
      message,
      type,
      recipients,
      condominiumId
    } = body;

    // Validações básicas
    if (!title || !message || !type || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Título, mensagem, tipo e destinatários são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar registro da notificação
    const notification = {
      id: (mockNotifications.length + 1).toString(),
      title,
      message,
      type,
      recipients,
      status: 'PENDING' as 'PENDING' | 'SENT' | 'FAILED',
      sentAt: undefined as string | undefined,
      errorMessage: undefined as string | undefined,
      userId: session?.user?.id || 'system',
      condominiumId: condominiumId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockNotifications.push(notification);

    // Processar envio baseado no tipo
    let sendResult;
    try {
      switch (type) {
        case 'EMAIL':
          sendResult = await sendEmail(title, message, recipients);
          break;
        case 'SMS':
          sendResult = await sendSMS(message, recipients);
          break;
        case 'WHATSAPP':
          sendResult = await sendWhatsApp(message, recipients);
          break;
        case 'TELEGRAM':
          sendResult = await sendTelegram(message, recipients);
          break;
        default:
          throw new Error('Tipo de notificação inválido');
      }

      // Atualizar status
      notification.status = 'SENT';
      notification.sentAt = new Date().toISOString();
    } catch (error) {
      notification.status = 'FAILED';
      notification.errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    }

    notification.updatedAt = new Date().toISOString();

    return NextResponse.json({
      id: notification.id,
      status: notification.status,
      message: notification.status === 'SENT' ? 'Notificação enviada com sucesso' : 'Falha ao enviar notificação',
      error: notification.errorMessage
    });

  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Funções de envio (implementações simuladas)
async function sendEmail(title: string, message: string, recipients: string[]) {
  // Simula envio de email
  console.log('Enviando email:', { title, message, recipients });
  
  // Aqui você implementaria o envio real usando um provedor como:
  // - Nodemailer
  // - SendGrid
  // - AWS SES
  // - etc.
  
  return { success: true, sent: recipients.length };
}

async function sendSMS(message: string, recipients: string[]) {
  console.log('📱 [SMS] Iniciando envio de SMS...');
  console.log('📱 [SMS] Mensagem:', message);
  console.log('📱 [SMS] Destinatários:', recipients);
  
  // Simula envio real para teste
  const results = [];
  for (const recipient of recipients) {
    const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`📱 [SMS] Enviando para ${recipient}...`);
    console.log(`📱 [SMS] ID da mensagem: ${messageId}`);
    console.log(`📱 [SMS] Status: ENVIADO ✅`);
    
    results.push({
      recipient,
      messageId,
      status: 'SENT',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`📱 [SMS] Total enviado: ${results.length} mensagens`);
  
  // Implementação real com Twilio:
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  const promises = recipients.map(phone => 
    client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    })
  );
  
  await Promise.all(promises);
  */
  
  return { success: true, sent: recipients.length, results };
}

async function sendWhatsApp(message: string, recipients: string[]) {
  console.log('💬 [WhatsApp] Iniciando envio de WhatsApp...');
  console.log('💬 [WhatsApp] Mensagem:', message);
  console.log('💬 [WhatsApp] Destinatários:', recipients);
  
  // Simula envio real para teste
  const results = [];
  for (const recipient of recipients) {
    const messageId = `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`💬 [WhatsApp] Enviando para ${recipient}...`);
    console.log(`💬 [WhatsApp] ID da mensagem: ${messageId}`);
    console.log(`💬 [WhatsApp] Status: ENVIADO ✅`);
    
    results.push({
      recipient,
      messageId,
      status: 'SENT',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`💬 [WhatsApp] Total enviado: ${results.length} mensagens`);
  
  // Implementação real com WhatsApp Business API ou biblioteca:
  /*
  const { Client } = require('whatsapp-web.js');
  const client = new Client();
  
  for (const recipient of recipients) {
    await client.sendMessage(recipient, message);
  }
  */
  
  return { success: true, sent: recipients.length, results };
}

async function sendTelegram(message: string, recipients: string[]) {
  console.log('📢 [Telegram] Iniciando envio de Telegram...');
  console.log('📢 [Telegram] Mensagem:', message);
  console.log('📢 [Telegram] Destinatários:', recipients);
  
  // Simula envio real para teste
  const results = [];
  for (const recipient of recipients) {
    const messageId = `telegram_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`📢 [Telegram] Enviando para ${recipient}...`);
    console.log(`📢 [Telegram] ID da mensagem: ${messageId}`);
    console.log(`📢 [Telegram] Status: ENVIADO ✅`);
    
    results.push({
      recipient,
      messageId,
      status: 'SENT',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`📢 [Telegram] Total enviado: ${results.length} mensagens`);
  
  // Implementação real com Telegram Bot API:
  /*
  const TelegramBot = require('node-telegram-bot-api');
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  
  const promises = recipients.map(chatId => 
    bot.sendMessage(chatId, message)
  );
  
  await Promise.all(promises);
  */
  
  return { success: true, sent: recipients.length, results };
}
