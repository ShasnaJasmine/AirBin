import "./History.css";
import { History as HistoryIcon } from "lucide-react";
import HistoryCard from "./HistoryCard";

function History({ history, copyHistoryClipboard }) {
  return (
    <section className="history-card">

      <div className="history-header">

        <div className="history-title">

          <HistoryIcon size={22} />

          <h2>Clipboard History</h2>

        </div>

      </div>

      <div className="history-list">

        {history.length === 0 ? (

          <div className="empty-history">

            No clipboard history yet.

          </div>

        ) : (

          history.map((clip) => (

            <HistoryCard
              key={clip.id}
              clip={clip}
              copyHistoryClipboard={copyHistoryClipboard}
            />

          ))

        )}

      </div>

    </section>
  );
}

export default History;