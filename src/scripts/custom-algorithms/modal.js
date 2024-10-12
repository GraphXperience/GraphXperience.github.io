import { getCustomAlgorithms, setCustomAlgorithms, getCurrentFileContent } from './context.js';
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

        if (!algorithmName) {
            alert('Coloque um nome de algoritmo válido');
            nameInput.focus();
            return;
        }

        const customAlgorithm = {
            fileContent: getCurrentFileContent(),
            algorithmName: algorithmName,
            algorithmDescription: algorithmDescription,
        };

        let customAlgorithms = getCustomAlgorithms();
        customAlgorithms.push(customAlgorithm);
        setCustomAlgorithms(customAlgorithms);

        const listItem = createCustomAlgorithmButton(customAlgorithm);
        section.appendChild(listItem);

        closeModal();
    }

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', confirmAlgorithm);
}

function openCustomAlgorithmsModal() {
    modal.style.display = 'block';
    nameInput.focus();
}

export {
    setupCustomAlgorithmsModal,
    openCustomAlgorithmsModal,
};
