import Joi from 'joi';

export const whatsappMessageSchema = Joi.object({
  phoneNumber: Joi.string().min(12).required(),
  text: Joi.string().min(3).required(),
}).options({ abortEarly: true, allowUnknown: false });
