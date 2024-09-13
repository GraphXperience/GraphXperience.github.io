function getGlobalStyle() {
    const value = localStorage.getItem('global-style');
    if (value !== null) {
        return JSON.parse(value);
    }

    return null;
}

function setGlobalStyle(styles) {
    localStorage.setItem('global-style', JSON.stringify(styles));
}

function getGlobalConfig() {
    const value = localStorage.getItem('global-config');
    if (value !== null) {
        return JSON.parse(value);
    }

    return null;
}

function setGlobalConfig(config) {
    localStorage.setItem('global-config', JSON.stringify(config));
}

export {
    getGlobalConfig,
    getGlobalStyle,
    setGlobalConfig,
    setGlobalStyle
}