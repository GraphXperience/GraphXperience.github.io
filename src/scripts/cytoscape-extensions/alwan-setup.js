import Alwan from 'alwan';
import { getTagColor, rgbStrToHex } from '../utils';

function setupAlwan(cy) {
    cy.data('alwan-ce', new Alwan('#color-input', {
        parent: '#color-input-container',
        opacity: false,
        theme: 'dark',
    }));

    const styles = cy.style().json();
    cy.data('alwan-ce-node', new Alwan('#gc-node-color-input', {
        parent: '#gc-node-color-input-container',
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(styles.find(s => s.selector === 'node').style["background-color"])
    }));

    cy.data('alwan-ce-edge', new Alwan('#gc-edge-color-input', {
        parent: '#gc-edge-color-input-container',
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(styles.find(s => s.selector === 'edge').style["line-color"])
    }));

    cy.data('alwan-ce-tag', new Alwan('#gc-tag-color-input', {
        parent: '#gc-tag-color-input-container',
        opacity: false,
        theme: 'dark',
        color: rgbStrToHex(getTagColor())
    }));
}

export {
    setupAlwan
}