/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface IChatBot {
  answer: any;
  index: number;
}

const Chatbot: React.FC<IChatBot> = ({ answer, index }) => {
  const parseAndCleanAnswer = (input: any): string[] => {
    if (typeof input === "object") {
      return Object.entries(input).map(([key, value]) => `${key}. ${value}`);
    }

    if (typeof input === "string") {
      return input
        ?.replace(/[{}"]/g, "")
        .split(",")
        .map((item) => item?.trim())
        .filter((item) => item);
    }

    return [];
  };

  let elements: string[];

  if (Array.isArray(answer)) {
    if (answer.length === 1) {
      elements = answer;
    } else {
      const combinedString = answer.join(" ").trim();
      elements = combinedString.split(" ");
    }
  } else if (typeof answer === "object" && answer !== null) {
    if (answer.answer && typeof answer.answer === "object") {
      elements = parseAndCleanAnswer(answer.answer);
    } else {
      elements = parseAndCleanAnswer(answer);
    }
  } else if (typeof answer === "number") {
    elements = [answer.toString()];
  } else if (typeof answer === "string") {
    elements = parseAndCleanAnswer(answer);
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
    const preservedElement = element.replace(/(\$\$[\s\S]*?\$\$)/g, (match) =>
      match.replace(/\n/g, "LATEXBREAK")
    );
    const parts = preservedElement.split(/\n\n|\n/);

    return parts.map((part, index) => {
      const restoredPart = part.replace(/LATEXBREAK/g, "\n");
      if (index < parts.length - 1) {
        return (
          <React.Fragment key={`${currentIndex}-${index}`}>
            {renderText(restoredPart)}
            <br />
            {index < parts.length - 2 && <br />}
          </React.Fragment>
        );
      }
      return renderText(restoredPart);
    });
  };
  const processLatex = (latex: string): string => {
    latex = latex.replace(/\\(\[|\])/g, "$1");
    latex = latex.replace(/^\$\$|\$\$$/g, "");

    if (
      latex.includes("\\begin{array}") &&
      latex.includes("\\enclose{longdiv}")
    ) {
      const divisionMatch = latex.match(/\\enclose{longdiv}{(\d+)}/) || [];
      const quotientMatch = latex.match(/(\d+)\s*\\phantom/) || [];

      if (divisionMatch[1] && quotientMatch[1]) {
        return `${quotientMatch[1]} \\div ${divisionMatch[1]}`;
      }
    }

    if (latex.includes("\\begin{array}")) {
      return latex
        .replace(/\\require{[^}]*}/g, "")
        .replace(/\\phantom{[^}]*}/g, "")
        .replace(/\\enclose{[^}]*}{[^}]*}/g, "")
        .replace(/\\kern-[^\\]*/g, "")
        .replace(/\\\\[-\d.pt]*/g, " ")
        .replace(/\\underline{[^}]*}/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (latex.includes("\\begin{aligned}")) {
      const alignedMatch = latex.match(
        /\\begin{aligned}([\s\S]*?)\\end{aligned}/
      );
      if (alignedMatch) {
        return alignedMatch[1]
          .replace(/&=/g, "=")
          .replace(/&/g, "")
          .replace(/\\\\/g, ",")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }

    return latex
      .replace(/\\boxed{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)}/, "$1")
      .trim();
  };
  const renderText = (text: string): JSX.Element => {
    if (text.includes("$") || text.includes("\\[")) {
      const displayMathRegex =
        /(\$\$.*?\\begin{aligned}[\s\S]*?\\end{aligned}.*?\$\$|\$\$[\s\S]*?\$\$|\\+\[[\s\S]*?\\+\]|\\begin{array}[\s\S]*?\\end{array})/g;
      const parts = text.split(displayMathRegex);

      return (
        <span key={currentIndex}>
          {parts.map((part, idx) => {
            if (part.startsWith("\\[")) {
              try {
                const latex = processLatex(part);
                return <InlineMath key={idx} math={latex} />;
              } catch (error) {
                console.error("LaTeX parsing error:", error);
                return part;
              }
            }

            if (part.startsWith("$$")) {
              try {
                const latex = processLatex(part);
                return <InlineMath key={idx} math={latex} />;
              } catch (error) {
                console.error("LaTeX parsing error:", error);
                return part;
              }
            } else if (part.includes("$")) {
              const inlineParts = part.split(/(\$.*?\$)/g);
              return (
                <React.Fragment key={idx}>
                  {inlineParts.map((inlinePart, inlineIdx) => {
                    if (
                      inlinePart.startsWith("$") &&
                      inlinePart.endsWith("$")
                    ) {
                      try {
                        const unboxedLatex = processLatex(
                          inlinePart.slice(1, -1)
                        );
                        return (
                          <InlineMath key={inlineIdx} math={unboxedLatex} />
                        );
                      } catch (error) {
                        console.error("LaTeX parsing error:", error);
                        return inlinePart;
                      }
                    }
                    return processNonLatexText(inlinePart, inlineIdx);
                  })}
                </React.Fragment>
              );
            }
            return processNonLatexText(part, idx);
          })}
        </span>
      );
    }

    return processNonLatexText(text, currentIndex);
  };
  const processNonLatexText = (text: string, idx: number): JSX.Element => {
    // console.log({ text });
    text = text
      .replace(/\t\*/g, "\n    ")
      .replace(/\n {4}\*/g, "\n    •")
      .replace(/\n\*/g, "\n•")
      .replace(/\n\n\*/g, "\n\n•")
      .replace(/^\*/g, "•");
    const parts = [];
    let lastIndex = 0;

    const combinedRegex = /(##[^#\n]*|\*\*(?:[^*]|\*(?!\*))*\*\*)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text
          .slice(lastIndex, match.index)
          .replace(/(\d+)\s*\*\s*(\d+)/g, "$1 ⋆ $2")
          .replace(/\s\*\s/g, " ⋆ ")
          .replace(/(?<![*])\*(?![*])/g, "⋆")
          .replace(/`{1,3}/g, "");
        parts.push(<span key={`${idx}-${lastIndex}`}>{beforeText}</span>);
      }

      const content = match[0];
      if (content.startsWith("##")) {
        const headerContent = content.replace(/^##\s*/, "").trim();
        parts.push(
          <strong key={`${idx}-${match.index}`}>{headerContent} </strong>
        );
      } else {
        const boldContent = content.slice(2, -2).replace(/`{1,3}/g, "");
        parts.push(
          <strong key={`${idx}-${match.index}`}>{boldContent} </strong>
        );
      }
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
