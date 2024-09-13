function setupClipboard(cy) {
    return cy.clipboard({
        afterPaste: () => cy.trigger('save')
    });
}

export {
    setupClipboard
};