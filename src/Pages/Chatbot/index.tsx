/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface IChatBot {
    answer: any;
    index: number;
}

const Chatbot: React.FC<IChatBot> = ({ answer, index }) => {
   
    const parseAndCleanAnswer = (input: string): string[] => {
        // Remove leading/trailing curly braces and quotes, and split by commas
        return input?.replace(/[{}"]/g, '').split(',').map(item => item?.trim()).filter(item => item);
    };

    let combinedString = '';
    if (Array.isArray(answer)) {
        combinedString = answer?.join(' ').trim();
    } else if (typeof answer === 'string') {
        const parsedAnswer = parseAndCleanAnswer(answer);
        combinedString = parsedAnswer?.join(' ').trim();
    } else {
        //empty
    }

    // Split the combined string into an array of words
    const elements = combinedString?.split(' ');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState<JSX.Element[]>([]);

    useEffect(() => {

        if (currentIndex < elements?.length) {
            const timer = setTimeout(() => {
                // const newElement = <span key={currentIndex}>{elements[currentIndex]} </span>;
                const newElement = parseElement(elements[currentIndex]);
                setDisplayText((prev: any) => [...prev, newElement]);
                setCurrentIndex(currentIndex + 1);
            }, 100); // Adjust the timeout as needed

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [currentIndex, elements]);

    const lastElementRef = useRef<HTMLSpanElement>(null);

    const style: CSSProperties = {
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        fontSize: "15px",
        overflowY: 'auto'

    };
    const parseElement = (element: string): JSX.Element[] => {
        const parts = element.split(/\n\n|\n/); // Split by \n\n or \n
        return parts.map((part, index) => {
            if (index < parts.length - 1) {
                // Add a line break after each part except the last one
                return (
                    <React.Fragment key={`${currentIndex}-${index}`}>
                        {renderText(part)}
                        <br />
                        {index < parts.length - 2 && <br />} {/* Add an extra <br /> for \n\n */}
                    </React.Fragment>
                );
            }
            return renderText(part); // Last part doesn't need a line break
        });
    };

    const renderText = (text: string): JSX.Element => {
        // const cleanedText = text.replace(/`{1,3}/g, '').replace(/\*{2}$/g, '');
        const cleanedText = text.replace(/`{1,3}/g, '').replace(/\*/g, '');

        // Check for bold formatting and render accordingly
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
                <span key={index} ref={index === displayText.length - 1 ? lastElementRef : null}>
                    {element}
                </span>
            ))}
        </div>


    );
};

export default Chatbot;
