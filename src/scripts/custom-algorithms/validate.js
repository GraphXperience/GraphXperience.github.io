const CUSTOM_ALGORITHM_VALIDATIONS = {
    functionHeader: {
        pattern: new RegExp(/function\s+customAlgorithm\s*\(\s*graph\s*(?:,\s*\w+\s*)*\)/),
        errorMessage: "- Deve haver uma 'function' com nome 'customAlgorithm' e parâmetro 'graph' obrigatório."
    }
};

function validateCustomAlgorithm(algorithmCode) {
    let errors = [];

    for (const key in CUSTOM_ALGORITHM_VALIDATIONS) {
        const { pattern, errorMessage } = CUSTOM_ALGORITHM_VALIDATIONS[key];

        if (!pattern.test(algorithmCode)) {
            errors.push(errorMessage);
        }
    }

    return errors;
}

export {
    validateCustomAlgorithm
}
