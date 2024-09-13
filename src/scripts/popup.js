document.getElementById('algorithm-popup-close-button').addEventListener('click', closePopup);

function openPopup(...messages) {
    const popupContent = document.getElementById("algorithm-popup-content-p");

    if (messages.length > 0) {
        popupContent.innerHTML = messages.join('<br>');
    }
    
    document.getElementById("algorithm-popup").style.display = "block";
}

function closePopup() {
    document.getElementById("algorithm-popup").style.display = "none";
}

export {
    closePopup,
    openPopup,
};
