function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function HistoryCard({ clip, copyHistoryClipboard }) {
  return (
    <div className="history-card">
      <div className="history-header">
        <h3>{clip.id}</h3>

        <span
          className={
            clip.status === "active"
              ? "status active"
              : "status consumed"
          }
        >
        {clip.status === "active" ? "Active" : "Consumed"}  
        </span>
      </div>

      <p>{clip.content}</p>

      <div className="history-footer">
        <small>{formatDate(clip.created_at)}</small>

        <button
          className="copy-history-btn"
          onClick={() => copyHistoryClipboard(clip.content)}
        >
          📋 Copy
        </button>
      </div>
    </div>
  );
}

export default HistoryCard;