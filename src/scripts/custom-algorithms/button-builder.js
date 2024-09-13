function createCustomAlgorithmButton(customAlgorithm) {
    const listItem = document.createElement('li');

    const customAlgorithmButton = document.createElement('button');
    customAlgorithmButton.classList.add('side-bar-button');
    customAlgorithmButton.textContent = customAlgorithm.algorithmName;
    customAlgorithmButton.dataset.type = 'algorithm';
    customAlgorithmButton.dataset.name = customAlgorithm.algorithmName;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&#10006;';
    deleteButton.dataset.type = 'delete';
    deleteButton.dataset.name = customAlgorithm.algorithmName;

    listItem.appendChild(customAlgorithmButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

export {
    createCustomAlgorithmButton
}