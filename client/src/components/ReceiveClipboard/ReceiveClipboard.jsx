
import "./ReceiveClipboard.css";
function ReceiveClipboard({
 
  retrievedContent,
  retrievedFile,
  copyClipboard,
  downloadFile,
  clearClipboard,
  searchCode,
  setSearchCode,
  getClipboard,
  loading,
  error,
}) {
return (
    <div className="receive-card">

        <div className="receive-header">

            <h2>Receive Clipboard</h2>

            <p>
                Retrieve shared text or files using a code.
            </p>

        </div>

        <div className="input-row">

            <input
                className="code-input"
                type="text"
                placeholder="Enter 6-character code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
            />

            <button
                className="retrieve-btn"
                onClick={() => getClipboard(searchCode)}
                disabled={loading || searchCode.trim() === ""}
            >
                {loading ? "Retrieving..." : "Retrieve"}
            </button>

        </div>

        <div className="clipboard-layout">

            <div className="clipboard-box">

                <div className="clipboard-title">

                    📄 <span>Clipboard Content</span>

                </div>

                <div className="clipboard-content">

                    {retrievedContent ? (
                        retrievedContent
                    ) : retrievedFile ? (
                        `📄 ${retrievedFile.filename}`
                    ) : (
                        "Your content will appear here..."
                    )}

                </div>

            </div>

            <div className="clipboard-actions">

                <button
                    onClick={copyClipboard}
                    disabled={!retrievedContent}
                >
                    📋 Copy
                </button>

                <button
                    onClick={downloadFile}
                    disabled={!retrievedFile}
                >
                    📥 Download
                </button>

                <button
                    onClick={clearClipboard}
                    disabled={!retrievedContent && !retrievedFile}
                >
                    🗑 Clear
                </button>

            </div>

        </div>

        {error && (

            <div className="error-message">

                {error}

            </div>

        )}

    </div>
); 
}

export default ReceiveClipboard;