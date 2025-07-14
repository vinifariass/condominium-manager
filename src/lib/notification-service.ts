// Serviço de notificações para SMS e WhatsApp
export interface NotificationTemplate {
  id: string;
  name: string;
  sms: string;
  whatsapp: string;
  variables: string[];
}

export interface NotificationConfig {
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  smsProvider: 'twilio' | 'textbelt' | 'zenvia';
  whatsappProvider: 'twilio' | 'whatsapp-web-js' | 'baileys';
  credentials: {
    accountSid?: string;
    authToken?: string;
    fromNumber?: string;
    apiKey?: string;
  };
}

export interface NotificationRecipient {
  name: string;
  phone: string;
  apartment?: string;
  preferredMethod: 'sms' | 'whatsapp' | 'both';
}

export interface NotificationData {
  template: NotificationTemplate;
  recipients: NotificationRecipient[];
  variables: Record<string, string>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledAt?: Date;
}

// Templates pré-definidos para diferentes tipos de notificação
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'visitor_arrival',
    name: 'Chegada de Visitante',
    sms: 'Olá {{resident_name}}! Você tem um visitante: {{visitor_name}} na portaria. Autorizar entrada? Responda SIM ou NÃO.',
    whatsapp: '🏠 *Condomínio {{condominium_name}}*\n\nOlá {{resident_name}}!\n\nVocê tem um visitante na portaria:\n👤 **{{visitor_name}}**\n📱 {{visitor_phone}}\n🕐 {{arrival_time}}\n\nDeseja autorizar a entrada?\nResponda *SIM* ou *NÃO*',
    variables: ['resident_name', 'visitor_name', 'visitor_phone', 'arrival_time', 'condominium_name']
  },
  {
    id: 'delivery_arrival',
    name: 'Chegada de Entrega',
    sms: 'Entrega para {{resident_name}} - Apt {{apartment}}. Empresa: {{delivery_company}}. Autorizar entrada?',
    whatsapp: '📦 *Entrega Chegou!*\n\nPara: {{resident_name}}\nApartamento: {{apartment}}\nEmpresa: {{delivery_company}}\nDescrição: {{description}}\n\nAutorizar entrada do entregador?',
    variables: ['resident_name', 'apartment', 'delivery_company', 'description']
  },
  {
    id: 'maintenance_scheduled',
    name: 'Manutenção Agendada',
    sms: 'Manutenção agendada para {{date}} às {{time}} na área: {{area}}. Condomínio {{condominium_name}}.',
    whatsapp: '🔧 *Manutenção Agendada*\n\n📅 Data: {{date}}\n🕐 Horário: {{time}}\n📍 Local: {{area}}\n\nPor favor, evite usar a área durante este período.\n\nCondomínio {{condominium_name}}',
    variables: ['date', 'time', 'area', 'condominium_name']
  },
  {
    id: 'payment_reminder',
    name: 'Lembrete de Pagamento',
    sms: 'Lembrete: Taxa condominial vence em {{days_until_due}} dias. Valor: R$ {{amount}}. Apt {{apartment}}.',
    whatsapp: '💰 *Lembrete de Pagamento*\n\nApartamento: {{apartment}}\nValor: R$ {{amount}}\nVencimento: {{due_date}}\n\n⏰ Vence em {{days_until_due}} dias\n\nPague pelo PIX: {{pix_key}} ou acesse o portal do condomínio.',
    variables: ['apartment', 'amount', 'due_date', 'days_until_due', 'pix_key']
  },
  {
    id: 'emergency_alert',
    name: 'Alerta de Emergência',
    sms: 'EMERGÊNCIA no {{condominium_name}}: {{emergency_type}}. {{instructions}}',
    whatsapp: '🚨 *ALERTA DE EMERGÊNCIA* 🚨\n\nCondomínio: {{condominium_name}}\nTipo: {{emergency_type}}\n\n{{instructions}}\n\nEm caso de dúvidas, entre em contato com a administração.',
    variables: ['condominium_name', 'emergency_type', 'instructions']
  },
  {
    id: 'reservation_confirmation',
    name: 'Confirmação de Reserva',
    sms: 'Reserva confirmada! {{area}} em {{date}} das {{start_time}} às {{end_time}}. Valor: R$ {{amount}}.',
    whatsapp: '✅ *Reserva Confirmada*\n\n📍 Área: {{area}}\n📅 Data: {{date}}\n🕐 Horário: {{start_time}} às {{end_time}}\n💰 Valor: R$ {{amount}}\n\nLembre-se de seguir as regras de uso!',
    variables: ['area', 'date', 'start_time', 'end_time', 'amount']
  }
];

class NotificationService {
  private config: NotificationConfig;

  constructor(config: NotificationConfig) {
    this.config = config;
  }

