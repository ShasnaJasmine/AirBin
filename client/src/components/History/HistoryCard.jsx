import "./HistoryCard.css";
import {
  Copy,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

function HistoryCard({ clip, copyHistoryClipboard }) {
  const preview =
    clip.content?.length > 45
      ? clip.content.slice(0, 45) + "..."
      : clip.content;

  const active = Date.now() < clip.expires_at;

  return (
    <div className="history-item">

      <div className="history-left">

        <div className="history-icon">
          <FileText size={18} />
        </div>

        <div className="history-info">

          <div className="history-preview">
            {preview || "File"}
          </div>

          <div className="history-meta">

            <span className="history-code">
              {clip.id}
            </span>

            <span className={active ? "badge active" : "badge expired"}>
              {active ? "Active" : "Expired"}
            </span>

            <span className="history-time">
              <Clock size={14} />
              {new Date(clip.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

          </div>

        </div>

      </div>

      <button
        className="history-copy-btn"
        onClick={() => copyHistoryClipboard(clip)}
      >
        <Copy size={17} />
        Copy
      </button>

    </div>
  );
}

export default HistoryCard;