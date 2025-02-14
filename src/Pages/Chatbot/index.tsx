/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface IChatBot {
  answer: any;
  index: number;
}

const Chatbot: React.FC<IChatBot> = ({ answer, index }) => {
  const hasLatex = Array.isArray(answer)
    ? answer.some(
        (text) =>
          typeof text === 'string' &&
          (text.includes('$') ||
            text.includes('\\[') ||
            text.includes('\\(') ||
            text.includes('\\)') ||
            text.includes('$\\boxed') ||
            text.match(/\$[^$\n]+?\$/g)),
      )
    : typeof answer === 'string' &&
      (answer.includes('$') ||
        answer.includes('\\[') ||
        answer.includes('\\(') ||
        answer.includes('\\)') ||
        answer.includes('$\\boxed') ||
        answer.match(/\$[^$\n]+?\$/g));

  const parseAndCleanAnswer = (input: any): string[] => {
    if (typeof input === 'object') {
      return Object.entries(input).map(([key, value]) => `${key}. ${value}`);
    }

    if (typeof input === 'string') {
      if (input.includes('"') || input.startsWith('{')) {
        return input
          ?.replace(/[{}"]/g, '')
          .split(',')
          .map((item) => item?.trim())
          .filter((item) => item);
      }
      return [input.trim()];
    }
    return [];
  };

  let elements: string[];

  if (Array.isArray(answer)) {
    if (answer.length === 1) {
      elements = answer;
    } else {
      const combinedString = answer.join(' ').trim();
      elements = combinedString.split(' ');
    }
  } else if (typeof answer === 'object' && answer !== null) {
    if (answer.answer && typeof answer.answer === 'object') {
      elements = parseAndCleanAnswer(answer.answer);
    } else {
      elements = parseAndCleanAnswer(answer);
    }
  } else if (typeof answer === 'number') {
    elements = [answer.toString()];
  } else if (typeof answer === 'string') {
    elements = parseAndCleanAnswer(answer);
  } else {
    elements = [];
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (currentIndex < elements?.length) {
      const newElement = parseElement(elements[currentIndex]);
      setDisplayText((prev: any) => [...prev, newElement]);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, elements]);

  const lastElementRef = useRef<HTMLSpanElement>(null);

  const style: CSSProperties = {
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '15px',
    overflowY: 'auto',
    overflow: 'hidden',
  };

  const parseElement = (element: string): JSX.Element[] => {
    const preservedElement = element
      .replace(/(\n\\+\[[\s\S]*?\\+\]\n)/g, (match) =>
        match.replace(/\n/g, 'LATEXBREAK'),
      )
      .replace(/(\$\$[\s\S]*?\$\$)/g, (match) =>
        match.replace(/\n/g, 'LATEXBREAK'),
      );

    const sections = preservedElement.split(/\n\n+/);

    return sections.map((section, sectionIndex) => {
      const lines = section
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      return (
        <React.Fragment key={`section-${sectionIndex}`}>
          {lines.map((line, lineIndex) => {
            const restoredLine = line.replace(/LATEXBREAK/g, '\n').trim();
            const isHeader = restoredLine.startsWith('##');

            return (
              <React.Fragment key={`line-${lineIndex}`}>
                {renderText(restoredLine)}
                {(lineIndex < lines.length - 1 || isHeader) && <br />}
                {isHeader && <br />}
              </React.Fragment>
            );
          })}
          {sectionIndex < sections.length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </React.Fragment>
      );
    });
  };

  const processLatex = (latex: string): string => {
    latex = latex
      .replace(/\\{2,}/g, '\\')
      .replace(/^\n*\\+\[/, '')
      .replace(/\\+\]\n*$/, '')
      .trim();
    latex = latex.replace(/\\round\(([^)]+)\)/g, '\\lceil$1\\rceil');
    latex = latex.replace(/^\\\[|\\\]$/g, '');

    if (latex.includes('\\times') || latex.includes('\\div')) {
      return latex.trim();
    }

    if (latex.startsWith('\\(') && latex.endsWith('\\)')) {
      latex = latex.slice(2, -2);
    }
    if (latex.match(/\\boxed{[a-zA-Z\s-]+}$/)) {
      return latex.replace(/\\boxed{([^}]+)}/, '$1');
    }
    if (
      latex.match(/\\boxed.*/) &&
      (latex.startsWith('\\[') || latex.endsWith('\\]'))
    ) {
      return latex.replace(/\\boxed\{(.*)\}/, '$1');
    }

    if (latex.match(/\\boxed.*\\frac/)) {
      return latex.replace(/\\boxed\{(.*)\}/, '$1');
    }
    latex = latex.replace(/\\(\[|\])/g, '$1');
    latex = latex.replace(/^\$\$|\$\$$/g, '');

    const noneMatch = latex.match(/\\boxed(?:\{(None)\}|(None))/);
    if (noneMatch) {
      return '';
    }

    if (
      latex.includes('\\begin{array}') &&
      latex.includes('\\enclose{longdiv}')
    ) {
      const divisionMatch = latex.match(/\\enclose{longdiv}{(\d+)}/) || [];
      const quotientMatch = latex.match(/(\d+)\s*\\phantom/) || [];

      if (divisionMatch[1] && quotientMatch[1]) {
        return `${quotientMatch[1]} \\div ${divisionMatch[1]}`;
      }
    }
    if (latex.includes('\\begin{array}')) {
      return latex
        .replace(/\\begin{array}{[^}]*}/, '\\begin{array}{r}')
        .replace(/\\\\/g, '\\\\ ')
        .trim();
    }

    if (latex.includes('\\begin{aligned}')) {
      const alignedMatch = latex.match(
        /\\begin{aligned}([\s\S]*?)\\end{aligned}/,
      );
      if (alignedMatch) {
        return alignedMatch[1]
          .replace(/&=/g, '=')
          .replace(/&/g, '')
          .replace(/\\\\/g, ',')
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    // let cleanedLatex = latex
    //   .split('')
    //   .filter((c) => c.charCodeAt(0) !== 8)
    //   .join('');

    // if (latex.includes('\b')) {
    //   cleanedLatex = cleanedLatex.replace('oxed', '');
    // }

    // return cleanedLatex
    //   .replace(
    //     /\\boxed(?:\{([^{}]*(?:\{[^{}]*\})*[^{}]*)\}|(\d+\.?\d*))/g,
    //     '$1$2',
    //   )
    //   .replace(/\\$/, '')
    //   .trim();

    return latex.replace(/\\$/, '').trim();
  };

  const renderText = (text: string): JSX.Element => {
    if (text.match(/^\[(.*)\]$/)) {
      const innerContent = text.slice(1, -1).trim().replace(/\t/, '\\t');

      return <InlineMath key={currentIndex} math={innerContent} />;
    }

    text = text
      .replace(/\(([^()]*)\)/g, (match, inner) => {
        if (inner.match(/^[A-Z]\s*=\s*\\frac/)) {
          return '($' + inner + '$)';
        }

        if (inner.includes('\\frac')) {
          if (inner.match(/\\frac{[^}]+}{[^}]+},/)) {
            return match;
          } else {
            return (
              '(' + inner.replace(/(\\frac{[^}]+}{[^}]+})/g, '$$$1$') + ')'
            );
          }
        }

        return match;
      })
      .replace(/\$(\d+(?:\.\d+)?)\$(?!\s*[a-zA-Z{}\\])/g, '$1');

    if (text.includes('$\\boxed{None}$')) {
      return <></>;
    }
    const displayMathRegex =
      /((?:\n?\\[[\s\S]*?\\]\n?)|(?:\$\$[\s\S]*?\$\$)|(?:\\\([^)]*\\\))|(?:\$[^$\n]*?\\boxed\{[^}]*\}[^$\n]*?\$)|(?:\$(?:\d+\.\d+|[^$\n,.])+?\$))/gs;
    if (text.includes('$') || text.includes('\\[') || text.includes('\\(')) {
      const parts = text
        .split(displayMathRegex)
        .filter(
          (part, index, arr) => !(index === arr.length - 1 && part === ''),
        );
      return (
        <span key={currentIndex}>
          {parts.map((part, idx) => {
            if (
              part?.match(/^\\\([^)]+\\\)(?:\s+[^\\]+)?(?:\n\\[[^\]]+\\])?$/)
            ) {
              try {
                let latex = part.replace(/^\\\(|\\\)$/g, '').trim();

                latex = latex.replace(/\$([^$]+)\$/g, '$1');

                latex = latex
                  .replace(/·/g, '\\cdot{}')
                  .replace(/\\text{([^}]+)}/g, (_, content) => {
                    const parts = content.split('·');
                    return parts
                      .map((part: any) => `\\mathrm{${part.trim()}}`)
                      .join('\\cdot{}');
                  })
                  .trim();

                return <InlineMath key={idx} math={latex} />;
              } catch (error) {
                console.error('LaTeX parsing error:', error);
                return part;
              }
            }

            if (
              (part?.match(/^\n?\\+\[[\s\S]*?\\+\]\n?$/) &&
                !part?.match(/\\\\[\\(\\[][\s\S]*?\\\\[\\)\\]]/)) ||
              part?.match(/\\\\[\\(\\[][\s\S]*?\\\\[\\)\\]]/)
            ) {
              try {
                let equations;

                if (
                  part?.match(/^\n?\\+\[[\s\S]*?\\+\]\n?$/) &&
                  !part?.match(/\\\\[\\(\\[][\s\S]*?\\\\[\\)\\]]/)
                ) {
                  equations = part
                    .split(/\\+\]/)
                    .map((eq) => {
                      return eq
                        .replace(/^[\n\s]*\\+\[/, '')
                        .replace(/[\n\s]*$/, '')
                        .replace(/\\round\(([^)]+)\)/g, '\\lceil$1\\rceil')
                        .trim();
                    })
                    .filter(Boolean);
                } else if (part?.match(/\\\\[\\(\\[][\s\S]*?\\\\[\\)\\]]/)) {
                  equations = part
                    .split(/\\\\[\\)\\]]/)
                    .map((eq) => {
                      return eq
                        .replace(/^[\n\s]*\\\\[\\(\\[]/, '')
                        .replace(/[\n\s]*$/, '')
                        .replace(/\\round\(([^)]+)\)/g, '\\lceil$1\\rceil')
                        .trim();
                    })
                    .filter(Boolean);
                }

                const content = part.slice(1, -1);
                if (content.includes('\\boxed{')) {
                  const boxedMatch = content.match(/\\boxed{([^]*)}/);
                  if (boxedMatch) {
                    const innerContent = boxedMatch[1]
                      .replace(/\\pi/g, '\\pi ')
                      .replace(/\^{(\d+)}/g, '^{$1}')
                      .replace(/=/g, ' = ')
                      .replace(/\s+/g, ' ')
                      .trim();

                    return (
                      <>
                        <InlineMath key={idx} math={innerContent} /> <br />
                      </>
                    );
                  }
                }
                return (
                  <>
                    {equations?.map((equation, eqIdx) => {
                      if (!equation.trim()) return null;

                      return (
                        <React.Fragment key={`${idx}-${eqIdx}`}>
                          {eqIdx === 0 && <br />}
                          <InlineMath math={equation} />
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </>
                );
              } catch (error) {
                console.error('LaTeX parsing error:', error);
                return part;
              }
            }
            if (part?.startsWith('$$')) {
              try {
                const latex = processLatex(part);
                return <InlineMath key={idx} math={latex} />;
              } catch (error) {
                console.error('LaTeX parsing error:', error);
                return part;
              }
            }

            if (part?.startsWith('$') && part?.endsWith('$')) {
              const content = part.slice(1, -1);
              // if (content.includes('\\boxed{')) {
              //   const boxedMatch = content.match(/\\boxed{([^]*)}/);
              //   if (boxedMatch) {
              //     const innerContent = boxedMatch[1];

              //     if (/^[a-zA-Z\s-]+$/.test(innerContent)) {
              //       return (
              //         <span
              //           key={idx}
              //           style={{
              //             fontWeight: '500',
              //           }}
              //         >
              //           {innerContent}
              //         </span>
              //       );
              //     }
              //     const processedContent = innerContent
              //       .replace(/\\pi/g, '\\pi ')
              //       .replace(/\^{(\d+)}/g, '^{$1}')
              //       .replace(/=/g, ' = ')
              //       .replace(/\s+/g, ' ')
              //       .trim();

              //     return <InlineMath key={idx} math={processedContent} />;
              //   }
              // }

              const latex = processLatex(content);

              return <InlineMath key={idx} math={latex} />;
            }
            return part ? processNonLatexText(part, idx) : null;
          })}
        </span>
      );
    }

    return processNonLatexText(text, currentIndex);
  };
  const processNonLatexText = (text: string, idx: number): JSX.Element => {
    text = text
      .replace(/\\/g, '')
      .replace(/\((\d+)\)\s*/g, (_, num) => `\n(${num}) `);

    const parts = [];
    let lastIndex = 0;
    const combinedRegex = /(##[^#\n]*|\*\*[^*\n]+(?:\*\*)?|https?:\/\/[^\s]+)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text
          .slice(lastIndex, match.index)
          .replace(/\t\*/g, '\n    ')
          .replace(/\n {4}\*/g, '\n    •')
          .replace(/\n\*/g, '\n•')
          .replace(/\n\n\*/g, '\n\n•')
          .replace(/^\*/g, '•')
          .replace(/(\d+)\s*\*\s*(\d+)/g, '$1 ⋆ $2')
          .replace(/\s\*\s/g, ' ⋆ ')
          .replace(/(?<![*])\*(?![*])/g, '⋆')
          .replace(/`{1,3}/g, '')
          .split('\n')
          .map((line, i) => (
            <React.Fragment key={`line-${i}`}>
              {line}
              {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ));
        parts.push(<span key={`${idx}-${lastIndex}`}>{beforeText}</span>);
      }

      const content = match[0];

      if (content.startsWith('##')) {
        const headerContent = content.replace(/^##\s*/, '').trim();
        parts.push(
          <strong key={`${idx}-${match.index}`}>{headerContent} </strong>,
        );
      } else if (content.startsWith('http')) {
        parts.push(
          <a
            key={`${idx}-${match.index}`}
            href={content}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>,
        );
      } else {
        const isNumberedBold =
          /^\*\*\d+\./.test(content) && !content.endsWith(':**');

        const boldContent = content
          .replace(/^\*\*|\*\*$/g, '')
          .replace(/`{1,3}/g, '');

        parts.push(
          <React.Fragment key={`${idx}-${match.index}`}>
            {isNumberedBold && (
              <>
                <br />
                <br />
              </>
            )}
            <strong>{boldContent}</strong>
          </React.Fragment>,
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text
        .slice(lastIndex)
        .replace(/\t\*/g, '\n    ')
        .replace(/\n {4}\*/g, '\n    •')
        .replace(/\n\*/g, '\n•')
        .replace(/\n\n\*/g, '\n\n•')
        .replace(/^\*/g, '•')
        .replace(/(\d+)\s*\*\s*(\d+)/g, '$1 ⋆ $2')
        .replace(/\s\*\s/g, ' ⋆ ')
        .replace(/(?<![*])\*(?![*])/g, '⋆')
        .replace(/`{1,3}/g, '');

      const paragraphs = remainingText.split(/\d+\.\s+\*\*/);

      const formattedParagraphs = paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split(/(?<=\.)\s+(?=[A-Z])/);

        const processedLines = lines.map((line, lineIndex) => {
          const boldMatch = line.match(/^([^*]+)\*\*:\s*(.*)/);

          if (boldMatch) {
            return (
              <React.Fragment key={lineIndex}>
                <strong>{`${pIndex}. ${boldMatch[1]}:`}</strong>
                {!hasLatex && <br />}
                {boldMatch[2]}
              </React.Fragment>
            );
          }
          return line;
        });

        return (
          <React.Fragment key={`para-${pIndex}`}>
            {processedLines.map((line, i) => (
              <React.Fragment key={`line-${i}`}>
                {line} {'  '}
              </React.Fragment>
            ))}
            {!hasLatex && <br />}
          </React.Fragment>
        );
      });

      parts.push(
        <span key={`${idx}-${lastIndex}`}>{formattedParagraphs}</span>,
      );
    }

    return parts.length ? (
      <span key={idx}>{parts}</span>
    ) : (
      <span key={idx}>{text}</span>
    );
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
