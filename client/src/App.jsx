import History from "./components/History";
import socket from "./socket/socket";
import ReceiveClipboard from "./components/ReceiveClipboard";
import SendClipboard from "./components/SendClipboard";
import Hero from "./components/Hero";
import Header from "./components/Header";
import "./App.css";
import { useState, useEffect } from "react";

function App(){
  const [content,setContent] = useState("");
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
  const [page, setPage] = useState("home");
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
  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
  }
  const copyHistoryClipboard = async (content) => {
    await navigator.clipboard.writeText(content);
    alert("Clipboard copied!");
  };
  const copyClipboard = async () => {
    await navigator.clipboard.writeText(retrievedContent);
    setCopied(true);
    await fetch(`${import.meta.env.VITE_API_URL}/clip/${retrievedId}`, {
      method: "DELETE"
    });

    await getHistory();

    resetSender();

    setRetrievedContent("");
    setRetrievedId("");
    setSearchCode("");
  }
  const clearClipboard = () => {
    setRetrievedContent("");
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

  const getClipboard = async () => {
    try{
      setLoading(true);
      setError("");
      setRetrievedContent("");
      
const response = await fetch(`${import.meta.env.VITE_API_URL}/clip/${searchCode}`);
      
      if(!response.ok){
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setRetrievedContent(data.content);
      setRetrievedId(searchCode);
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




  return (
  <>
    <Header />

    <div className="container">

      {page === "home" && (
        <>
          <Hero setPage={setPage} />
          <History
            history={history}
            copyHistoryClipboard={copyHistoryClipboard}
          />
        </>
      )}
      {page === "send" && (
        <SendClipboard
          setPage={setPage}
          content={content}
          setContent={setContent}
          createClipboard={createClipboard}
          creating={creating}
          code={code}
          timeLeft={timeLeft}
          copied={copied}
          copyCode={copyCode}
        />
      )}
      {page === "receive" && (
        <ReceiveClipboard
          setPage={setPage}
          retrievedContent={retrievedContent}
          copyClipboard={copyClipboard}
          clearClipboard={clearClipboard}
          searchCode={searchCode}
          setSearchCode={setSearchCode}
          getClipboard={getClipboard}
          loading={loading}
          error={error}
        />
      )}     
  
    </div>
  </>
);
}
export default App;