import { getCustomAlgorithms } from './context.js';
import { setupCustomAlgorithmsModal } from './modal.js';
import { removeCustomAlgorithm, runCustomAlgorithm } from './custom-algorithms.js';
import { createCustomAlgorithmButton } from './button-builder.js';

const customAlgorithmsSection = document.getElementById('custom-algorithms-section');

function setupCustomAlgorithmsButtons() {
    let customAlgorithms = getCustomAlgorithms();

    customAlgorithms.forEach(customAlgorithm => {
        const listItem = createCustomAlgorithmButton(customAlgorithm);
        customAlgorithmsSection.appendChild(listItem);
    });

    customAlgorithmsSection.addEventListener('click', event => {
        customAlgorithms = getCustomAlgorithms();
        const sideBarButton = event.target;

        if (sideBarButton.dataset.type === 'algorithm') {
            const algorithmName = sideBarButton.dataset.name;
            const customAlgorithm = customAlgorithms.find(alg => alg.algorithmName === algorithmName);
            runCustomAlgorithm(customAlgorithm);
        }

        if (sideBarButton.dataset.type === 'delete') {
            const algorithmName = sideBarButton.dataset.name;
            const customAlgorithm = customAlgorithms.find(alg => alg.algorithmName === algorithmName);
            removeCustomAlgorithm(customAlgorithm);
            sideBarButton.closest('li').remove();
        }
    });
}

function initializeCustomAlgorithms() {
    setupCustomAlgorithmsButtons();
    setupCustomAlgorithmsModal();
}

export {
    initializeCustomAlgorithms
};
