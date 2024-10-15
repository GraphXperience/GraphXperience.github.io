function createCustomAlgorithmButton(customAlgorithm) {
    const listItem = document.createElement('li');
    listItem.dataset.id = `li-algorithm-${customAlgorithm.id}`;

    const customAlgorithmButton = document.createElement('button');
    customAlgorithmButton.classList.add('side-bar-button');
    customAlgorithmButton.textContent = customAlgorithm.name;
    customAlgorithmButton.dataset.type = 'algorithm';
    customAlgorithmButton.dataset.name = customAlgorithm.name;
    customAlgorithmButton.dataset.description = customAlgorithm.description;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '&#10006;';
    deleteButton.dataset.type = 'delete';
    deleteButton.dataset.name = customAlgorithm.name;
    deleteButton.dataset.description = customAlgorithm.description;

    const infoButton = document.createElement('img');
    infoButton.src = './assets/info.svg';
    infoButton.classList.add('info-icon');
    infoButton.dataset.type = 'info';
    infoButton.dataset.name = customAlgorithm.name;
    infoButton.dataset.description = customAlgorithm.description;

    const editButton = document.createElement('img');
    editButton.src = './assets/edit.svg';
    editButton.classList.add('edit-icon');
    editButton.dataset.type = 'edit';
    editButton.dataset.name = customAlgorithm.name;
    editButton.dataset.description = customAlgorithm.description;

    listItem.appendChild(customAlgorithmButton);
    listItem.appendChild(deleteButton);
    listItem.appendChild(infoButton);
    listItem.appendChild(editButton);

    return listItem;
}

export {
    createCustomAlgorithmButton
}