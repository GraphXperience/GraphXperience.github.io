import { getCytoscape } from "../context";
import { startAnimation } from '../animation';
import { Graph } from "../models/Graph";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { checkCycles } from "./checkCycles";
import { getConnectedComponents } from './getConnectedComponents';
import { getStronglyConnectedComponents } from "./getStronglyConnectedComponents";
import { getShortestPath } from "./getShortestPath";
import { openPopup } from "../popup";

const cy = getCytoscape();

const algorithms = {
    'bfs': bfs,
    'dfs': dfs,
    'checkCycles': checkCycles,
    'getConnectedComponents': getConnectedComponents,
    'getStronglyConnectedComponents': getStronglyConnectedComponents,
    'getShortestPath': getShortestPath
};

async function run(algorithm) {
    const graph = new Graph(cy);
    const selectedNodes = Array.from(cy.data('selectedNodeIds')).map(selectedNodeId => graph.nodes.find(node => node.id == selectedNodeId));

    try {
        const actions = algorithms[algorithm](graph, selectedNodes);

        if (actions.length > 0) {
            await startAnimation(actions);
        }
    }
    catch (error) {
        openPopup(error);
    }
}

export {
    run
}