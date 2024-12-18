/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface IChatBot {
  answer: any;
  index: number;
}

const Chatbot: React.FC<IChatBot> = ({ answer, index }) => {
  const parseAndCleanAnswer = (input: string): string[] => {
    return input
      ?.replace(/[{}"]/g, "")
      .split(",")
      .map((item) => item?.trim())
      .filter((item) => item);
  };

  let elements: string[];

  if (Array.isArray(answer)) {
    if (answer.length === 1) {
      elements = answer;
    } else {
      const combinedString = answer.join(" ").trim();
      elements = combinedString.split(" ");
    }
  } else if (typeof answer === "number") {
    elements = [answer.toString()];
  } else if (typeof answer === "string") {
    const parsedAnswer = parseAndCleanAnswer(answer);
    elements = parsedAnswer;
  } else {
    elements = [];
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (currentIndex < elements?.length) {
      const timer = setTimeout(() => {
        const newElement = parseElement(elements[currentIndex]);
        setDisplayText((prev: any) => [...prev, newElement]);
        setCurrentIndex(currentIndex + 1);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, elements]);

  const lastElementRef = useRef<HTMLSpanElement>(null);

  const style: CSSProperties = {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    fontSize: "15px",
    overflowY: "auto",
  };

  const parseElement = (element: string): JSX.Element[] => {
    const parts = element.split(/\n\n|\n/);
    return parts.map((part, index) => {
      if (index < parts.length - 1) {
        return (
          <React.Fragment key={`${currentIndex}-${index}`}>
            {renderText(part)}
            <br />
            {index < parts.length - 2 && <br />}
          </React.Fragment>
        );
      }
      return renderText(part);
    });
  };

  const renderText = (text: string): JSX.Element => {
    if (text.includes("$")) {
      const parts = text.split(/(\$.*?\$)/g);
      return (
        <span key={currentIndex}>
          {parts.map((part, idx) => {
            if (part.startsWith("$") && part.endsWith("$")) {
              try {
                const latex = part.slice(1, -1);
                return <InlineMath key={idx} math={latex} />;
              } catch (error) {
                console.error("LaTeX parsing error:", error);
                return part;
              }
            }
            return processNonLatexText(part, idx);
          })}{" "}
        </span>
      );
    }

    return processNonLatexText(text, currentIndex);
  };

  const processNonLatexText = (text: string, idx: number): JSX.Element => {
    console.log({ text });
    text = text
      .replace(/\t\*/g, "\n    ")
      .replace(/\n {4}\*/g, "\n    •")
      .replace(/\n\*/g, "\n•")
      .replace(/\n\n\*/g, "\n\n•")
      .replace(/^\*/g, "•");
    const parts = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text
          .slice(lastIndex, match.index)
          .replace(/(\d+)\s*\*\s*(\d+)/g, "$1 ⋆ $2")
          .replace(/\s\*\s/g, " ⋆ ")
          .replace(/(?<![*])\*(?![*])/g, "⋆")
          .replace(/`{1,3}/g, "");
        parts.push(<span key={`${idx}-${lastIndex}`}>{beforeText}</span>);
      }
      const cleanedBoldContent = match[1].replace(/`{1,3}/g, "");
      parts.push(
        <strong key={`${idx}-${match.index}`}>{cleanedBoldContent} </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text
        .slice(lastIndex)
        .replace(/(\d+)\s*\*\s*(\d+)/g, "$1 ⋆ $2")
        .replace(/\s\*\s/g, " ⋆ ")
        .replace(/(?<![*])\*(?![*])/g, "⋆")
        .replace(/`{1,3}/g, "");
      parts.push(<span key={`${idx}-${lastIndex}`}>{remainingText}</span>);
    }

    if (parts.length === 0) {
      const cleanedText = text
        .replace(/(\d+)\s*\*\s*(\d+)/g, "$1 ⋆ $2")
        .replace(/\s\*\s/g, " ⋆ ")
        .replace(/(?<![*])\*(?![*])/g, "⋆")
        .replace(/`{1,3}/g, "");

      return <span key={idx}>{cleanedText}</span>;
    }

    return <span key={idx}>{parts}</span>;
  };
  return (
    <div id={`answer-${index}`} style={style}>
      {displayText.map((element, index) => (
        <span
          key={index}
          ref={index === displayText.length - 1 ? lastElementRef : null}
        >
          {element}
        </span>
      ))}
    </div>
  );
};

export default Chatbot;
