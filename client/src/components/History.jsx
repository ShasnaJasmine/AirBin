import HistoryCard from "./HistoryCard";

function History({ history, copyHistoryClipboard }) {
  return (
    <section className="history">
      <h2>Clipboard History</h2>

      {history.length === 0 ? (
        <p>No clipboard history.</p>
      ) : (
        history.map((clip) => (
          <HistoryCard
            key={clip.id}
            clip={clip}
            copyHistoryClipboard={copyHistoryClipboard}
          />
        ))
      )}
    </section>
  );
}

export default History;