import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const CodeBlock = () => {
  const [code, setCode] = useState("");
  const [solution, setSolution] = useState("");
  const [isMentor, setIsMentor] = useState(false);
  const [showSmile, setShowSmile] = useState(false);
  const { codeBlockId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("");

    socketRef.current.emit("joinCodeblock", codeBlockId, (response) => {
      if (response.status === "joined") {
        fetch(`https://code-mentor.onrender.com/api/codeblocks/${codeBlockId}`)
          .then((response) => response.json())
          .then((data) => {
            setCode(data.code);
            setSolution(data.solution);
            setIsMentor(!data.accessed);
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    });

    socketRef.current.on("codeUpdate", (updatedCode) => {
      setCode(updatedCode);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [codeBlockId]);

  const handleChange = (e) => {
    const updatedCode = e.target.value;
    setCode(updatedCode);
    socketRef.current.emit("codeUpdate", updatedCode);
  };

  useEffect(() => {
    if (code && code === solution) setShowSmile(true);
    else setShowSmile(false);
  }, [code]);

  return (
    <>
      <textarea
        value={code}
        style={{ width: "500px", height: "200px" }}
        onChange={handleChange}
        readOnly={isMentor}
        className="code-editor"
      />
      {showSmile && <div>😊</div>}
    </>
  );
};

export default CodeBlock;
