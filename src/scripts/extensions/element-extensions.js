/**
 * Removes a tag from a node or edge.
 * @param {*} element Node or Edge element
 */
function removeTag(element) {
    let popper = element.data('popper');
    if (popper) {
        removePopper(element, popper);
        element.removeData('popper');
        element.removeData('tag');
    }
}

/**
 * Set the element color
 * @param {*} element Node or Edge element
 * @param {string} color Color in Hex (ex: #FFFFFF)
 */
function setColor(element, color) {
    if (element.isNode()) {
        element.style('background-color', color);
    }
    if (element.isEdge()) {
        element.style('line-color', color);
        element.style('target-arrow-color', color);
    }
}

/**
 * Set the element size
 * @param {*} element Node or Edge element
 * @param {number} size Size of the node or edge
 */
function setSize(element, size) {
    if (element.isNode()) {
        element.style('width', size * 10);
        element.style('height', size * 10);
    } else {
        element.style('width', size);
    }
}

/**
 * @param {*} element Node or Edge element
 * @param {string} tag Tag to add to the node. If empty and exists, removes a tag.
 */
function setTag(element, tag) {
    let popper = element.data('popper');

    if (tag == null || tag.trim() === '') {
        if (popper) {
            removePopper(element, popper);
            element.removeData('popper');
            element.removeData('tag');
        }
        return;
    }

    element.data('tag', tag);

    if (popper) {
        popper.state.elements.popper.innerHTML = tag;
        return;
    }

    element.data('popper', createPopper(element, tag));
}

function removePopper(element, popperInstance) {
    document.getElementById(`popper-${element.id()}`).remove();
    unbindPopper(element, popperInstance);
    popperInstance.destroy();
}

function unbindPopper(element, popper) {
    if (element.isNode()) {
        element.off('position', popper.update);
    } else {
        element.source().off('position', popper.update);
        element.target().off('position', popper.update);
    }
}

function createPopper(element, tag) {
    const popper = element.popper({
        content: () => {
            const div = document.createElement('div');
            div.id = `popper-${element.id()}`;
            div.innerHTML = tag;
            div.className = 'tooltip-content';
            document.body.appendChild(div);
            return div;
        }
    });
    bindPopper(element, popper);
    return popper;
}

function bindPopper(element, popper) {
    if (element.isNode()) {
        element.on('position', popper.update);
    } else {
        element.source().on('position', popper.update);
        element.target().on('position', popper.update);
    }
}

/**
 * Set the element weight
 * @param {*} element Node or Edge element
 * @param {number} weight Weight of the node or edge
 */
function setWeight(element, weight) {
    element.data('weight', weight);
}

export {
    removeTag,
    setColor,
    setSize,
    setTag,
    setWeight
}