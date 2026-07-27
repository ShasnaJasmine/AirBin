import History from "./components/History/History";
import socket from "./socket/socket";
import ReceiveClipboard from "./components/ReceiveClipboard/ReceiveClipboard";
import SendClipboard from "./components/SendClipboard/SendClipboard";
import RecentClipboard from "./components/RecentClipboard";

import Header from "./components/Header/Header";

import { useState, useEffect } from "react";

function App(){
  const [content,setContent] = useState("");
  const [mode, setMode] = useState("text");
  const [selectedFile, setSelectedFile] = useState(null);
  const [retrievedFile, setRetrievedFile] = useState(null);
  const [code , setCode] = useState("");
  const [searchCode , setSearchCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrievedContent , setRetrievedContent] = useState("");
  const [retrievedId, setRetrievedId] = useState("");
  const [copied , setCopied] = useState(false);
  const [error , setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  
  const createClipboard = async () => {
    try{
      setCreating(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content
        })
      });

      const data = await response.json();
      setCode(data.id);
      socket.emit("join-room", data.id);
      setExpiresAt(data.expires_at);
      
      setCopied(false);
      await getHistory();
    } finally{
      setCreating(false);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setCode(data.id);
      socket.emit("join-room", data.id);
      setExpiresAt(data.expires_at);

      setCopied(false);
      await getHistory();
    } finally {
      setCreating(false);
    }
  };
  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
        setCopied(false);
    }, 2000);
  }
  const copyHistoryClipboard = async (content) => {
    await navigator.clipboard.writeText(content);
    alert("Clipboard copied!");
  };
  const copyClipboard = async () => {
    await navigator.clipboard.writeText(retrievedContent);
    setCopied(true);

  };
const downloadFile = () => {
  const link = document.createElement("a");

  link.href = `${import.meta.env.VITE_API_URL}/uploads/${retrievedFile.filepath}`;
  link.download = retrievedFile.filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const clearClipboard = async () => {
  if (retrievedId) {
    await fetch(`${import.meta.env.VITE_API_URL}/clip/${retrievedId}`, {
      method: "DELETE",
    });

    await getHistory();
    resetSender();
  }

  setRetrievedContent("");
  setRetrievedFile(null);
  setRetrievedId("");
  setSearchCode("");
  setCopied(false);

  setCode("");
  setExpiresAt(null);
  setTimeLeft("");
};
  const resetSender = () => {
    setContent("");
    setCode("");
    setExpiresAt(null);
    setTimeLeft("");
    setCopied(false);
  };  

 const getClipboard = async (clipboardCode = searchCode) => {
    try{
      setLoading(true);
      setError("");
      setRetrievedContent("");
      
const response = await fetch(
  `${import.meta.env.VITE_API_URL}/clip/${clipboardCode}`
);
      
      if(!response.ok){
        const data = await response.json();
        setError(data.message);
        await getHistory();
        return;
      }

const data = await response.json();

if (data.type === "text") {
  setRetrievedContent(data.content);
  setRetrievedFile(null);
} else {
  setRetrievedContent("");
  setRetrievedFile(data);
}

setRetrievedId(clipboardCode);
setSearchCode("");
    }
    catch{
      setError("🌐 Unable to connect to the server.")
    }
    finally{
      setLoading(false);
    }
  };
  
  const getHistory = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/history`);
  const data = await response.json();

  setHistory(data);
};

const toggleTheme = () => {
  setDarkMode(!darkMode);
};

useEffect(() => {
  if (darkMode) {
    document.body.classList.remove("light");
  } else {
    document.body.classList.add("light");
  }
}, [darkMode]);

  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft("Expired");
        clearInterval(timer);
        return;
      }
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);


  useEffect(() => {

    socket.on("clipboard-consumed", () => {
      resetSender();
    });

    return () => {
      socket.off("clipboard-consumed");
    };
  }, []);

    useEffect(() => {
      getHistory();
    }, []);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    setPage("receive");
    setSearchCode(code);

    setTimeout(() => {
      getClipboard(code);
    }, 200);
  }
}, []);

return (
  <>
    <Header
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    />

    <main className="container">

      <section className="dashboard">

        <section className="panel">
          <SendClipboard
            mode={mode}
            setMode={setMode}
            content={content}
            setContent={setContent}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            createClipboard={createClipboard}
            uploadFile={uploadFile}
            creating={creating}
            code={code}
            timeLeft={timeLeft}
            copied={copied}
            copyCode={copyCode}
          />
        </section>

        <section className="right-panel">
          <ReceiveClipboard
            retrievedContent={retrievedContent}
            retrievedFile={retrievedFile}
            copyClipboard={copyClipboard}
            downloadFile={downloadFile}
            clearClipboard={clearClipboard}
            searchCode={searchCode}
            setSearchCode={setSearchCode}
            getClipboard={getClipboard}
            loading={loading}
            error={error}
          />
          <RecentClipboard
            recent={history[0]}
            setSearchCode={setSearchCode}
            getClipboard={getClipboard}
          />
        </section>

      </section>

      <section className="history-section">
        <History
          history={history}
          copyHistoryClipboard={copyHistoryClipboard}
        />
      </section>

    </main>
  </>
);
}
export default App;