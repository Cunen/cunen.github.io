import React from 'react';
import './editmodal.scss';

const hourInMilliseconds = 3600000;
const dayInMilliseconds = hourInMilliseconds * 24;
const weekInMilliseconds = dayInMilliseconds * 7;
const monthInMilliseconds = weekInMilliseconds * 30;

const intervalUnits = [
  { title: 'Hours', milliseconds: hourInMilliseconds },
  { title: 'Days', milliseconds: dayInMilliseconds },
  { title: 'Weeks', milliseconds: weekInMilliseconds },
  { title: 'Months', milliseconds: monthInMilliseconds },
]

export default function EditModal() {
  const [name, setName] = React.useState('');
  const [interval, setInterval] = React.useState(1);
  const [intervalUnit, setIntervalUnit] = React.useState('Hours');
  const [points, setPoints] = React.useState(1);

  const handleNameChange = event => setName(event.currentTarget.value);
  const handleIntervalChange = event => setInterval(event.currentTarget.value);
  const handlePointsChange = event => setPoints(event.currentTarget.value);


  return <div className="modalBackground">
    <div className="modal">
      <form>
        <p>Create a job</p>
        <input type="text" name="name" placeholder="Name" value={name} onChange={handleNameChange}/>
        <p>Repeat every</p>
        <input type="number" name="interval" value={interval} onChange={handleIntervalChange} />
        <div className="durationButtons">
          {intervalUnits.map(unit => {
            return <button
              className={unit.title === intervalUnit ? 'selected' : ''}
              key={unit.title}
              type="button"
              onClick={() => setIntervalUnit(unit.title)}>{unit.title}
            </button>;
          })}
        </div>
        <p>Points</p>
        <input type="number" name="points" value={points} onChange={handlePointsChange} />
      </form>
      
    </div>
  </div>;
}
