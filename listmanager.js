// Function to create a list item
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

// Function to load lists from the server
function loadLists(groceryList, otherList) {
    console.log("Attempting to load lists...");
    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/update-data')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json(); // Automatically parses JSON
    })
    .then(data => {
        console.log("Loaded data:", data);
        groceryList.innerHTML = '';
        otherList.innerHTML = '';

        data.groceryList.forEach(item => {
            groceryList.appendChild(createListItem(item, groceryList));
        });
        data.otherList.forEach(item => {
            otherList.appendChild(createListItem(item, otherList));
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

// Function to save lists to the server
function saveLists(groceryList, otherList) {
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item => item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetch('https://morning-woodland-96579-141743ef28e3.herokuapp.com/update-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Directly pass data
    })
    .then(response => response.json())
    .then(result => console.log('Save result:', result))
    .catch(error => console.error('Error on save:', error));
}

export { createListItem, loadLists, saveLists };
