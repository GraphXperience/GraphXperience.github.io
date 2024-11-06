function createCustomAlgorithmButton(customAlgorithm) {
    const listItem = document.createElement('li');
    listItem.dataset.id = `li-algorithm-${customAlgorithm.id}`;

    const customAlgorithmButton = document.createElement('button');
    customAlgorithmButton.classList.add('side-bar-button');
    customAlgorithmButton.textContent = customAlgorithm.name;
    customAlgorithmButton.dataset.type = 'algorithm';
    customAlgorithmButton.dataset.name = customAlgorithm.name;
    customAlgorithmButton.dataset.description = customAlgorithm.description;

    const infoButton = document.createElement('span');
    infoButton.classList.add("material-symbols-outlined");
    infoButton.classList.add("icon-button");
    infoButton.textContent = "info";
    infoButton.dataset.type = 'info';
    infoButton.dataset.name = customAlgorithm.name;
    infoButton.dataset.description = customAlgorithm.description;

    const editButton = document.createElement('span');
    editButton.classList.add("material-symbols-outlined");
    editButton.classList.add("icon-button");
    editButton.textContent = "edit";
    editButton.dataset.type = 'edit';
    editButton.dataset.name = customAlgorithm.name;
    editButton.dataset.description = customAlgorithm.description;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add("material-symbols-outlined");
    deleteButton.classList.add("icon-button");
    deleteButton.innerHTML = 'delete';
    deleteButton.dataset.type = 'delete';
    deleteButton.dataset.name = customAlgorithm.name;
    deleteButton.dataset.description = customAlgorithm.description;

    listItem.appendChild(customAlgorithmButton);
    listItem.appendChild(infoButton);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

export {
    createCustomAlgorithmButton
}