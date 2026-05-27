import React, { useEffect } from "react";

const Message = ({ type, message, clearMessage }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  return (
    <p
      style={{
        color: type === "error" ? "red" : "green",
        marginTop: "10px",
        fontSize: "14px",
      }}
    >
      {message}
    </p>
  );
};

export default Message;