import { useState } from "react";
import "./App.css";
import Lobby from "./components/Lobby";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodeBlock from "./components/CodeBlock";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />}></Route>
        <Route path="codeblock/:codeBlockId" element={<CodeBlock />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
