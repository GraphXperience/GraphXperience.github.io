import { getCytoscape } from "./context";

const cy = getCytoscape();

function getCentralAndOuterPositions(nodes, radius = 300) {
    const positions = {};
    const centralNodeId = nodes[0].data.id;

    const viewportWidth = cy.width();
    const viewportHeight = cy.height();

    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    positions[centralNodeId] = { x: centerX, y: centerY };

    const angleStep = (2 * Math.PI) / (nodes.length - 1);

    for (let i = 1; i < nodes.length; i++) {
        const outerNodeId = nodes[i].data.id;

        const angle = i * angleStep;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        positions[outerNodeId] = { x, y };
    }

    return positions;
}

function centerGraphHorizontallyAndAlignRoot(cy) {
    const boundingBox = cy.elements().boundingBox();
    const viewportWidth = cy.width();

    const xOffset = viewportWidth / 2 - (boundingBox.x1 + boundingBox.x2) / 2;
    const yOffset = -boundingBox.y1;

    cy.nodes().forEach(node => {
        const position = node.position();

        node.position({
            x: position.x + xOffset,
            y: position.y + yOffset
        });
    });
}

function positionPetersenGraph(innerNodes, outerNodes, innerRadius = 100, outerRadius = 200) {
    const positions = {};

    const viewportWidth = cy.width();
    const viewportHeight = cy.height();

    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    const angleStep = (2 * Math.PI) / 5;

    for (let i = 0; i < 5; i++) {
        const innerNodeId = innerNodes[i].data.id;
        const outerNodeId = outerNodes[i].data.id;

        const angle = i * angleStep + 3 * Math.PI / 2;

        const innerX = centerX + innerRadius * Math.cos(angle);
        const innerY = centerY + innerRadius * Math.sin(angle);

        const outerX = centerX + outerRadius * Math.cos(angle);
        const outerY = centerY + outerRadius * Math.sin(angle);

        positions[innerNodeId] = { x: innerX, y: innerY };
        positions[outerNodeId] = { x: outerX, y: outerY };
    }

    return positions;
}

export {
    getCentralAndOuterPositions,
    centerGraphHorizontallyAndAlignRoot,
    positionPetersenGraph,
};