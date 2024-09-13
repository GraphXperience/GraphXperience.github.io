function setupEdgehandles(cy) {
    let eh = cy.edgehandles({
        snap: true,
        noEdgeEventsInDraw: true,
        disableBrowserGestures: true
    });

    document.getElementById('draw-mode-button').addEventListener('click', function () {
        toggleDrawMode(this, eh);
    });

    return eh;
}

function toggleDrawMode(button, eh) {
    if (button.classList.contains('active')) {
        button.classList.toggle('active');
        eh.disableDrawMode();
        return;
    }

    button.classList.toggle('active');
    eh.enableDrawMode();
}

export {
    setupEdgehandles,
    toggleDrawMode
}