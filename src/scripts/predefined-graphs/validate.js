const SPECIFICATION_VALIDATIONS = {
    validNumberOfNodes: {
        relatedFields: [ 'nodeCount', 'nodeCount2' ],
        validate: ({ nodeCount, nodeCount2 }) => !isNaN(nodeCount) && nodeCount >= 1 && (!nodeCount2 || !isNaN(nodeCount2) && nodeCount2 >= 1),
        errorMessage: 'Número de nós deve ser válido e maior que 0'
    },
    validNodeDegree: {
        relatedFields: [ 'nodeDegree' ],
        validate: ({ nodeCount, nodeDegree }) => !isNaN(nodeDegree) && nodeDegree <= nodeCount && nodeDegree % 2 === 0,
        errorMessage: 'O grau dos nós deve ser válido, par e menor que o número de nós',
    },
    wheelNumberOfNodes: {
        relatedFields: [ 'nodeCount' ],
        validate: ({ nodeCount }) => nodeCount >= 4,
        errorMessage: 'Número de nós deve ser maior que 3',
    },
    validHeight: {
        relatedFields: [ 'height' ],
        validate: ({ nodeCount, height }) => !isNaN(height) && height <= nodeCount && height > Math.floor(Math.log2(nodeCount)),
        errorMessage: 'A altura deve ser menor que o número de nós e maior que o piso de log2 do numero de nós',
    },
};

function validatePredefinedGraphSpecifications(graphType, nodeCount, nodeCount2, nodeDegree, height, buttonConfigurationsDict) {
    let errors = [];

    Object.keys(SPECIFICATION_VALIDATIONS).forEach(validationKey => {
        const validation = SPECIFICATION_VALIDATIONS[validationKey];
        const hasRelatedField = validation.relatedFields.some(field => buttonConfigurationsDict[graphType]?.fields.includes(field));

        if (hasRelatedField) {
            const isValid = validation.validate({ nodeCount, nodeCount2, nodeDegree, height });

            if (!isValid) {
                errors.push(validation.errorMessage);
            }
        }
    });

    return errors;
}

export {
    validatePredefinedGraphSpecifications
};
