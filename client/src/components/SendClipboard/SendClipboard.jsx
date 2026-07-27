import "./sendClipboard.css";
import QRCode from "react-qr-code";
import {
  Clock3,
  FileText,
  File,
  Copy
} from "lucide-react";
function SendClipboard({
  mode,
  setMode,
  content,
  setContent,
  selectedFile,
  setSelectedFile,
  createClipboard,
  uploadFile,
  creating,
  code,
  timeLeft,
  copied,
  copyCode,
}) {
return (
  <div className="send-card">

    <div className="send-header">

      <div className="send-title">

        <h2>Send Clipboard</h2>

        <p>
          Share text or files instantly with another device.
        </p>

      </div>

      <div className="expire-chip">

        <Clock3 size={16} />

        <span>Auto Expires in 5 min</span>

      </div>

    </div>

    <div className="mode-switch">

      <button
        className={mode === "text" ? "active" : ""}
        onClick={() => setMode("text")}
      >
        <FileText size={18} />
        <span>Text</span>
      </button>

      <button
        className={mode === "file" ? "active" : ""}
        onClick={() => setMode("file")}
      >
        <File size={18} />
        <span>Files</span>
      </button>

    </div>

    {mode === "text" ? (

      <textarea
        className="clipboard-input"
        placeholder="Paste your clipboard here..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

    ) : (

      <div
        className="upload-area"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {

          event.preventDefault();

          const file = event.dataTransfer.files[0];

          if (file) {
            setSelectedFile(file);
          }

        }}
      >

        <label className="upload-box">

          <input
            type="file"
            onChange={(event) =>
              setSelectedFile(event.target.files[0])
            }
          />

          <div className="upload-inner">

            <File size={48} />

            <h3>Drop your file here</h3>

            <p>or click to browse</p>

            {selectedFile && (

              <div className="selected-file">

                {selectedFile.name}

              </div>

            )}

          </div>

        </label>

      </div>

    )}

<div className="action-layout">

  <div className="left-column">

    <div className="status-card">
      <span>Expires In</span>
      <h3>{code ? timeLeft : "05:00"}</h3>
    </div>

    <div className="status-card">
      <span>Your Code</span>
      <h3>{code || "------"}</h3>
    </div>

    <button
      className="copy-btn"
      onClick={copyCode}
      disabled={!code}
    >
      <Copy size={18} />
      {copied ? "Copied!" : "Copy Code"}
    </button>

  </div>

  <div className="right-column">

    <button
      className="generate-btn"
      onClick={mode === "text" ? createClipboard : uploadFile}
      disabled={
        creating ||
        (mode === "text"
          ? content.trim() === ""
          : !selectedFile)
      }
    >
      {creating ? "Creating..." : "Generate Code"}
    </button>

    <div className="qr-card">

      {code ? (
        <>
          <QRCode
            value={`${window.location.origin}/?code=${code}`}
            size={84}
          />
          <p>QR Code</p>
        </>
      ) : (
        <div className="qr-placeholder">
          <QRCode
            value="https://airbin.app"
            size={90}
            fgColor="#4b5563"
          />
          <p>QR will appear here</p>
        </div>
      )}

    </div>

  </div>

</div>
</div>
);
}

export default SendClipboard;
