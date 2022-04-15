import { useState, useEffect, VoidFunctionComponent } from 'react';
import axios, { AxiosResponse } from 'axios';
import logo from './logo.svg';
import './App.css';

const App: VoidFunctionComponent = () => {
  const [data, setData] = useState('');
  const [input, setInput] = useState('https://');

  useEffect(() => {
    (async () => {
      type Message = { text: string };
      const messageResponse: AxiosResponse<Message> = await axios.post(
        `/api/message`,
        { name: 'Sir' },
      );
      const { text } = messageResponse.data;
      setData(text);
    })()
      .then((_) => undefined)
      .catch((_) => undefined);
  });

  const onInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    setInput(event.target.value);
  };

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
        <p>Input URL</p>
        <input value={input} onInput={onInput} />
        <p>Output URL</p>
        <input value={input} />
      </header>
    </div>
  );
};

export default App;
