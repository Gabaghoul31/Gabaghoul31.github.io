import { createListItem, fetchAPI } from './utils.js';

const groceryList = document.getElementById('groceryItems');
const otherList = document.getElementById('otherItems');
const addGroceryBtn = document.getElementById('addGrocery');
const addOtherBtn = document.getElementById('addOther');
const newGroceryInput = document.getElementById('newItemGrocery');
const newOtherInput = document.getElementById('newItemOther');

export function loadLists() {
    console.log("Attempting to load lists...");
    fetchAPI('https://morning-woodland-96579-141743ef28e3.herokuapp.com/load-data', 'GET')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json(); // Automatically parses JSON
    })
    .then(data => {
        console.log("Loaded data:", data);
        groceryList.innerHTML = '';
        otherList.innerHTML = '';

        data.groceryList.forEach(item => {
            groceryList.appendChild(createListItem(item, groceryList, saveLists));
        });
        data.otherList.forEach(item => {
            otherList.appendChild(createListItem(item, otherList, saveLists));
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });
}

export function saveLists() {
    const groceryItems = Array.from(groceryList.children).map(item => item.firstChild.textContent);
    const otherItems = Array.from(otherList.children).map(item => item.firstChild.textContent);
    const data = { groceryList: groceryItems, otherList: otherItems };

    fetchAPI('https://morning-woodland-96579-141743ef28e3.herokuapp.com/update-data', 'POST', data)
    .then(response => response.json())
    .then(result => console.log('Save result:', result))
    .catch(error => console.error('Error on save:', error));
}

addGroceryBtn.addEventListener('click', () => {
    const newItem = newGroceryInput.value;
    if (newItem) {
        groceryList.appendChild(createListItem(newItem, groceryList, saveLists));
        newGroceryInput.value = '';
        saveLists();
    }
});

addOtherBtn.addEventListener('click', () => {
    const newItem = newOtherInput.value;
    if (newItem) {
        otherList.appendChild(createListItem(newItem, otherList, saveLists));
        newOtherInput.value = '';
        saveLists();
    }
});
