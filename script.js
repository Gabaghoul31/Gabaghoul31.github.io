const TOKEN = '${{ secrets.TOKEN }}';  // Use the GitHub secret
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
    console.log("Attempting to load lists...");
    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        method: 'GET',
        headers: getGitHubHeaders()
    })
    .then(response => {
        console.log(`Load response:`, response);
        if (!response.ok) throw new Error('Failed to load data');
        return response.json();
    })
    .then(data => {
        console.log("Loaded data:", data);
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
    console.log("Attempting to save lists...");
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item => item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
        headers: getGitHubHeaders()
    })
    .then(response => {
        console.log(`Fetch file for SHA response:`, response);
        if (!response.ok) throw new Error('Failed to fetch current data file');
        return response.json();
    })
    .then(fileData => {
        const updateBody = {
            message: "Update data.json",
            content: btoa(JSON.stringify(data)),
            sha: fileData.sha
        };

        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: getGitHubHeaders(),
            body: JSON.stringify(updateBody)
        })
        .then(response => {
            console.log("Save response:", response);
            if (!response.ok) throw new Error('Failed to save data');
            return response.json();
        })
        .then(data => {
            console.log('Data saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching current data file:', error);
    });
}
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
