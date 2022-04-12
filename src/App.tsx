import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios, { AxiosResponse } from "axios";

function App() {
  const [data, setData] = useState("");
  useEffect(() => {
    (async function () {
      type Message = { text: string };
      const messageResponse: AxiosResponse<Message> = await axios.post(
        `/api/message`,
        { name: "Sir" }
      );
      const { text } = messageResponse.data;
      setData(text);
    })();
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{data}</div>
      </header>
    </div>
  );
}

export default App;
