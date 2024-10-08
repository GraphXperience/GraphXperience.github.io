import { Node } from "./Node";
import { Edge } from './Edge';

export class Graph {
    constructor(cy) {
        const nodes = [];
        const edges = [];
        this.isDirected = cy.data('isDirected');

        cy.nodes().forEach(cyNode => {
            const node = new Node({ id: cyNode.id(), weight: cyNode.data('weight'), tag: cyNode.data('tag'), isDirected: this.isDirected });
            nodes.push(node);
        });

        cy.edges().forEach(cyEdge => {
            const sourceNode = nodes.find(node => node.id === cyEdge.source().id());
            const targetNode = nodes.find(node => node.id === cyEdge.target().id());

            const edge = new Edge({ id: cyEdge.id(), sourceNode: sourceNode, targetNode: targetNode, weight: cyEdge.data('weight'), tag: cyEdge.data('tag') });

            sourceNode.addOutgoingEdge(edge);
            targetNode.addIncomingEdge(edge);

            edges.push(edge);
        });

        this.nodes = nodes;
        this.edges = edges;
    }
}
