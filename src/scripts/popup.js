const modal = document.getElementById("popup");
modal.querySelector('.modal-close').addEventListener('click', closePopup);

function openPopup(...messages) {
    const popupContent = document.getElementById("popup-content");

    if (messages.length > 0) {
        popupContent.innerHTML = messages.join('<br>');
    }

    modal.showModal();
}

function closePopup() {
    modal.close();
}

export {
    closePopup,
    openPopup,
};
