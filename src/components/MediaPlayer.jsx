import '../styles/MediaPlayer.css';

export function MediaPlayer({ item, onQuit }) {
  if (!item) return null;

  const renderContent = () => {
    switch (item.action.contentType) {
      case 'video':
        return (
          <video controls autoPlay className="fullscreen-video">
            <source src={item.action.src} type="video/mp4" />
          </video>
        );
      case 'audio':
        return (
          <div className="audio-player">
            <item.icon size={80} />
            <p className="audio-title">{item.label}</p>
            <audio controls autoPlay style={{ width: '80%' }}>
              <source src={item.action.src} type="audio/mp3" />
            </audio>
          </div>
        );
      case 'webgl':
      case 'web':
        return (
          <iframe
            src={item.action.src}
            title={item.label}
            className="fullscreen-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          />
        );
      default:
        return <p>Unsupported media type</p>;
    }
  };

  return (
    <div className="media-player-fullscreen">
      {renderContent()}
      <button className="quit-button" onClick={onQuit}>✕ Quit</button>
    </div>
  );
}
