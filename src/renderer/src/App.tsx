import React, { useState, useEffect, useCallback } from 'react';

function App(): React.JSX.Element {
  const POMODORO_DURATION = 25 * 60; // 25 minutos
  const SHORT_BREAK_DURATION = 5 * 60; // 5 minutos
  const LONG_BREAK_DURATION = 15 * 60; // 15 minutos
  const POMODOROS_UNTIL_LONG_BREAK = 4;

  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectMode = useCallback((newMode: string, autoStart = false) => {
    setMode(newMode);
    setIsRunning(false); // Pausar ao trocar de modo manualmente
    let duration = POMODORO_DURATION;
    if (newMode === 'shortBreak') {
      duration = SHORT_BREAK_DURATION;
    } else if (newMode === 'longBreak') {
      duration = LONG_BREAK_DURATION;
    }
    setTimeRemaining(duration);
    if (autoStart) {
      setIsRunning(true);
    }
  }, []);

  const handleTimerEnd = useCallback(() => {
    setIsRunning(false);

    let notificationTitle = '';
    let notificationBody = '';

    if (mode === 'pomodoro') {
      notificationTitle = 'Pomodoro Finalizado!';
      if ((pomodoroCount + 1) % POMODOROS_UNTIL_LONG_BREAK === 0) {
        notificationBody = 'Hora de um Descanso Longo!';
      } else {
        notificationBody = 'Hora de um Descanso Curto!';
      }
    } else { // if mode was shortBreak or longBreak
      notificationTitle = 'Descanso Finalizado!';
      notificationBody = 'Hora de focar!';
    }

    if (window.electron && window.electron.ipcRenderer) {
      (window.electron.ipcRenderer as any).send('timer-finished', { title: notificationTitle, body: notificationBody });
    }

    if (mode === 'pomodoro') {
      setPomodoroCount((prevCount) => prevCount + 1);
      if ((pomodoroCount + 1) % POMODOROS_UNTIL_LONG_BREAK === 0) {
        selectMode('longBreak', true); // Inicia automaticamente o descanso longo
      } else {
        selectMode('shortBreak', true); // Inicia automaticamente o descanso curto
      }
    } else { // if mode was shortBreak or longBreak
      selectMode('pomodoro', true); // Inicia automaticamente o pomodoro
    }
  }, [mode, pomodoroCount, selectMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimerEnd();
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeRemaining, handleTimerEnd]);

  // Reset function adjusted
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setTimeRemaining(POMODORO_DURATION);
    } else if (mode === 'shortBreak') {
      setTimeRemaining(SHORT_BREAK_DURATION);
    } else if (mode === 'longBreak') {
      setTimeRemaining(LONG_BREAK_DURATION);
    }
    // Não reseta pomodoroCount aqui, ele é resetado na lógica de ciclo ou manualmente
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const progress = mode === 'pomodoro' 
    ? ((POMODORO_DURATION - timeRemaining) / POMODORO_DURATION) * 100
    : mode === 'shortBreak'
    ? ((SHORT_BREAK_DURATION - timeRemaining) / SHORT_BREAK_DURATION) * 100
    : ((LONG_BREAK_DURATION - timeRemaining) / LONG_BREAK_DURATION) * 100;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100vh',
      padding: '12px',
      paddingBottom: '15px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#2d1b1b',
      color: '#ffffff',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🍅</span>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Pomodoro</h1>
        </div>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '5px'
        }}>⚙️</button>
      </div>
      
      {/* Mode Buttons */}
      <div style={{ 
        display: 'flex',
        gap: '8px',
        marginBottom: '15px',
        width: '100%'
      }}>
        <button 
          onClick={() => selectMode('pomodoro')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: mode === 'pomodoro' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: mode === 'pomodoro' ? '#ef4444' : '#9ca3af',
            border: mode === 'pomodoro' ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Focus
        </button>
        <button 
          onClick={() => selectMode('shortBreak')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: mode === 'shortBreak' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: mode === 'shortBreak' ? '#ef4444' : '#9ca3af',
            border: mode === 'shortBreak' ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Short
        </button>
        <button 
          onClick={() => selectMode('longBreak')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: mode === 'longBreak' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
            color: mode === 'longBreak' ? '#ef4444' : '#9ca3af',
            border: mode === 'longBreak' ? '2px solid rgba(239, 68, 68, 0.5)' : '2px solid rgba(156, 163, 175, 0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Long
        </button>
      </div>

      {/* Circular Timer */}
      <div style={{ 
        position: 'relative',
        width: '180px',
        height: '180px',
        marginBottom: '12px',
        flexShrink: 0
      }}>
        <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="rgba(239, 68, 68, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '40px', 
            fontWeight: '300',
            letterSpacing: '-1px',
            marginBottom: '3px'
          }}>
            {formatTime(timeRemaining)}
          </div>
          <div style={{ 
            fontSize: '10px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            {isRunning ? 'FOCUSING' : 'PAUSED'}
          </div>
        </div>
      </div>

      {/* Session Counter */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '10px'
      }}>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
          Session {(pomodoroCount % POMODOROS_UNTIL_LONG_BREAK) + 1} of {POMODOROS_UNTIL_LONG_BREAK}
        </span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[...Array(POMODOROS_UNTIL_LONG_BREAK)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: i < (pomodoroCount % POMODOROS_UNTIL_LONG_BREAK) ? '#ef4444' : 'rgba(156, 163, 175, 0.3)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        marginTop: 'auto'
      }}>
        <button 
          onClick={isRunning ? pauseTimer : startTimer}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '16px' }}>▶</span>
          {isRunning ? 'PAUSE' : 'START FOCUS'}
        </button>
        <button 
          onClick={resetTimer}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '14px' }}>↻</span>
          Reset Timer
        </button>
      </div>
    </div>
  );
}

export default App
