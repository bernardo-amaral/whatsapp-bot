import { Controller, Get, Post, Body, Logger, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { OnEvent } from '@nestjs/event-emitter';
import * as QRCode from 'qrcode';
import { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  private qrCode: string;
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly whatsappService: WhatsappService) {}

  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;
  }

  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    this.logger.log('[GET] /qrcode');

    if (!this.qrCode) {
      return response.status(404).send('QR code not found');
    }

    response.setHeader('Content-Type', 'image/png');

    QRCode.toFileStream(response, this.qrCode);
  }

  @Get('logout')
  async logout(@Res() response: Response) {
    this.logger.log('[GET] /logout');
    this.whatsappService.logout().then((resData) => response.json(resData));
  }

  @Post('message')
  sendMessage(@Body() body: any) {
    this.logger.log('[POST] /message');

    this.whatsappService.sendMessage({
      phoneNumber: body.phoneNumber,
      message: body.text,
    });
  }
}
