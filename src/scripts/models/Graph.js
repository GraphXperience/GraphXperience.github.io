import { Node } from "./Node";
import { Edge } from './Edge';

export class Graph {
    constructor(cy) {
        const nodes = [];
        const edges = [];

        cy.nodes().forEach(cyNode => {
            const node = new Node(cyNode.id(), cyNode.data('weight'));
            nodes.push(node);
        });

        cy.edges().forEach(cyEdge => {
            const sourceNode = nodes.find(node => node.id === cyEdge.source().id());
            const targetNode = nodes.find(node => node.id === cyEdge.target().id());

            const edge = new Edge(cyEdge.id(), sourceNode, targetNode, cyEdge.data('weight'));

            sourceNode.addOutgoingEdge(edge);
            targetNode.addIncomingEdge(edge);

            edges.push(edge);
        });

        this.nodes = nodes;
        this.edges = edges;
        this.isDirected = cy.data('isDirected');
    }
}
