import React, { useContext } from "react";
import { AiOutlineMail, AiFillGithub } from "react-icons/ai";

function Footer() {
  return (
    <footer>
      <p>PocketSave 2023 Contact: </p>
      <a href="mailto:markmak212@gmail.com" target="_blank" rel="noreferrer">
        <AiOutlineMail className="f-icon" />
      </a>
      <a href="https://github.com/markmak" target="_blank" rel="noreferrer">
        <AiFillGithub className="f-icon" />
      </a>
    </footer>
  );
}

export default Footer;
