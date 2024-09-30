import { getCustomAlgorithms, setCustomAlgorithms, setCurrentFileContent } from './context.js';
import { getCytoscape } from '../context.js';
import { startAnimation } from '../animation/animation.js';
import { openPopup } from '../popup.js';
import { validateCustomAlgorithm } from './validate.js';
import { openModal } from './modal.js';
import { Graph } from '../models/Graph.js';

let cy = getCytoscape();

function runCustomAlgorithm(customAlgorithm) {
    const graph = new Graph(cy);
    const blob = new Blob([customAlgorithm.fileContent], { type: 'application/javascript' });

    let fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');

        script.src = url;
        script.async = true;

        script.addEventListener('load', async () => {
            try {
                const functionName = 'customAlgorithm';
                const dynamicFunction = window[functionName];

                if (typeof dynamicFunction === 'function') {
                    const actions = dynamicFunction(graph);
                    await startAnimation(actions);
                } else {
                    openPopup(`Erro ao carregar o arquivo: a função '${functionName}' não foi encontrada ou não é uma função válida.`);
                }
            } catch (error) {
                openPopup(`Erro ao executar o algoritmo: ${error.message}`);
            } finally {
                URL.revokeObjectURL(url);
                script.remove();
            }
        });

        script.addEventListener('error', event => {
            openPopup(`Erro ao carregar o script: ${event.message}`);

            URL.revokeObjectURL(url);
            script.remove();
        });

        document.head.appendChild(script);
    });

    fileReader.addEventListener('error', event => {
        openPopup(`Erro ao ler o arquivo: ${event.message}`);
    });

    fileReader.readAsText(blob);
}

function removeCustomAlgorithm(customAlgorithm) {
    const currentAlgorithms = getCustomAlgorithms();
    const updatedAlgorithms = currentAlgorithms.filter(alg => alg !== customAlgorithm);

    setCustomAlgorithms(updatedAlgorithms);
}

function promptCustomAlgorithmsSelection() {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = '.js';

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];

        if (!file.name.endsWith('.js')) {
            openPopup(`Erro ao carregar o arquivo: O arquivo '${file.name}' não é um arquivo JavaScript (.js)`);
            return;
        }

        const reader = new FileReader();

        reader.addEventListener('load', event => {
            const fileContent = event.target.result;
            const validationErrors = validateCustomAlgorithm(fileContent);

            if (validationErrors.length > 0) {
                openPopup(`Erro ao carregar o arquivo '${file.name}'.`, ...validationErrors);
                return;
            }

            setCurrentFileContent(fileContent);
            openModal();
        });

        reader.readAsText(file);
    });

    fileInput.click();
}

export {
    runCustomAlgorithm,
    removeCustomAlgorithm,
    promptCustomAlgorithmsSelection,
};