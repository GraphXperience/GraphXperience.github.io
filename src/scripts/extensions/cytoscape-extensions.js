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

    const overrideNodeColor = {
        'background-color': 'data(overrideColor)',
    };

    const overrideNodeSize = {
        'height': 'data(overrideSize)',
        'width': 'data(overrideSize)',
    };

    const overrideEdgeColor = {
        'line-color': 'data(overrideColor)',
        'target-arrow-color': 'data(overrideColor)',
    };

    const overrideEdgeSize = {
        'width': 'data(overrideSize)',
    };

    const weight = {
        'label': 'data(weight)'
    }

    const selected = {
        'opacity': FULL_VISIBLE_OPACITY
    };

    const readonly = {
        'events': 'no'
    };

    if (globalConfig) {
        edgeStyle['target-arrow-shape'] = globalConfig.isDirected ? 'triangle' : 'none';
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
        .selector('node[weight]').style(weight)
        .selector('node[overrideColor]').style(overrideNodeColor)
        .selector('node[overrideSize]').style(overrideNodeSize)
        .selector('edge').style(edgeStyle)
        .selector('edge[weight]').style(weight)
        .selector('edge[overrideColor]').style(overrideEdgeColor)
        .selector('edge[overrideSize]').style(overrideEdgeSize)
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
            overrideColor: node.data('overrideColor'),
            overrideSize: node.data('overrideSize'),
            size: node.style('width')
        })),
        edges: cy.edges().map(edge => ({
            id: edge.id(),
            tag: edge.data('tag'),
            weight: edge.data('weight'),
            source: edge.source().id(),
            target: edge.target().id(),
            overrideColor: edge.data('overrideColor'),
            overrideSize: edge.data('overrideSize'),
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
                overrideColor: node.overrideColor,
                overrideSize: node.overrideSize
            },
            position: node.position
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
                overrideColor: edge.overrideColor,
                overrideSize: edge.overrideSize
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