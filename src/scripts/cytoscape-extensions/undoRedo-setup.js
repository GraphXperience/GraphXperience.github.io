import { ANIMATED_COLOR } from '../../constants/colors';
import { setTag } from '../extensions/element-extensions';
import { getRandomNumber } from '../utils';

function setupUndoRedo(cy) {
    var options = {
        isDebug: false,
        actions: {},
        undoableDrag: true,
        stackSizeLimit: undefined,
        ready: function () { }
    }

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

    if (weight != undefined) {
        element.data('weight', weight);
    }

    setTag(element, tag?.toString());

    let animation = {
        style: {},
        duration: 0,
    };

    if (element.isNode()) {
        animation.style['background-color'] = color ?? ANIMATED_COLOR;
        animation.style['width'] = size ?? current.size;
        animation.style['height'] = size ?? current.size;
    }
    else {
        animation.style['line-color'] = color ?? ANIMATED_COLOR;
        animation.style['target-arrow-color'] = color ?? ANIMATED_COLOR;
        animation.style['width'] = size ?? current.size;
    }

    element.animate(animation);

    return { element, ...current };
}

const console = document.getElementById('animation-console');
function print({ message, color = 'red' }) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    newMessage.style.color = color;

    console.appendChild(newMessage);

    return {
        element: newMessage
    };
}

function revertPrint({ element }) {
    const backup = {
        message: element.textContent, color: element.style.color
    };

    console.removeChild(element);

    return backup;
}

function handleEdgeHandlesCompletion(cy, ur) {
    cy.on('ehcomplete', (event, sourceNode, targetNode, addedEdge) => {
        cy.edges().slice(-2).remove();
        cy.nodes().slice(-1).remove();

        const isThereExistingEdge = cy.edges().some(edge =>
            edge.source().id() === sourceNode.id() &&
            edge.target().id() === targetNode.id()
        );

        if (isThereExistingEdge) {
            return;
        }

        const edgeObj = {
            group: 'edges',
            data: { id: getRandomNumber(), source: sourceNode.id(), target: targetNode.id(), weight: 1 },
        };

        ur.do('add', edgeObj);
    });
}

export {
    setupUndoRedo
}