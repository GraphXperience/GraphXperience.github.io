const confirmOverwriteModal = document.getElementById('confirm-overwrite-modal');
const confirmOverwriteOkButton = document.getElementById('confirm-overwrite-ok-button');
const confirmOverwriteCancelButton = document.getElementById('confirm-overwrite-cancel-button');
const confirmOverwriteCloseButton = document.getElementById('confirm-overwrite-close-button');

let onConfirmCallback = null;

function setupConfirmOverwriteModal() {
    const closeModal = () => {
        confirmOverwriteModal.style.display = 'none';
        onConfirmCallback = null;
    };

    const confirmButton = () => {
        if (typeof onConfirmCallback === 'function') {
            onConfirmCallback();
        }
        
        closeModal();
    }

    confirmOverwriteOkButton.addEventListener('click', confirmButton);
    confirmOverwriteCancelButton.addEventListener('click', closeModal);
    confirmOverwriteCloseButton.addEventListener('click', closeModal);
}

function openConfirmOverwriteModal(callback) {
    confirmOverwriteModal.style.display = 'block';
    onConfirmCallback = callback;
}

export {
    setupConfirmOverwriteModal,
    openConfirmOverwriteModal,
}; 