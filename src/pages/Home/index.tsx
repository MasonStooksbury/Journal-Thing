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

  const array = [];
  for (let i = 1; i < 366; i++) {
    const dateDay = dateFromDay(currentYear, i);
    array.push(<div class='tiny-box' onClick={() => selectEntry(dateDay, i)} title={dateDay}/>)
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

function selectEntry(date: string, dayId: number) {
  console.log('entry selected', date, dayId)
}

function save() {
  console.log('save')
}

function dateFromDay(year: number, day: number) {
  let date = new Date(year, 0); // initialize a date in `year-01-01`
  let newDate = new Date(date.setDate(day)); // add the number of days
  return `${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getDate()}`;
}
