import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/codeblocks")
      .then((response) => response.json())
      .then((result) => {
        setCodeBlocks(result);
      });
  }, []);

  return (
    <div>
      <h1>Choose code block</h1>
      <ul>
        {codeBlocks.map((block) => (
          <li key={block._id}>
            <Link to={`/codeblock/${block._id}`}>{block.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
