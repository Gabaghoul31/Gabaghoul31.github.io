const calendar = document.getElementById('calendar');
const currentMonthDisplay = document.createElement('div');
const calendarGrid = document.createElement('table');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

export function renderCalendar() {
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
}

// Event Listeners for Calendar Days
calendarGrid.addEventListener('click', (event) => {
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
    const placeholder = document.querySelector('.placeholder');
    const dayOfWeek = new Date(currentYear, currentMonth, dayNumber).toLocaleDateString('en-US', { weekday: 'long' });

    placeholder.innerHTML = `<h2>${dayOfWeek}</h2>`; // Display day of the week

    // Display appointments (if any)
    if (appointments[dayNumber]) {
        const appointmentList = document.createElement('ul');
        appointments[dayNumber].forEach(appt => {
            const listItem = document.createElement('li');
            listItem.textContent = appt;
            appointmentList.appendChild(listItem);
        });
        placeholder.appendChild(appointmentList);
    } else {
        placeholder.innerHTML += '<p>No appointments for this day.</p>';
    }
}

// Select current day on page load
function selectCurrentDay() {
    const today = new Date();
    const currentDay = today.getDate();

    const allDays = calendarGrid.querySelectorAll('td');
    allDays.forEach(day => {
        if (day.textContent === String(currentDay)) {
            highlightDay(day);
            updateComingSoon(currentDay);
        }
    });
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

export function initCalendar() {
    renderCalendar(); // Initial rendering
    selectCurrentDay(); // Select current day on page load
}
