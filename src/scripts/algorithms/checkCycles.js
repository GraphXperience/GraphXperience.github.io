function checkCycles(graph) {
    if (graph.nodes.length === 0) {
        throw new Error('O grafo está vazio.');
    }

    let visited = new Set();
    let visitedDirected = new Set();
    let actions = [];
    let stopAt = null;
    let cycle = new Set();
    let idToTag = new Map();

    for (const node of graph.nodes) {
        idToTag.set(node.id, node.tag);
    }

    if (graph.isDirected && graph.nodes.some(() => detectCyclesDirected(graph))) {
        actions.push({ type: 'print', message: `O primeiro ciclo encontrado é: ${Array.from(cycle).reverse().map(nodeId => idToTag.get(nodeId)).join(', ')}` });
        return actions;
    } else if (graph.nodes.some(() => detectCyclesUndirected(graph))) {
        actions.push({ type: 'print', message: `O primeiro ciclo encontrado é: ${Array.from(cycle).reverse().map(nodeId => idToTag.get(nodeId)).join(', ')}` });
        return actions;
    }

    actions.push({ type: 'print', message: 'Não há ciclo encontrado' });
    return actions;


    function detectCyclesUndirected(graph) {
        for (let node of graph.nodes) {
            if (!visited.has(node.id)) {
                if (dfs(graph, node, null)) {
                    return true;
                }
            }
        }
    }

    function dfs(graph, node, parent = null) {
        visited.add(node.id);
        actions.push({ elementId: node.id, type: 'animate' });
        actions.push({ type: 'print', message: `visitou o no ${node.tag}` });

        for (let neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.id)) {
                if (dfs(graph, neighbor, node)) {
                    if (stopAt) {
                        cycle.add(neighbor.id, node.id);
                        actions.push({ elementId: graph.getEdge(node, neighbor).id, type: 'animate', color: 'green' });
                        actions.push({ elementId: node.id, type: 'animate', color: 'green' });
                        if (stopAt === node.id) stopAt = null;
                    }
                    return true;
                }
            }
            else if (neighbor != parent) {
                cycle.add(neighbor.id, node.id);
                actions.push({ type: 'print', message: 'Achou ciclo no nó ' + neighbor.tag });
                actions.push({ elementId: graph.getEdge(node, neighbor).id, type: 'animate', color: 'green' });
                actions.push({ elementId: node.id, type: 'animate', color: 'green' });
                stopAt = neighbor.id;
                return true;
            }
        }

        actions.push({ elementId: node.id, type: 'animate', color: 'yellow' });
        return false;
    }

    function detectCyclesDirected(graph) {
        for (const node of graph.nodes) {
            if (!visited.has(node.id)) {
                if (dfs_directed(graph, node)) {
                    return true;
                }
            }
        }
        return false;
    }

    function dfs_directed(graph, node) {
        visited.add(node.id);
        visitedDirected.add(node.id);
        actions.push({ elementId: node.id, type: 'animate' });
        actions.push({ type: 'print', message: `visitou o no ${node.tag}` });

        for (const neighbor of graph.getNeighbors(node)) {
            if (!visited.has(neighbor.id)) {
                if (dfs_directed(graph, neighbor)) {
                    if (stopAt) {
                        cycle.add(neighbor.id, node.id);
                        actions.push({ elementId: graph.getEdge(node, neighbor).id, type: 'animate', color: 'green' });
                        actions.push({ elementId: node.id, type: 'animate', color: 'green' });
                        if (stopAt === node.id) stopAt = null;
                    }
                    return true;
                }
            }
            else if (visitedDirected.has(neighbor.id)) {
                cycle.add(neighbor.id, node.id);
                actions.push({ type: 'print', message: 'Achou ciclo no nó ' + neighbor.tag });
                actions.push({ elementId: graph.getEdge(node, neighbor).id, type: 'animate', color: 'green' });
                actions.push({ elementId: node.id, type: 'animate', color: 'green' });
                stopAt = neighbor.id;
                return true;
            }
        }

        visitedDirected.delete(node.id);
        actions.push({ elementId: node.id, type: 'animate', color: 'yellow' });
        return false;
    }
}

export {
    checkCycles
}
