export class Edge {
    constructor(id, sourceNode, targetNode, weight = 1) {
        this.id = id;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.weight = weight;
    }
}
