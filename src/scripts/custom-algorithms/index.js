import { getCustomAlgorithms } from './context.js';
import { openCustomAlgorithmsModal, setupCustomAlgorithmsModal } from './modal.js';
import { removeCustomAlgorithm, runCustomAlgorithm } from './custom-algorithms.js';
import { createCustomAlgorithmButton } from './button-builder.js';
import { openInfoWindow } from '../info-window.js';

const customAlgorithmsSection = document.getElementById('custom-algorithms-section');

function setupCustomAlgorithmsButtons() {
    let customAlgorithms = getCustomAlgorithms();

    customAlgorithms.forEach(customAlgorithm => {
        const listItem = createCustomAlgorithmButton(customAlgorithm);
        customAlgorithmsSection.appendChild(listItem);
    });

    customAlgorithmsSection.addEventListener('click', event => {
        let sideBarButton = event.target;
        let customAlgorithmListItem = undefined;
        let customAlgorithm = undefined;

        switch (sideBarButton.dataset.type) {
            case 'algorithm':
                customAlgorithmListItem = sideBarButton.parentNode;
                customAlgorithm = getCustomAlgorithms().find(alg => alg.id=== customAlgorithmListItem.dataset.id.replace('li-algorithm-', ''));
                runCustomAlgorithm(customAlgorithm);
                break;
            case 'delete':
                customAlgorithmListItem = sideBarButton.parentNode;
                customAlgorithm = getCustomAlgorithms().find(alg => alg.id=== customAlgorithmListItem.dataset.id.replace('li-algorithm-', ''));
                removeCustomAlgorithm(customAlgorithm);
                sideBarButton.closest('li').remove();
                break;
            case 'info':
                let algorithmName = sideBarButton.dataset.name;
                let algorithmDescription = sideBarButton.dataset.description;
                openInfoWindow('custom-algorithm', algorithmName, [algorithmDescription]);
                break;
            case 'edit':
                customAlgorithmListItem = sideBarButton.parentNode;
                customAlgorithm = getCustomAlgorithms().find(alg => alg.id=== customAlgorithmListItem.dataset.id.replace('li-algorithm-', ''));
                openCustomAlgorithmsModal(customAlgorithm);
                break;
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
