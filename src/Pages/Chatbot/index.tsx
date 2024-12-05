/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useRef, useState } from "react";

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
    const cleanedText = text.replace(/`{1,3}/g, "").replace(/\*/g, "");

    if (cleanedText.startsWith("**") && cleanedText.endsWith("**")) {
      const content = cleanedText.slice(2, -2);
      return <strong key={currentIndex}>{content} </strong>;
    } else {
      return <span key={currentIndex}>{cleanedText} </span>;
    }
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
