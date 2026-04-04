import { useState, useEffect } from 'react';
import '../styles/StatusBar.css';

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = time.getDate().toString().padStart(2, '0');
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="status-bar">
      <span className="status-date">{day}/{month}&nbsp;&nbsp;{hours}:{minutes}</span>
      <img src="/battery.svg" alt="Battery" className="status-battery" />
    </div>
  );
}
