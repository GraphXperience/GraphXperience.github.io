const VALID_ACTIONS = {
    animate: {
        required: ['elementId'],
        properties: {
            type: { type: 'string' },
            elementId: { type: 'string' },
            color: { type: 'string' },
            size: { type: 'number', min: 1, max: 10 },
            tag: { type: 'string' },
            weight: { type: 'number', min: 1, max: Infinity },
        }
    },
    print: {
        required: ['message'],
        properties: {
            type: { type: 'string' },
            message: { type: 'string' },
            color: { type: 'string' },
        }
    }
};

/**
 * Validate animation input
 * @param {any[]} actions
 */
function validate(actions) {
    const errors = [];

    let index = 0;
    for (const action of actions) {
        if (!action.hasOwnProperty('type')) {
            errors.push(`actions[${index}] não tem um type.`);
            continue;
        }
        if (!VALID_ACTIONS.hasOwnProperty(action.type)) {
            errors.push(`actions[${index}] não tem um type válido. Os possíveis valores são [${Object.keys(VALID_ACTIONS).join(', ')}].`);
            continue;
        }
        if (!VALID_ACTIONS[action.type].required.every(prop => action.hasOwnProperty(prop))) {
            errors.push(`actions[${index}] não possui uma das seguintes propriedades obrigatórias: [${VALID_ACTIONS[action.type].required.join(', ')}].`);
        }

        const propertiesSchema = VALID_ACTIONS[action.type].properties;
        for (const prop in action) {
            if (!(prop in propertiesSchema)) {
                errors.push(`actions[${index}] possui uma propriedade inválida [${prop}].`);
                continue;
            }

            const { type, min, max, pattern } = propertiesSchema[prop];
            if (typeof (action[prop]) !== type) {
                errors.push(`actions[${index}].${prop} possui o tipo ${typeof (action[prop])} e deveria ser ${type}.`);
                continue;
            }
            if (pattern && !pattern.test(action[prop])) {
                errors.push(`actions[${index}].${prop} não segue a expressão regular ${pattern.source}.`);
                continue;
            }
            if (min && max && (action[prop] < min || action[prop] > max)) {
                errors.push(`actions[${index}].${prop} possui um valor invalido e deve ser maior que ${min} e menor que ${max}.`);
            }
        }

        index++;
    }

    return errors;
}

export {
    validate
}