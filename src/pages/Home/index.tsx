import { useEffect, useState } from 'preact/hooks';
import './style.css';

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
      <textarea class='text' id='text'/>
      <div class="save-button-container">
        <a class="btn effect01" target="_blank" onClick={() => save()}><span>Save</span></a>
      </div>
    </div>
  );
}

function ProgressTracker() {
  const currentYear = getCurrentYear()

  const [card, setCard] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/all-entries/${currentYear}`)
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
  const currentYear = getCurrentYear()
  
  for (let i = 1; i < 366; i++) {
    const dateDay = dateFromDay(currentYear, i);
    const numAsPaddedString = i.toString().padStart(3, '0')
    const className = entries.includes(numAsPaddedString) ? 'tiny-box filled' : 'tiny-box'

    array.push(<div class={className} onClick={async () => await selectEntry(currentYear, numAsPaddedString)} title={dateDay}/>)
  }

  return (
    <div class='progress-tracker'>
      <div class='year-row'>
        <a class='previous'>&lt;</a>
        <span class='year-label'>{currentYear}</span>
        <a class='next'>&gt;</a>
      </div>
      <div class='box-container'>
        {array}
      </div>
    </div>
  );
}



async function selectEntry(year: number, dayId: String) {
  const response = await fetch(`http://localhost:3000/entries/${year}/${dayId}`)
  const text = await response.text()

  changeTextareaText(text)
}

function changeTextareaText(text: string) {
  console.log(text)
  const textarea = document.getElementById('text');
  textarea.value = text;
}

async function save() {
  // Ignore the warning about value, it's not real
  const textarea = document.getElementById('text').value

  const response = await fetch("http://localhost:3000/entry", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'year': getCurrentYear(),
      'id': getTodayAsDayId(),
      'entry': textarea
    }),
  }).then(response => {
    console.log('status', response.status)
    if (response.status) {
      updateProgressTracker()
    }
  })

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


function getCurrentYear() {
  let now = new Date();
  let dateAsString = now.toLocaleDateString()
  let dateAsArray = dateAsString.split('/')
  return parseInt(dateAsArray[2])
}


async function getAllEntries() {
  const response = await fetch(`http://localhost:3000/all-entries/${getCurrentYear()}`)
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