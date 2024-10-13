import Alwan from 'alwan';
import { getTagColor, rgbStrToHex } from '../utils';

function setupAlwan(cy) {
    new Alwan('#color-input', {
        opacity: false,
        theme: 'dark',
    });

    const styles = cy.style().json();
    cy.data('alwan-ce-node', new Alwan('#config-editor-node-color-input', {
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(styles.find(s => s.selector === 'node').style["background-color"])
    }));
    
    cy.data('alwan-ce-edge', new Alwan('#config-editor-edge-color-input', {
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(styles.find(s => s.selector === 'edge').style["line-color"])
    }));

    cy.data('alwan-ce-tag', new Alwan('#config-editor-tag-color-input', {
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(getTagColor())
    }));
}

export {
    setupAlwan
}