const TOKEN = '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'; // Replace with your actual GitHub personal access token
const REPO_OWNER = 'Gabaghoul31';
const REPO_NAME = 'Gabaghoul31.github.io';
const FILE_PATH = 'data.json';

const groceryList = document.getElementById('groceryItems');
const otherList = document.getElementById('otherItems');
const addGroceryBtn = document.getElementById('addGrocery');
const addOtherBtn = document.getElementById('addOther');
const newGroceryInput = document.getElementById('newItemGrocery');
const newOtherInput = document.getElementId('newItemOther');

function createListItem(text, list) {
    const listItem = document.createElement('li');
    const textNode = document.createTextNode(text);
    listItem.appendChild(textNode);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        list.removeChild(listItem);
        saveLists();
    });

    listItem.appendChild(removeBtn);
    return listItem;
}

function getGitHubHeaders() {
    return {
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
}

function loadLists() {
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'GET',
        headers: getGitHubHeaders()
    })
    .then(response => {
        if (response.status === 404) {
            return { groceryList: [], otherList: [] };  // Initialize empty lists if file is missing
        }
        if (!response.ok) {
            throw new Error('Could not load data from GitHub');
        }
        return response.json();
    })
    .then(data => {
        const content = atob(data.content || '');
        const parsedData = JSON.parse(content);
        groceryList.innerHTML = '';
        otherList.innerHTML = '';

        parsedData.groceryList.forEach(item => groceryList.appendChild(createListItem(item, groceryList)));
        parsedData.otherList.forEach(item => otherList.appendChild(createListItem(item, otherList)));
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

function saveLists() {
    const groceryItems = Array.from(groceryList.children).map(item => item.childNodes[0].textContent);
    const otherItems = Array.from(otherList.children).map(item => item.childNodes[0].textContent);

    const data = { groceryList: groceryItems, otherList: otherItems };
    const content = btoa(JSON.stringify(data));

    // Get the file data to determine the SHA
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'GET',
        headers: getGitHubHeaders()
    })
    .then(response => {
        if (response.status === 404) {
            return null;  // File doesn't exist yet
        }
        if (!response.ok) {
            throw new Error('Could not load existing file from GitHub');
        }
        return response.json();
    })
    .then(fileData => {
        const sha = fileData ? fileData.sha : null;
        return fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: getGitHubHeaders(),
            body: JSON.stringify({
                message: 'Update data file',
                content: content,
                sha: sha
            })
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not save data to GitHub');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data saved successfully:', data);
    })
    .catch(error => {
        console.error('Error saving data:', error);
    });
}

// Event Listeners
addGroceryBtn.addEventListener('click', () => {
    const newItem = newGroceryInput.value;
    if (newItem) {
        groceryList.appendChild(createListItem(newItem, groceryList));
        newGroceryInput.value = '';
        saveLists();
    }
});

addOtherBtn.addEventListener('click', () => {
    const newItem = newOtherInput.value;
    if (newItem) {
        otherList.appendChild(createListItem(newItem, otherList));
        newOtherInput.value = '';
        saveLists();
    }
});

loadLists();
