import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRedo, faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const App = () => {
  const [clickCounter, setClickCounter] = useState(0); // Click counter
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0); // Total countdown in seconds
  const [totalInitialSeconds, setTotalInitialSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [clicksPerMinute, setClicksPerMinute] = useState(null); // Clicks per minute

  // Effect for the countdown timer logic
  useEffect(() => {
    let interval;
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000); // Decrement by 1 second
    } else if (totalSeconds === 0 && isRunning) {
      clearInterval(interval);
      setIsRunning(false); // Stop timer
      calculateClicksPerMinute(); // Calculate clicks per minute
    }
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  // Update hours, minutes, and seconds based on totalSeconds
  useEffect(() => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
  }, [totalSeconds]);

  // Calculate clicks per minute
  const calculateClicksPerMinute = () => {
    const totalMinutes = totalInitialSeconds / 60;
    const clicks = totalMinutes > 0 ? (clickCounter / totalMinutes).toFixed(2) : 0;
    setClicksPerMinute(clicks);
  };

  // Format time as HH:MM:SS
  const formatTime = (hours, minutes, seconds) => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handlers for increment and decrement
  const increment = (unit) => {
    if (unit === "hours") setHours((prev) => Math.min(prev + 1, 99));
    if (unit === "minutes") setMinutes((prev) => (prev + 1) % 60);
    if (unit === "seconds") setSeconds((prev) => (prev + 1) % 60);
  };

  const decrement = (unit) => {
    if (unit === "hours") setHours((prev) => Math.max(prev - 1, 0));
    if (unit === "minutes") setMinutes((prev) => (prev - 1 + 60) % 60);
    if (unit === "seconds") setSeconds((prev) => (prev - 1 + 60) % 60);
  };

  // Handlers for direct input
  const handleInputChange = (e, unit) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    if (unit === "hours") setHours(Math.min(value, 99));
    if (unit === "minutes") setMinutes(value % 60);
    if (unit === "seconds") setSeconds(value % 60);
  };

  // Start the countdown
  const startCountdown = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(totalSeconds);
    setTotalInitialSeconds(totalSeconds)
    setIsRunning(true);
    setClicksPerMinute(null); // Clear previous clicks per minute result
  };

  // Reset everything
  const resetEverything = () => {
    setClickCounter(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTotalSeconds(0);
    setIsRunning(false);
    setClicksPerMinute(null); // Clear clicks per minute result
  };

  return (
    <div className="App">
      <h2>Countdown Timer with Click Counter</h2>

      {/* Click Counter Section */}
      <div className="click-counter">
        <h1>Counter: {clickCounter}</h1>
        <div>
          <button onClick={() => setClickCounter((prev) => prev + 1)}> 
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button onClick={() => setClickCounter((prev) => Math.max(prev - 1, 0))}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button onClick={() => setClickCounter(0)}>
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>

      {/* Timer Section */}
      <div className="timer-display">{formatTime(hours, minutes, seconds)}</div>

      <div className="set-timer">
      {/* Hours Section */}
      <div className="time-unit">
        <div className="buttons">
          <button className="timer-button" onClick={() => increment("hours")}><FontAwesomeIcon icon={faPlus} /></button>
          <button className="timer-button" onClick={() => decrement("hours")}><FontAwesomeIcon icon={faMinus} /></button>
        </div>
        {!isRunning && (
          <input
            type="number"
            value={hours}
            onChange={(e) => handleInputChange(e, "hours")}
            max="99"
            min="0"
          />
        )}
        <span>Hours</span>
      </div>

      {/* Minutes Section */}
      <div className="time-unit">
        <div className="buttons">
          <button className="timer-button" onClick={() => increment("minutes")}><FontAwesomeIcon icon={faPlus} /></button>
          <button className="timer-button" onClick={() => decrement("minutes")}><FontAwesomeIcon icon={faMinus} /></button>
        </div>
        {!isRunning && (
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleInputChange(e, "minutes")}
            max="59"
            min="0"
          />
        )}
        <span>Minutes</span>
      </div>

      {/* Seconds Section */}
      <div className="time-unit">
        <div className="buttons">
          <button className="timer-button" onClick={() => increment("seconds")}><FontAwesomeIcon icon={faPlus} /></button>
          <button className="timer-button" onClick={() => decrement("seconds")}><FontAwesomeIcon icon={faMinus} /></button>
        </div>
        {!isRunning && (
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleInputChange(e, "seconds")}
            max="59"
            min="0"
          />
        )}
        <span>Seconds</span>
      </div>
    </div>


      <div className="controls">
        <button onClick={startCountdown}>
          <FontAwesomeIcon icon={faPlay} /> {/* Play icon */}
        </button>
        <button onClick={() => setIsRunning(false)}>
          <FontAwesomeIcon icon={faPause} /> {/* Pause icon */}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setTotalSeconds(0);
          }}
        >
          Reset Timer
        </button>
        <br></br>
        <br></br>
        <button onClick={resetEverything}>Reset Everything</button>
      </div>

      {/* Clicks Per Minute Result */}
      {clicksPerMinute !== null && (
        <div className="clicks-per-minute">
          <h3>Clicks Per Minute: {clicksPerMinute}</h3>
        </div>
      )}
    </div>
  );
};

export default App;
