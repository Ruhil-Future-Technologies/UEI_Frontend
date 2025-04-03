import React from "react";
import { useEffect } from "react";
import "katex/dist/katex.min.css";

declare global {
  interface Window {
    MathJax?: {
      typeset: () => void;
    };
  }
}


// Define props type
interface ChatTableProps {
  tableCode: string;
}

export const ChatTable: React.FC<ChatTableProps> = ({ tableCode }) => {
  useEffect(() => {
    if (window?.MathJax) {
      window?.MathJax.typeset();
    }
  }, [tableCode]);

  return (
    <div
      className="diagram-container"
      style={{
        width: "100%",
        height: "600px",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      dangerouslySetInnerHTML={{ __html: tableCode }}
    />
  );
};
