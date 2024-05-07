const TOKEN = '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'; // Replace with your actual GitHub personal access token
const REPO_OWNER = 'Gabaghoul31';
const REPO_NAME = 'Gabaghoul31.github.io';
const FILE_PATH = 'data.json';

const groceryList = document.getElementById('groceryItems');
const otherList = document.getElementById('otherItems');
const addGroceryBtn = document.getElementById('addGrocery');
const addOtherBtn = document.getElementById('addOther');
const newGroceryInput = document.getElementById('newItemGrocery');
const newOtherInput = document.getElementById('newItemOther');

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
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${TOKEN}`,
            'Accept': 'application/vnd.github.everest-preview+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_type: 'update-data',
            client_payload: { data: JSON.stringify(data) }
        })
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

addGroceryBtn.addEventListener('click', () => {
    const newItem = newGroceryInput.value;
    if (newItem) {
        groceryList.appendChild(createListItem(newItem, groceryList));
        newGroceryInput value = '';
        saveLists();
    }
});

addOtherBtn addEventListener('click', () => {
    const newItem = newOtherInput.value;
    if (newItem) {
        otherList.appendChild(createListItem(newItem, otherList));
        newOtherInput value = '';
        saveLists();
    }
});

loadLists();
