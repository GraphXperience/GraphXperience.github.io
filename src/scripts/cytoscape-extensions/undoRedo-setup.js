import { ANIMATED_COLOR } from '../../constants/colors';
import { setColor, setSize, setTag } from '../extensions/element-extensions';
import { getRandomUuid } from '../utils';

function setupUndoRedo(cy) {
    const options = {
        isDebug: false,
        actions: {},
        undoableDrag: true,
        stackSizeLimit: undefined
    };

    const ur = cy.undoRedo(options);

    ur.action('animate', animate, animate);
    ur.action('print', print, revertPrint);

    handleEdgeHandlesCompletion(cy, ur);

    return ur;
}

function animate({ element, color, size, tag, weight }) {
    const current = {
        color: element.isNode() ? element.style('background-color') : element.style('line-color'),
        size: element.style('width'),
        tag: element.data('tag'),
        weight: element.data('weight'),
    };

    if (weight !== undefined) {
        element.data('weight', weight);
    }

    if (tag !== undefined) {
        current.tag = current.tag ?? '';
        setTag(element, tag.toString());
    }

    let animation = {
        style: {},
        duration: 0,
    };

    setColor(element, color ?? ANIMATED_COLOR);
    setSize(element, size ?? current.size);

    element.animate(animation);

    return { element, ...current };
}

const printConsole = document.getElementById('ac-content');

function print({ message, color }) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    if (color) {
        newMessage.style.color = color;
    }

    printConsole.appendChild(newMessage);

    return {
        element: newMessage
    };
}

function revertPrint({ element }) {
    const backup = {
        message: element.textContent, color: element.style.color
    };

    printConsole.removeChild(element);

    return backup;
}

function handleEdgeHandlesCompletion(cy, ur) {
    cy.on('ehcomplete', (event, sourceNode, targetNode) => {
        cy.edges().slice(-2).remove();
        cy.nodes().slice(-1).remove();

        const isThereExistingEdge = cy.edges().some(edge =>
            edge.source().id() === sourceNode.id() &&
            edge.target().id() === targetNode.id()
        );

        if (isThereExistingEdge) {
            return;
        }

        if (!cy.data('isDirected') && !cy.edges('[source="' + targetNode.id() + '"][target="' + sourceNode.id() + '"]').empty()) {
            return;
        }

        const edgeObj = {
            group: 'edges',
            data: { id: getRandomUuid(), source: sourceNode.id(), target: targetNode.id(), weight: 1 },
        };

        ur.do('add', edgeObj);
    });
}

export {
    setupUndoRedo
}
