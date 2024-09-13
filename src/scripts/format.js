import { getCytoscape } from "./context";

var cy = getCytoscape();

function buildBfsString(visitedNodeIds) {
    return Array.from(visitedNodeIds).map(visitedNodeId => cy.$id(visitedNodeId).data('tag')).join(', ');
}

function formatBfsString(visitedNodeIds) {
    return `Ordem da busca em largura: ${buildBfsString(visitedNodeIds)}`;
}

function buildDfsString(visitedNodeIds) {
    return Array.from(visitedNodeIds).map(visitedNodeId => cy.$id(visitedNodeId).data('tag')).join(', ');
}

function formatDfsString(visitedNodeIds) {
    return `Ordem da busca em profundidade: ${buildDfsString(visitedNodeIds)}`;
}

function buildCycleString(cycle) {
    return Array.from(cycle).map(nodeId => cy.$id(nodeId).data('tag')).join(', ');
}

function formatCycleString(cycle) {
    return `Primeiro ciclo encontrado: ${buildCycleString(cycle)}`;
}

function buildConnectedComponentsString(connectedComponents) {
    return connectedComponents.map(component => `(${component.map(nodeId => cy.$id(nodeId).data('tag')).join(', ')})`).join('; ');
}

function formatConnectedComponentsString(connectedComponents) {
    return `Componente conexa: ${buildConnectedComponentsString(connectedComponents)}`;
}

function formatStronglyConnectedComponentsString(stronglyConnectedComponents) {
    return `Componente fortemente conexa: ${buildConnectedComponentsString(stronglyConnectedComponents)}`;
}

function formatAlgorithmString(input, animationName) {
    let algorithmStr = '';

    switch (animationName) {
        case "bfs":
            algorithmStr = formatBfsString(input);
            break;
        case "dfs":
            algorithmStr = formatDfsString(input);
            break;
        case "cycle":
            algorithmStr = formatCycleString(input);
            break;
        case "connectedComponents":
            algorithmStr = formatConnectedComponentsString(input);
            break;
        case "stronglyConnectedComponents":
            algorithmStr = formatStronglyConnectedComponentsString(input);
            break;
        default:
            algorithmStr = 'Algoritmo executado.'
    }

    return algorithmStr;
}

export {
    formatAlgorithmString
}