const modal = document.getElementById('confirm-overwrite-modal');
const cancelButton = modal.querySelector('.modal-close');
const okButton = modal.querySelector('.modal-confirm');

let onConfirmCallback = null;

function setupConfirmOverwriteModal() {
    const closeModal = () => {
        modal.close();
        onConfirmCallback = null;
    };

    const confirmButton = () => {
        if (typeof onConfirmCallback === 'function') {
            onConfirmCallback();
        }
        
        closeModal();
    }

    cancelButton.addEventListener('click', closeModal);
    okButton.addEventListener('click', confirmButton);
}

function openConfirmOverwriteModal(callback) {
    modal.showModal();
    onConfirmCallback = callback;
}

export {
    setupConfirmOverwriteModal,
    openConfirmOverwriteModal,
}; 