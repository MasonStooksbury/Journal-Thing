import { useEffect, useState } from 'preact/hooks';
import './style.css';

const PORT = 6786

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function Home() {
	return (
		<div class="home">
			<div class='grid'>
		    <ProgressTracker />
			  <TextArea />
			</div>
		</div>
	);
}

function TextArea() {
  return (
    <div class='text-container'>
      <label class='current-day-label'>{getToday()}</label>
      <textarea class='text' id='text'/>
      <div class="save-button-container">
        <a class="btn effect01" target="_blank" onClick={() => save()}><span>Save</span></a>
      </div>
    </div>
  );
}

function ProgressTracker() {
  const currentYear = getThisYear()

  const [card, setCard] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:${PORT}/all-entries/${currentYear}`)
      .then((res) => res.json())
      .then((data) => {
        setCard(data)
      });
  }, [currentYear])

  return (
    <div class='progress-tracker-holder'>
      {card && <Child card={card}/>}
    </div>
  )
}


function Child({ card }) {
  if (typeof(card.entries) === 'function') {
    return(
      <div>loading</div>
    )
  }

  const entries = card.entries

  const array = [];
  // const currentYear = getCurrentYear()

  const [currentYear, setCurrentYear] = useState(getThisYear());
  
  for (let i = 1; i < 366; i++) {
    const dateDay = dateFromDay(currentYear, i);
    const numAsPaddedString = i.toString().padStart(3, '0')
    const className = entries.includes(numAsPaddedString) ? 'tiny-box filled' : 'tiny-box'

    array.push(<div class={className} onClick={async () => await selectEntry(currentYear, numAsPaddedString)} title={dateDay}/>)
  }

  return (
    <div class='progress-tracker'>
      <div class='year-row'>
        <a class='previous' onClick={async () => await changeYear(currentYear, -1).then((newYear) => {setCurrentYear(newYear)}).then(() => {updateProgressTracker()})}>&lt;</a>
        <span class='year-label'>{currentYear}</span>
        <a class='next' onClick={async () => await changeYear(currentYear, 1).then((newYear) => {setCurrentYear(newYear)}).then(() => {updateProgressTracker()})}>&gt;</a>
      </div>
      <div class='box-container'>
        {array}
      </div>
    </div>
  );
}



async function selectEntry(year: number, dayId: string) {
  const response = await fetch(`http://localhost:${PORT}/entries/${year}/${dayId}`)
  const text = await response.text()

  let date = new Date(year, 0); // initialize a date in `year-01-01`
  let newDate = new Date(date.setDate(parseInt(dayId))); // add the number of days
  let current_day = newDate.toLocaleDateString('default', { month: 'long', year: 'numeric', day: 'numeric' });

  const current_day_label = document.getElementsByClassName('current-day-label')[0];
  current_day_label.innerHTML = current_day;

  changeTextareaText(text)
}

function changeTextareaText(text: string) {
  console.log(text)
  const textarea = document.getElementById('text');
  textarea.value = text;
}

async function changeYear(year: number, modifier): Promise<number> {
  return ((year + modifier) > getThisYear()) ? year : year + modifier
}

async function save() {
  // Ignore the warning about value, it's not real
  const textarea = document.getElementById('text').value

  await fetch(`http://localhost:${PORT}/entry`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'year': getCurrentYear(),
      'id': getCurrentDayAsDayId(),
      'entry': textarea
    }),
  }).then(response => {
    console.log('status', response.status)
    if (response.status) {
      updateProgressTracker()
    }
  })

}

function getMonthIndex(month: string) {
  let count = 1;

  for (let m of months) {
    if (m === month) {
      break
    }
    count += 1
  }

  return count
}

function dateFromDay(year: number, day: number) {
  let date = new Date(year, 0); // initialize a date in `year-01-01`
  let newDate = new Date(date.setDate(day)); // add the number of days
  return `${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getDate()}`;
}


// This is the dumbest, most complicated thing ever, but I have 100% confidence this will always work
//  with no bugs whereas the alternative is a bunch of dumb math that's subject to leap year and
//  and DST weirdness (https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366)
function getTodayAsDayId() {
  let now = new Date();
  let dateAsString = now.toLocaleDateString()
  let dateAsArray = dateAsString.split('/')
  let currentYear = parseInt(dateAsArray[2])
  let currentMonth = parseInt(dateAsArray[1])
  let currentDay = parseInt(dateAsArray[0])

  for (let i = 1; i < 366; i++) {
    let date = new Date(currentYear, 0)
    let newDate = new Date(date.setDate(i))
    let newDateAsString = newDate.toLocaleDateString()
    let newDateAsArray = newDateAsString.split('/')
    let newYear = parseInt(newDateAsArray[2])
    let newMonth = parseInt(newDateAsArray[1])
    let newDay = parseInt(newDateAsArray[0])

    if (newYear === currentYear && newMonth === currentMonth && newDay === currentDay) {
      return i
    }
  }  
}

function getCurrentDayAsDayId() {
  const current_day = document.getElementsByClassName('current-day-label')[0].innerHTML;
  let day_as_array = current_day.split(' ')
  console.log(day_as_array)
  let year = parseInt(day_as_array[2])
  let month = getMonthIndex(day_as_array[0])
  let day = parseInt(day_as_array[1].split(',')[0])

  for (let i = 1; i < 366; i++) {
    let date = new Date(year, 0)
    let newDate = new Date(date.setDate(i))
    let newDateAsString = newDate.toLocaleDateString()
    let newDateAsArray = newDateAsString.split('/')
    let newYear = parseInt(newDateAsArray[2])
    let newMonth = parseInt(newDateAsArray[0])
    let newDay = parseInt(newDateAsArray[1])

    if (newYear === year && newMonth === month && newDay === day) {
      return i
    }
  }

  return 999
}

// This is the year that is currently set in code (can change)
function getCurrentYear() {
  return parseInt(document.getElementsByClassName('year-label')[0].textContent)
}

// This is TODAY (only changes every day)
function getToday() {
  let now = new Date();
  return now.toLocaleDateString('default', { month: 'long', year: 'numeric', day: 'numeric' });
}

// This is THIS calendar year (only changes when the year changes)
function getThisYear() {
  let now = new Date();
  let dateAsString = now.toLocaleDateString()
  let dateAsArray = dateAsString.split('/')
  return parseInt(dateAsArray[2])
}


async function getAllEntries() {
  const response = await fetch(`http://localhost:${PORT}/all-entries/${getCurrentYear()}`)
  let entries = await response.text()
  entries = JSON.parse(entries)
  return entries['entries']
}


async function updateProgressTracker() {
  const entries = await getAllEntries()

  let boxes = document.getElementsByClassName('box-container')[0].getElementsByClassName('tiny-box')
  for (let i = 1; i < 366; i++) {
    const numAsPaddedString = i.toString().padStart(3, '0')
    let box = boxes[i-1]
    if (entries.includes(numAsPaddedString)) {
      box.classList.add('filled')
    } else {
      box.classList.remove('filled')
    }
  }

}