  // Substitui variáveis no template
  private replaceVariables(template: string, variables: Record<string, string>): string {
    let message = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value);
    });
    return message;
  }

  // Formata número de telefone brasileiro
  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não tiver
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+55${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return `+${cleaned}`;
    }
    
    return `+55${cleaned}`;
  }

  // Envia SMS via Twilio
  private async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      // Simulação de envio via Twilio
      console.log('📱 Enviando SMS via Twilio:');
      console.log(`Para: ${to}`);
      console.log(`Mensagem: ${message}`);
      
      // Em produção, aqui seria a chamada real para a API do Twilio
      /*
      const client = twilio(this.config.credentials.accountSid, this.config.credentials.authToken);
      const result = await client.messages.create({
        body: message,
        from: this.config.credentials.fromNumber,
        to: to
      });
      return !!result.sid;
      */
      
      // Simula sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return false;
    }
  }

  // Envia WhatsApp
  private async sendWhatsApp(to: string, message: string): Promise<boolean> {
    try {
      console.log('💬 Enviando WhatsApp:');
      console.log(`Para: ${to}`);
      console.log(`Mensagem: ${message}`);
      
      // Em produção, aqui seria a integração com WhatsApp API
      /*
      if (this.config.whatsappProvider === 'twilio') {
        const client = twilio(this.config.credentials.accountSid, this.config.credentials.authToken);
        const result = await client.messages.create({
          body: message,
          from: `whatsapp:${this.config.credentials.fromNumber}`,
          to: `whatsapp:${to}`
        });
        return !!result.sid;
      }
      */
      
      // Simula sucesso
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }

  // Método principal para enviar notificações
  async sendNotification(data: NotificationData): Promise<{
    success: boolean;
    results: Array<{
      recipient: string;
      method: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const results: Array<{
      recipient: string;
      method: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const recipient of data.recipients) {
      const formattedPhone = this.formatPhoneNumber(recipient.phone);
      
      // Prepara variáveis com dados do destinatário
      const variables = {
        ...data.variables,
        resident_name: recipient.name,
        apartment: recipient.apartment || '',
      };

      // Decide quais métodos usar
      const methods: ('sms' | 'whatsapp')[] = [];
      if (recipient.preferredMethod === 'both') {
        if (this.config.smsEnabled) methods.push('sms');
        if (this.config.whatsappEnabled) methods.push('whatsapp');
      } else if (recipient.preferredMethod === 'sms' && this.config.smsEnabled) {
        methods.push('sms');
      } else if (recipient.preferredMethod === 'whatsapp' && this.config.whatsappEnabled) {
        methods.push('whatsapp');
      }

      // Envia por cada método escolhido
      for (const method of methods) {
        try {
          const template = method === 'sms' ? data.template.sms : data.template.whatsapp;
          const message = this.replaceVariables(template, variables);
          
          let success = false;
          if (method === 'sms') {
            success = await this.sendSMS(formattedPhone, message);
          } else {
            success = await this.sendWhatsApp(formattedPhone, message);
          }

          results.push({
            recipient: recipient.name,
            method,
            success
          });

        } catch (error) {
          results.push({
            recipient: recipient.name,
            method,
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }
      }
    }

    const success = results.every(r => r.success);
    return { success, results };
  }

  // Envia alerta de emergência para todos os moradores
  async sendEmergencyAlert(
    emergencyType: string,
    instructions: string,
    condominiumName: string,
    residents: NotificationRecipient[]
  ) {
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === 'emergency_alert')!;
    
    return this.sendNotification({
      template,
      recipients: residents,
      variables: {
        condominium_name: condominiumName,
        emergency_type: emergencyType,
        instructions
      },
      priority: 'urgent'
    });
  }

  // Notifica chegada de visitante
  async notifyVisitorArrival(
    residentName: string,
    residentPhone: string,
    visitorName: string,
    visitorPhone: string,
    condominiumName: string,
    apartment: string
  ) {
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === 'visitor_arrival')!;
    
    return this.sendNotification({
      template,
      recipients: [{
        name: residentName,
        phone: residentPhone,
        apartment,
        preferredMethod: 'whatsapp' // Preferir WhatsApp para confirmações
      }],
      variables: {
        visitor_name: visitorName,
        visitor_phone: visitorPhone,
        arrival_time: new Date().toLocaleTimeString('pt-BR'),
        condominium_name: condominiumName
      },
      priority: 'high'
    });
  }

  // Lembrete de pagamento
  async sendPaymentReminder(
    residents: Array<{
      name: string;
      phone: string;
      apartment: string;
      amount: number;
      dueDate: Date;
      preferredMethod: 'sms' | 'whatsapp' | 'both';
    }>,
    pixKey: string
  ) {
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === 'payment_reminder')!;
    
    const recipients = residents.map(r => ({
      name: r.name,
      phone: r.phone,
      apartment: r.apartment,
      preferredMethod: r.preferredMethod
    }));

    // Envia para cada morador com seus dados específicos
    const promises = residents.map(resident => {
      const daysUntilDue = Math.ceil(
        (resident.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return this.sendNotification({
        template,
        recipients: [{
          name: resident.name,
          phone: resident.phone,
          apartment: resident.apartment,
          preferredMethod: resident.preferredMethod
        }],
        variables: {
          amount: resident.amount.toFixed(2),
          due_date: resident.dueDate.toLocaleDateString('pt-BR'),
          days_until_due: daysUntilDue.toString(),
          pix_key: pixKey
        },
        priority: daysUntilDue <= 3 ? 'high' : 'medium'
      });
    });

    const results = await Promise.all(promises);
    return {
      success: results.every(r => r.success),
      results: results.flatMap(r => r.results)
    };
  }
}

// Configuração padrão
export const defaultNotificationConfig: NotificationConfig = {
  smsEnabled: true,
  whatsappEnabled: true,
  smsProvider: 'twilio',
  whatsappProvider: 'twilio',
  credentials: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
    apiKey: process.env.NOTIFICATION_API_KEY || ''
  }
};

// Instância global do serviço
export const notificationService = new NotificationService(defaultNotificationConfig);

export { NotificationService };
