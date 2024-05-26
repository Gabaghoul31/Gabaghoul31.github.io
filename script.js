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

function saveLists() {
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

// Calendar Functionality
const calendar = document.getElementById('calendar');
const currentMonthDisplay = document.createElement('div');
const calendarGrid = document.createElement('table');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    currentMonthDisplay.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth));

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    let date = 1;
    let calendarHTML = '<tr>';

    for (let i = 0; i < 6; i++) { // Max 6 weeks in a month
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendarHTML += '<td></td>';
            } else if (date > daysInMonth) {
                break;
            } else {
                calendarHTML += `<td class="${date === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? 'today' : ''}">${date}</td>`;
                date++;
            }
        }
        calendarHTML += '</tr>';   
    }

    calendarGrid.innerHTML = calendarHTML;
    // calendar code
    const monthDisplay = document.createElement('div');
    monthDisplay.classList.add('month-display');
    monthDisplay.appendChild(prevMonthBtn);
    monthDisplay.appendChild(currentMonthDisplay);
    monthDisplay.appendChild(nextMonthBtn);

    const weekdays = document.createElement('div');
    weekdays.classList.add('weekdays');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        weekdays.appendChild(dayDiv);
    });

    calendar.innerHTML = ''; // Clear previous content
    calendar.appendChild(monthDisplay);
    calendar.appendChild(weekdays);
    calendar.appendChild(calendarGrid);

    const currentDay = new Date().getDate();
    const currentDayElement = calendarGrid.querySelector(`td:nth-child(${currentDay + firstDay})`);
    if (currentDayElement) {
        highlightDay(currentDayElement);
        updateComingSoon(currentDay);
    }
}

// Event Listeners for Calendar Days
calendar.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'TD' && !target.classList.contains('not-month')) {
        highlightDay(target);
        updateComingSoon(target.textContent);
    }
});

// Highlighting the clicked day
function highlightDay(dayElement) {
    const allDays = calendarGrid.querySelectorAll('td');
    allDays.forEach(day => day.classList.remove('selected')); // Remove previous highlight
    dayElement.classList.add('selected'); // Add highlight
}

// Placeholder appointment data
const appointments = {
    1: ["Doctor's appointment at 10:00 AM", "Lunch with friends at 12:30 PM"],
    7: ["Grocery shopping at 2:00 PM"],
    15: ["Dinner with family at 6:00 PM"],
    // ... Add more appointments for other dates
};

// Updating "Coming Soon!" section
function updateComingSoon(dayNumber) {
    const dayOfWeek = new Date(currentYear, currentMonth, dayNumber).toLocaleDateString('en-US', { weekday: 'long' });
    const appointmentList = document.createElement('ul');

    // Display appointments (if any)
    if (appointments[dayNumber]) {
        appointments[dayNumber].forEach(appt => {
            const listItem = document.createElement('li');
            listItem.textContent = appt;
            appointmentList.appendChild(listItem);
        });
    }

    const comingSoonSection = document.querySelector('.coming-soon');
    comingSoonSection.innerHTML = `<h2>${dayOfWeek}</h2>`;
    comingSoonSection.appendChild(appointmentList);
}

function changeMonth(increment) {
    currentMonth += increment;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

const prevMonthBtn = document.createElement('button');
prevMonthBtn.textContent = '<';
prevMonthBtn.addEventListener('click', () => changeMonth(-1));

const nextMonthBtn = document.createElement('button');
nextMonthBtn.textContent = '>';
nextMonthBtn.addEventListener('click', () => changeMonth(1));

calendar.appendChild(currentMonthDisplay);
calendar.appendChild(prevMonthBtn);
calendar.appendChild(nextMonthBtn);
calendar.appendChild(calendarGrid);

renderCalendar(); // Initial rendering
