function ReceiveClipboard({
  setPage,
  retrievedContent,
  copyClipboard,
  clearClipboard,
  searchCode,
  setSearchCode,
  getClipboard,
  loading,
  error,
}) {
  return (
    <div id="receive-clipboard" className="retrieve-section">
<div className="page-header">

  <button
    className="back-btn"
    onClick={() => setPage("home")}
  >
    ← Home
  </button>

</div>

<h1>Receive Clipboard</h1>

<p className="card-subtitle">
  Retrieve shared text using a code.
</p>

      {retrievedContent && (
        <>
          <p className="clipboard-output">
            Clipboard: {retrievedContent}
          </p>

          <div className="button-group">
            <button onClick={copyClipboard}>
              📋 Copy Clipboard
            </button>

            <button onClick={clearClipboard}>
              🗑 Clear
            </button>
          </div>
        </>
      )}

      <input
        type="text"
        placeholder="Enter code"
        value={searchCode}
        onChange={(event) => setSearchCode(event.target.value)}
      />

      <button
        onClick={getClipboard}
        disabled={searchCode.trim() === "" || loading}
      >
        {loading ? "Loading..." : "Get Clipboard"}
      </button>

      {error && <p>{error}</p>}

    </div>
  );
}

export default ReceiveClipboard;