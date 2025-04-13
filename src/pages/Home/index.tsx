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
      <textarea class='text'/>
      <div class="save-button-container">
        <a class="btn effect01" target="_blank" onClick={() => save()}><span>Save</span></a>
      </div>
    </div>
  );
}

function ProgressTracker() {
  let now = new Date();
  const currentYear = now.getFullYear();

  const [card, setCard] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/all-entries/${currentYear}`)
      .then((res) => res.json())
      .then((data) => {
        setCard(data)
        console.log(data); 
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
    console.log('in here')
    return(
      <div>loading</div>
    )
  }

  const entries = card.entries
  console.log(typeof(entries))
  console.log(entries)
  const array = [];
  let now = new Date();
  const currentYear = now.getFullYear();
  
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
  console.log('entry selected', year, dayId)

  const response = await fetch(`http://localhost:3000/entries/${year}/${dayId}`)
  const text = await response.text()

  changeTextareaText(text)
}

function changeTextareaText(text: string) {
  console.log(text)
  const textarea = document.getElementsByClassName('text')[0];
  textarea.innerHTML = text;
}

async function save() {
  // const response = await fetch("http://localhost:3000/entry", {
  //   method: "POST",
  //   body: "Hello, world!",
  // });
  // console.log(await response.text())
  console.log('save')
}

function dateFromDay(year: number, day: number) {
  let date = new Date(year, 0); // initialize a date in `year-01-01`
  let newDate = new Date(date.setDate(day)); // add the number of days
  return `${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getDate()}`;
}
