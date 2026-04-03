import { useXMB } from '../context/XMBContext';
import { StatusBar } from './StatusBar';
import '../styles/QuitDialog.css';

export function QuitDialog() {
  const { state, hideQuitDialog, executeQuitDialog } = useXMB();
  const selectedIndex = state.quitDialogIndex;

  const handleSelect = (index) => {
    if (index === 0) {
      executeQuitDialog();
    } else {
      hideQuitDialog();
    }
  };

  return (
    <div className="quit-dialog-overlay">
      <StatusBar />
      <div className="quit-dialog">
        <h3 className="quit-dialog-title">Exit</h3>
        <p className="quit-dialog-message">Do you want to quit the game?</p>
        <div className="quit-dialog-options">
          <button
            className={`quit-option ${selectedIndex === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            Yes
          </button>
          <button
            className={`quit-option ${selectedIndex === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
