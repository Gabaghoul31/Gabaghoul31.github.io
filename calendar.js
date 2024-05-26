// Function to render the calendar
function renderCalendar(calendar, currentMonthDisplay, calendarGrid, currentMonth, currentYear) {
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

// Function to highlight a day
function highlightDay(dayElement) {
    const allDays = calendarGrid.querySelectorAll('td');
    allDays.forEach(day => day.classList.remove('selected')); // Remove previous highlight
    dayElement.classList.add('selected'); // Add highlight
}

// Function to update the "Coming Soon!" section
function updateComingSoon(dayNumber, appointments, currentYear, currentMonth) {
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

// Function to select the current day on page load
function selectCurrentDay(calendarGrid) {
    const today = new Date();
    const currentDay = today.getDate();

    const allDays = calendarGrid.querySelectorAll('td');
    allDays.forEach(day => {
        if (day.textContent === String(currentDay)) {
            highlightDay(day);
            updateComingSoon(currentDay, appointments, today.getFullYear(), today.getMonth());
        }
    });
}

// Function to change the month
function changeMonth(increment, currentMonth, currentYear, calendarGrid, currentMonthDisplay) {
    currentMonth += increment;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(calendar, currentMonthDisplay, calendarGrid, currentMonth, currentYear);
}

export { renderCalendar, highlightDay, updateComingSoon, selectCurrentDay, changeMonth };
