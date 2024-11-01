import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';

interface IWhatsappMessage {
  phoneNumber: string;
  message: string;
}

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.client.on('qr', (qrCode) => {
      this.logger.verbose('Whatsapp awaiting for qrcode...');
      this.eventEmitter.emit('qrcode.created', qrCode);
    });

    this.client.on('ready', () => {
      this.logger.verbose('Whatsapp service connected with success');
    });

    this.client.initialize();
  }

  sendMessage({ phoneNumber, message }: IWhatsappMessage) {
    let number = phoneNumber.replace('@c.us', '');
    number = `${number}@c.us`;

    this.client.setDisplayName('..:: Bot ::..');
    this.client.sendMessage(number, message);

    this.logger.verbose('Whatsapp message sent with success!');
    this.logger.verbose({ number, message });
  }

  logout(): Promise<void> {
    return this.client.destroy();
  }
}
