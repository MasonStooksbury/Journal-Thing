import preactLogo from '../../assets/preact.svg';
import './style.css';

export function Home() {
	return (
		<div class="home">
			{/* <a href="https://preactjs.com" target="_blank">
				<img src={preactLogo} alt="Preact logo" height="160" width="160" />
			</a>*/}
			{/* <h1>Get Started building Vite-powered Preact Apps </h1> */}

			<div class='grid'>
		    <ProgressTracker />
			  <TextArea />
			</div>
		</div>
	);
}

function TextArea(props) {
  return (
    <div class='text-container'>
      <textarea class='text'/>
      <div class="save-button-container">
        <a href="h" class="btn effect01" target="_blank"><span>Save</span></a>
      </div>
    </div>
  );
}

function ProgressTracker(props) {
  const array = [];
  // const array = [<p>S</p>,<p>M</p>,<p>T</p>,<p>W</p>,<p>R</p>,<p>F</p>,<p>S</p>,];
  for (let i = 0; i < 365; i++) {
    array.push(<div class='tiny-box' title={dateFromDay(2025, i)}/>)
  }
  return (
    <div class='box-container'>
      {array}
    </div>
  );
}

function Resource(props) {
	return (
		<a href={props.href} target="_blank" class="resource">
			<h2>{props.title}</h2>
			<p>{props.description}</p>
		</a>
	);
}


function dateFromDay(year: number, day: number) {
  let date = new Date(year, 0); // initialize a date in `year-01-01`
  let newDate = new Date(date.setDate(day+1)); // add the number of days
  return `${newDate.toLocaleString('default', { month: 'long' })} ${newDate.getDate()}`;
}
