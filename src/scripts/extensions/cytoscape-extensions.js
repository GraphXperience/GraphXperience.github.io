import cytoscape from "cytoscape";
import { RESET_COLOR } from "../../constants/colors";
import { FULL_VISIBLE_OPACITY, PARTIAL_VISIBLE_OPACITY } from "../../constants/opacity";
import { rgbStrToHex } from "../utils";

function buildStylesheet(globalConfig, globalStyle) {
    const nodeStyle = {
        'text-valign': 'center',
        'text-halign': 'center',
        'overlay-opacity': 0,
        'opacity': PARTIAL_VISIBLE_OPACITY,
        'background-color': RESET_COLOR,
        'height': 40,
        'width': 40,
    };

    const edgeStyle = {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'width': 4,
        'overlay-opacity': 0,
        'opacity': PARTIAL_VISIBLE_OPACITY,
        'line-color': RESET_COLOR,
        'target-arrow-color': RESET_COLOR,
    };

    const selected = {
        'opacity': FULL_VISIBLE_OPACITY
    };

    const readonly = {
        'events': 'no'
    };

    if (globalConfig) {
        edgeStyle['target-arrow-shape'] = globalConfig.isDirected ? 'triangle' : 'none';
        nodeStyle['label'] = globalConfig.isNodeWeighted ? 'data(weight)' : '';
        edgeStyle['label'] = globalConfig.isEdgeWeighted ? 'data(weight)' : '';
    }

    if (globalStyle) {
        let elementStyle = globalStyle.find(s => s.selector === 'node');
        if (elementStyle) {
            nodeStyle['background-color'] = elementStyle.style['background-color'];
            nodeStyle['height'] = elementStyle.style['height'];
            nodeStyle['width'] = elementStyle.style['width'];
        }

        elementStyle = globalStyle.find(s => s.selector === 'edge');
        if (elementStyle) {
            edgeStyle['width'] = elementStyle.style['width'];
        }
    }

    return cytoscape.stylesheet()
        .selector('node').style(nodeStyle)
        .selector('edge').style(edgeStyle)
        .selector(':selected').style(selected)
        .selector('[?readonly]').style(readonly)
        .selector('core').style({ 'active-bg-size': 0 });
}

function createGraphJson(cy) {
    const jsonData = {
        nodes: cy.nodes().map(node => ({
            id: node.id(),
            tag: node.data('tag'),
            weight: node.data('weight'),
            position: node.position(),
            elementColor: node.style('background-color'),
            size: node.style('width')
        })),
        edges: cy.edges().map(edge => ({
            id: edge.id(),
            tag: edge.data('tag'),
            weight: edge.data('weight'),
            source: edge.source().id(),
            target: edge.target().id(),
            elementColor: edge.style('line-color'),
            size: edge.style('width')
        }))
    };

    return jsonData;
}

function getBatchFromJson(json) {
    const data = JSON.parse(json);

    const batch = [];
    data.nodes.forEach(node => batch.push({
        name: 'add',
        param: {
            group: 'nodes',
            data: {
                id: node.id,
                tag: node.tag,
                weight: node.weight,
            },
            position: node.position,
            style: {
                'background-color': rgbStrToHex(node.elementColor),
                'height': node.size,
                'width': node.size
            }
        }
    }));
    data.edges.forEach(edge => batch.push({
        name: 'add',
        param: {
            group: 'edges',
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                tag: edge.tag,
                weight: edge.weight,
            },
            style: {
                'line-color': edge.elementColor,
                'target-arrow-color': edge.elementColor,
                'width': edge.size
            }
        }
    }));

    return batch;
}

export {
    buildStylesheet,
    createGraphJson,
    getBatchFromJson
}