import { BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { whatsappMessageSchema } from './whatsapp.schemas';
import { IWhatsappMessage } from './interfaces';

export class WhatsappMessageValidatorPipe implements PipeTransform {
  private readonly logger = new Logger(WhatsappMessageValidatorPipe.name);

  transform(value: IWhatsappMessage): IWhatsappMessage {
    const result = whatsappMessageSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }

    if (
      value.phoneNumber.length >= 13 &&
      value.phoneNumber.charAt(4) == '9' &&
      value.phoneNumber.charAt(5) == '9'
    ) {
      value.phoneNumber = `${value.phoneNumber.substring(0, 4)}${value.phoneNumber.substring(5, value.phoneNumber.length)}`;
    }

    return value;
  }
}
