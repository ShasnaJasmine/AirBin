import "./RecentClipboard.css";

function RecentClipboard({
    recent,
    setSearchCode,
    getClipboard,
}){
  return (
    <div className="recent-card">
        <div className="recent-header">
            <h3>🕘 Recent Clipboard</h3>
        </div>
      <div className="recent-body">

        {recent ? (
            <>
                <div className="recent-info">

                    <div className="recent-name">
                        {recent.type === "file"
                            ? `📁 ${recent.filename}`
                            : `📄 ${recent.content.substring(0, 40)}${recent.content.length > 40 ? "..." : ""}`}
                    </div>

                    <div className="recent-time">
                        {new Date(recent.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                        {" • "}
                        {new Date(recent.created_at).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>

                </div>
                <button
                    className="recent-open"
                    onClick={() => {
                        setSearchCode(recent.id);
                        getClipboard(recent.id);
                    }}
                >
                    Open
                </button>

            </>
        ) : (
            <>
                <div className="recent-name">
                    No recent clipboard
                </div>

                <div className="recent-time">
                    Create or retrieve a clipboard to see it here.
                </div>
            </>
        )}

    </div>
  </div>
    );
}

export default RecentClipboard;