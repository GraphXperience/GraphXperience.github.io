import { createCompleteGraph } from './complete-graph.js';
import { createRegularGraph } from './regular-graph.js';
import { createStarGraph } from './star-graph.js';
import { createWheelGraph } from './wheel-graph.js';
import { createBipartiteGraph } from './bipartite-graph.js';
import { createCompleteBipartiteGraph } from './complete-bipartite-graph.js';
import { createBinaryTreeGraph } from './binary-tree-graph.js';
import { createPetersenGraph } from './petersen-graph.js';
import { getCytoscape, getUndoRedo } from '../context.js';

var cy = getCytoscape();
var ur = getUndoRedo();

const graphCreationFunctions = {
    'complete': createCompleteGraph,
    'regular': createRegularGraph,
    'star': createStarGraph,
    'wheel': createWheelGraph,
    'bipartite': createBipartiteGraph,
    'complete-bipartite': createCompleteBipartiteGraph,
    'binary-tree': createBinaryTreeGraph,
    'petersen': createPetersenGraph,
};

function createPredefinedGraph(graphType, params) {
    let graphCreationFunction = graphCreationFunctions[graphType];
    graphCreationFunction(cy, ur, ...params);
}


export {
    createPredefinedGraph,
};
