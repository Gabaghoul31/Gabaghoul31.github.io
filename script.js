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

function loadLists() {
    console.log("Attempting to load lists...");
    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/load-data')
    .then(response => {
        console.log(`Load response:`, response);
        if (!response.ok) throw new Error('Failed to load data');
        return response.json(); // This automatically parses the JSON
    })
    .then(data => {
        console.log("Loaded data:", data);
        // Ensure both groceryList and otherList exist and are arrays
        if (data.data && Array.isArray(data.data.groceryList) && Array.isArray(data.data.otherList)) {
            groceryList.innerHTML = '';
            otherList.innerHTML = '';

            data.data.groceryList.forEach(item => {
                groceryList.appendChild(createListItem(item, groceryList));
            });
            data.data.otherList.forEach(item => {
                otherList.appendChild(createListItem(item, otherList));
            });
        } else {
            console.error('Data is missing or not in the expected format:', data);
            throw new Error('Data is missing or not in the expected format');
        }
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

function saveLists() {
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item => item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/update-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data})
    })
    .then(response => response.json()) // Assuming the server might send a JSON response
    .then(result => console.log('Save result:', result))
    .catch(error => console.error('Error on save:', error));
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

