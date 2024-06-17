import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetch("https://code-mentor.onrender.com/api/codeblocks")
      .then((response) => response.json())
      .then((result) => {
        setCodeBlocks(result);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="title">Choose code block:</h1>
      <ul className="codeBlockList">
        {codeBlocks.map((block) => (
          <li className="codeBlockItem" key={block._id}>
            <Link className="styledLink" to={`/codeblock/${block._id}`}>
              {block.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
