import {v4 as uuidv4} from 'uuid';

function rgbToHex(r, g, b) {
    const toHex = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);

    return '#' + hexR + hexG + hexB;
}

function rgbStrToHex(rgbStr) {
    const match = rgbStr.match(/\d+/g);

    if (!match || match.length !== 3) {
        return;
    }

    const r = parseInt(match[0], 10);
    const g = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);

    const hexStr = rgbToHex(r, g, b);

    return hexStr;
}

/**
 * Sleep for a specified amount of time
 * @param {number} ms milliseconds to wait
 * @returns Promise that will finish in ms milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function validateMinMax(evt, min, max) {
    const value = parseInt(evt.target.value);

    if (value < min || value > max) {
        evt.target.style.color = 'var(--error)';
        return;
    }

    evt.target.style.color = null;
}

function getRandomInt(min = 1e6, max = 1e7) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomUuid() {
    return uuidv4();
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    return rgbStrToHex(rgbStr);
}

function getTagColor() {
    for (let stylesheet of document.styleSheets) {
        for (let cssRule of stylesheet.cssRules) {
            if (cssRule.selectorText === '.tooltip-content') {
                return cssRule.style["background-color"];
            }
        }
    }
}

function setTagColor(hex) {
    if (!hex) {
        throw new Error("Invalid color");
    }

    for (let stylesheet of document.styleSheets) {
        for (let cssRule of stylesheet.cssRules) {
            if (cssRule.selectorText === '.tooltip-content') {
                cssRule.style["background-color"] = hex;
                cssRule.style["color"] = invertColor(hex);
                return;
            }
        }
    }
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
}

export {
    rgbToHex,
    rgbStrToHex,
    sleep,
    validateMinMax,
    getRandomInt,
    getRandomUuid,
    getRandomColor,
    getTagColor,
    setTagColor
};