import Joi from 'joi';
import { arrayCadastro } from './varDec.js';


export const schemaName = Joi.object().keys({
    corrName: Joi.string().min(1).required(),
});

export const schemaMessage = Joi.object().keys({
    corrTo: Joi.string().min(1).required().valid(...arrayCadastro.map(participant => participant.name)),
    corrText: Joi.string().min(1).required(),
    corrType: Joi.string().valid('message', 'private_message').required(),
    corrFrom: Joi.string().required()
})
  

export const schemaLimit = Joi.object().keys({
    limit: Joi.number().greater(0).required(),
});