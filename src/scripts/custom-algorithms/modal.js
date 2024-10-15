import { getCustomAlgorithms, setCustomAlgorithms, getCurrentFile, setCurrentFile } from './context.js';
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

        setCurrentFile(undefined);
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
            id: getCurrentFile().id,
            name: algorithmName,
            description: algorithmDescription,
            fileContent: fileContent,
            isEditing: getCurrentFile().isEditing
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

    if (newCustomAlgorithm.isEditing) {
        const existingAlgorithmIndex = customAlgorithms.findIndex(alg => alg.id === newCustomAlgorithm.id);
        
        if (existingAlgorithmIndex !== -1) {
            let existingCustomAlgorithm = customAlgorithms[existingAlgorithmIndex];
            
            existingCustomAlgorithm.name = newCustomAlgorithm.name;
            existingCustomAlgorithm.description = newCustomAlgorithm.description;
            updateCustomAlgorithmButton(existingCustomAlgorithm);
        }
    } else {
        customAlgorithms.push(newCustomAlgorithm);
        const listItem = createCustomAlgorithmButton(newCustomAlgorithm);
        section.appendChild(listItem);
    }

    setCustomAlgorithms(customAlgorithms);
}

function updateCustomAlgorithmButton(customAlgorithm) {
    const listItem = document.querySelector(`[data-id="li-algorithm-${customAlgorithm.id}"]`);
    
    if (listItem) {
        const buttons = listItem.querySelectorAll('button, img');

        buttons.forEach(button => {
            if (button.dataset.type === 'algorithm') {
                button.textContent = customAlgorithm.name;
            }
    
            button.dataset.name = customAlgorithm.name;
            button.dataset.description = customAlgorithm.description;
        });
    }
}

function openCustomAlgorithmsModal(existentCustomAlgorithm) {
    if (existentCustomAlgorithm) {
        setCurrentFile({
            ...existentCustomAlgorithm,
            isEditing: true
        });
        descriptionInput.value = existentCustomAlgorithm.description;
    }

    modal.style.display = 'block';
    nameInput.value = getCurrentFile().name;
    nameInput.focus();
}

export {
    setupCustomAlgorithmsModal,
    openCustomAlgorithmsModal,
};
