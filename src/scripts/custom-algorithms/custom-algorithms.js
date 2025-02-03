import { getCustomAlgorithms, setCustomAlgorithms, setCurrentFile } from './context.js';
import { getCytoscape } from '../context.js';
import { startAnimation } from '../animation';
import { openPopup } from '../popup.js';
import { validateCustomAlgorithm } from './validate.js';
import { openCustomAlgorithmsModal } from './custom-algorithms-modal.js';
import { Graph } from '../models/Graph';
import { getRandomUuid } from '../utils.js';

let cy = getCytoscape();

function runCustomAlgorithm(customAlgorithm) {
    const graph = new Graph(cy);
    const selectedNodeIds = Array.from(cy.data('selectedNodeIds'));
    const selectedNodes = graph.nodes.filter(node => selectedNodeIds.includes(node.id));
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
                    const actions = dynamicFunction(graph, selectedNodes);
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

            const fileNameWithoutExtension = file.name.replace('.js', '');

            setCurrentFile({
                id: getRandomUuid(),
                name: fileNameWithoutExtension,
                description: '',
                fileContent: fileContent,
                isEditing: false
            });

            openCustomAlgorithmsModal(null, fileContent);
        });

        reader.readAsText(file);
    });

    fileInput.click();
}

function clearCustomAlgorithms() {
    let section = document.getElementById('custom-algorithms-section');
    setCustomAlgorithms([]);
    const customAlgorithmListItems = section.querySelectorAll(`[data-id^="li-algorithm"]`);

    customAlgorithmListItems.forEach(item => {
        section.removeChild(item);
    });
}

function downloadCustomAlgorithm(customAlgorithm) {
    if (customAlgorithm && customAlgorithm.fileContent) {
        const blob = new Blob([customAlgorithm.fileContent], { type: 'application/javascript' });

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
    
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = `${customAlgorithm.name}.js`;
        a.click();
    }    
}

export {
    runCustomAlgorithm,
    promptCustomAlgorithmsSelection,
    clearCustomAlgorithms,
    downloadCustomAlgorithm,
};
