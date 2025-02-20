import React from "react";

const NormalBTN = ({ text, style, onClick }) => {
  return (
    <button
      className={`${style} p-2 rounded-xl cursor-pointer text-white`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default NormalBTN;
