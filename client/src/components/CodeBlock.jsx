import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:3001");

const CodeBlock = () => {
  const [code, setCode] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  let { codeBlockId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3001/api/codeblocks/${codeBlockId}`)
      .then((response) => response.json())
      .then((data) => {
        setCode(data.code);
        setIsMentor(false);
        data.accessed = true;
      });

    socket.on("code_update", handleSocketUpdate);
  }, []);

  const handleSocketUpdate = (updatedCode) => {
    setCode(updatedCode);
  };

  const handleChange = (e) => {
    const updatedCode = e.target.value;
    setCode(updatedCode);
    socket.emit("code_update", updatedCode);
  };

  return (
    <textarea
      value={code}
      onChange={handleChange}
      readOnly={isMentor}
      className="code-editor"
    />
  );
};

export default CodeBlock;
