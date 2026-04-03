import { useState, useEffect } from 'react';
import { Battery, Wifi } from 'lucide-react';
import '../styles/StatusBar.css';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = DAYS[time.getDay()];
  const date = time.getDate();
  const month = MONTHS[time.getMonth()];
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = (hours % 12 || 12).toString().padStart(2, '0');

  return (
    <div className="status-bar">
      <span className="status-date">{day}, {date} {month} {h12}:{minutes}:{seconds} {ampm}</span>
      <span className="status-battery">
        <Battery size={14} fill="currentColor" stroke="currentColor" />
        87%
      </span>
      <Wifi size={14} fill="currentColor" stroke="currentColor" />
    </div>
  );
}
