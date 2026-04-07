import { useXMB } from '../context/XMBContext';
import { StatusBar } from './StatusBar';
import '../styles/QuitDialog.css';

export function QuitDialog() {
  const { state, hideQuitDialog, executeQuitDialog } = useXMB();
  const selectedIndex = state.quitDialogIndex;
  const handleSelect = (index) => {
    if (index === 0) executeQuitDialog();
    else hideQuitDialog();
  };

  return (
    <div className="quit-dialog-overlay">
      <StatusBar />
      <div className="quit-dialog">
        <p className="quit-dialog-message">Do you want to quit?</p>
        <div className="quit-dialog-options">
          <div
            className={`quit-option ${selectedIndex === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >Yes</div>
          <div
            className={`quit-option ${selectedIndex === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >No</div>
        </div>
      </div>
      <div className="overlay-hint">
        <span><span className="ps-icon">×</span> Confirm</span>
        <span><span className="ps-icon">◯</span> Cancel</span>
      </div>
    </div>
  );
}
