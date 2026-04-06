import { useReducer, useEffect, useRef } from 'react';
import '../styles/SplashBackground.css';

const SPLASH_DELAY = 1500;

const initialState = { url: null, visible: false };

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE':
      return { url: action.url, visible: false };
    case 'SHOW':
      return { ...state, visible: true };
    default:
      return state;
  }
}

export function SplashBackground({ splashArt, hidden }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef(null);
  const artRef = useRef(splashArt);

  useEffect(() => {
    if (splashArt === artRef.current) return;
    artRef.current = splashArt;

    clearTimeout(timerRef.current);

    if (!splashArt) {
      dispatch({ type: 'CHANGE', url: null });
      return;
    }

    dispatch({ type: 'CHANGE', url: splashArt });
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SHOW' });
    }, SPLASH_DELAY);

    return () => clearTimeout(timerRef.current);
  }, [splashArt]);

  return (
    <div
      className={`splash-bg ${state.visible && !hidden ? 'splash-bg-in' : ''}`}
      style={{
        ...(state.url ? { backgroundImage: `url(${state.url})` } : undefined),
        ...(hidden ? { opacity: 0, transition: 'none' } : undefined),
      }}
    />
  );
}
