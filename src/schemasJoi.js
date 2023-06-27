import Joi from 'joi';
import { arrayCadastro } from './varDec.js';


export const schemaName = Joi.object().keys({
    name: Joi.string().min(1).required(),
});
export const schemaMessage = Joi.object().keys({
    to: Joi.string().min(1).required().valid(...arrayCadastro.map(participant => participant.name)),
    text: Joi.string().min(1).required(),
    type: Joi.string().valid('message', 'private_message').required(),
    from: Joi.string().required().valid(...arrayCadastro.map(participant => participant.name))
});
export const schemaLimit = Joi.object().keys({
    limit: Joi.number().greater(0).required(),
});