import { getColorEditor } from '../editors/color-editor';
import { getSizeEditor } from '../editors/size-editor';
import { getTagEditor } from '../editors/tag-editor';
import { getWeightEditor } from '../editors/weight-editor';

function setupCxtMenu(cy) {
    const colorEditor = getColorEditor(cy);
    const sizeEditor = getSizeEditor(cy);
    const tagEditor = getTagEditor(cy);
    const weightEditor = getWeightEditor(cy);

    let defaults = {
        menuRadius: 100,
        selector: 'node, edge',
        commands: [
            {
                fillColor: 'rgba(200, 200, 200, 0.75)',
                content: 'Cor',
                contentStyle: {},
                select: () => colorEditor.open(cy.elements(":selected")),
                enabled: true
            },
            {
                fillColor: 'rgba(200, 200, 200, 0.75)',
                content: 'Tag',
                contentStyle: {},
                select: () => tagEditor.open(cy.elements(":selected")),
                enabled: true
            },
            {
                fillColor: 'rgba(200, 200, 200, 0.75)',
                content: 'Dimensão',
                contentStyle: {},
                select: () => sizeEditor.open(cy.elements(":selected")),
                enabled: true
            },
            {
                fillColor: 'rgba(200, 200, 200, 0.75)',
                content: 'Peso',
                contentStyle: {},
                select: () => weightEditor.open(cy.elements(":selected")),
                enabled: true
            },
        ],
        fillColor: 'rgba(0, 0, 0, 0.75)',
        activeFillColor: '#04364A',
        activePadding: 20,
        indicatorSize: 24,
        separatorWidth: 3,
        spotlightPadding: 4,
        adaptativeNodeSpotlightRadius: false,
        minSpotlightRadius: 24,
        maxSpotlightRadius: 38,
        openMenuEvents: 'cxttap taphold',
        itemColor: '#FFFFFF',
        itemTextShadowColor: 'transparent',
        zIndex: 9999,
        atMouse: false,
        outsideMenuCancel: false
    };

    cy.cxtmenu(defaults);
}

export {
    setupCxtMenu
}
