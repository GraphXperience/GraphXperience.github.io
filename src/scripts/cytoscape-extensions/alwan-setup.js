import Alwan from 'alwan';

function setupAlwan() {
    new Alwan('#color-input', {
        opacity: false,
        theme: 'dark',
    });

    new Alwan('#config-editor-color-input', {
        opacity: false,
        theme: 'dark',
    });
}

export {
    setupAlwan
}