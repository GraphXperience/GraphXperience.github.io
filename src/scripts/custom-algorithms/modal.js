import { getCustomAlgorithms, setCustomAlgorithms, getCurrentFile } from './context.js';
import { createCustomAlgorithmButton } from './button-builder.js';

const section = document.getElementById('custom-algorithms-section');
const modal = document.getElementById('custom-algorithms-modal');
const closeButton = document.getElementById('custom-algorithms-close-button');
const confirmButton = document.getElementById('custom-algorithms-ok-button');
const cancelButton = document.getElementById('custom-algorithms-cancel-button');
const nameInput = document.getElementById('custom-algorithms-name-input');
const descriptionInput = document.getElementById('custom-algorithms-description-textarea');

function setupCustomAlgorithmsModal() {
    const closeModal = () => {
        modal.style.display = 'none';
        nameInput.value = '';
        descriptionInput.value = '';
    };

    const confirmAlgorithm = () => {
        const algorithmName = nameInput.value;
        const algorithmDescription = descriptionInput.value;
        const fileContent = getCurrentFile().fileContent;
        
        if (!algorithmName) {
            alert('Coloque um nome de algoritmo válido');
            nameInput.focus();
            return;
        }

        const customAlgorithm = {
            fileContent: fileContent,
            algorithmName: algorithmName,
            algorithmDescription: algorithmDescription,
        };

        upsertCustomAlgorithm(customAlgorithm);

        closeModal();
    }

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', confirmAlgorithm);
}

function upsertCustomAlgorithm(newCustomAlgorithm) {
    let customAlgorithms = getCustomAlgorithms();
    const existingAlgorithmIndex = customAlgorithms.findIndex(alg => alg.algorithmName === newCustomAlgorithm.algorithmName);

    if (existingAlgorithmIndex !== -1) {
        customAlgorithms[existingAlgorithmIndex] = newCustomAlgorithm;
    } else {
        customAlgorithms.push(newCustomAlgorithm);
        const listItem = createCustomAlgorithmButton(newCustomAlgorithm);
        section.appendChild(listItem);
    }

    setCustomAlgorithms(customAlgorithms);
}

function openCustomAlgorithmsModal() {
    modal.style.display = 'block';
    nameInput.value = getCurrentFile().fileName;
    nameInput.focus();
}

export {
    setupCustomAlgorithmsModal,
    openCustomAlgorithmsModal,
};
