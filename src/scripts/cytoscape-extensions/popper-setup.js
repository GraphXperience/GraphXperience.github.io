import cytoscape from 'cytoscape';
import cytoscapePopper from 'cytoscape-popper';
import { createPopper } from '@popperjs/core';

function setupPopper() {
    cytoscape.use(cytoscapePopper(popperFactory));
}

function popperFactory(ref, content, opts) {
    return createPopper(ref, content, {
        placement: opts.placement || 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: opts.offset || [0, 8],
                },
            },
            {
                name: 'preventOverflow',
                options: {
                    boundary: opts.boundary || 'viewport',
                },
            },
            {
                name: 'flip',
                options: {
                    fallbackPlacements: opts.fallbackPlacements || ['right', 'left', 'top'],
                },
            },
        ],
    });
}

export {
    setupPopper
}
