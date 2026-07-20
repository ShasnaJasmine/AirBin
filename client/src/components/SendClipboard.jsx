import { ArrowLeft } from "lucide-react";
function SendClipboard({
  setPage,
  content,
  setContent,
  createClipboard,
  creating,
  code,
  timeLeft,
  copied,
  copyCode,
}) {
  return (
    <div id="send-clipboard" className="create-section">

<div className="header-top">
  <button
    className="back-btn"
    onClick={() => setPage("home")}
  >
    <ArrowLeft size={18} />
    <span>Home</span>
  </button>

  <div className="expiry-badge">
    ⏱ Auto Expires in 5 min
  </div>
</div>

<div className="page-header">
  <div>
    <h1>Send Clipboard</h1>
    <p>Share text instantly with another device.</p>
  </div>
</div>
      <textarea
        placeholder="Paste your text here"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      
      <button
        onClick={createClipboard}
        disabled={content.trim() === "" || creating}
      >
        {creating ? "Creating..." : "Create Code"}
      </button>

      {code && (
        <>
          <div className="code-info">

            <div className="info-card">
              <span>Your Code</span>
              <h2>{code}</h2>
            </div>

            <div className="info-card">
              <span>Expires In</span>
              <h2>
                {timeLeft === "Expired" ? "Expired" : timeLeft}
              </h2>
            </div>

          </div>

          <button onClick={copyCode}>
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </>
      )}

    </div>
  );
}

export default SendClipboard;