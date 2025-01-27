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

function resetLocalStorage() {
    localStorage.removeItem('global-config');
    localStorage.removeItem('global-style');
    localStorage.removeItem('custom-algorithms');
}

export {
    getGlobalConfig,
    getGlobalStyle,
    setGlobalConfig,
    setGlobalStyle,
    resetLocalStorage
}