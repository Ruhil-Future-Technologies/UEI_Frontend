import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface IChatBot {
    answer: any;
    index: number;
}

const Chatbot: React.FC<IChatBot> = ({ answer, index }) => {
    // const elements =  [
    //     "",
    //     "To",
    //     " set",
    //     " up",
    //     " a",
    //     " basic",
    //     " Flask",
    //     " project",
    //     ",",
    //     " follow",
    //     " these",
    //     " steps",
    //     ":\n\n",
    //     "1",
    //     ".",
    //     " Install",
    //     " Flask",
    //     ":\n",
    //     "  ",
    //     " First",
    //     ",",
    //     " make",
    //     " sure",
    //     " you",
    //     " have",
    //     " Python",
    //     " installed",
    //     " on",
    //     " your",
    //     " system",
    //     ".",
    //     " You",
    //     " can",
    //     " install",
    //     " Flask",
    //     " using",
    //     " pip",
    //     ",",
    //     " the",
    //     " Python",
    //     " package",
    //     " manager",
    //     ":\n",
    //     "  ",
    //     " ```\n",
    //     "  ",
    //     " pip",
    //     " install",
    //     " Flask",
    //     "\n",
    //     "  ",
    //     " ``",
    //     "`\n\n",
    //     "2",
    //     ".",
    //     " Create",
    //     " a",
    //     " new",
    //     " directory",
    //     " for",
    //     " your",
    //     " Flask",
    //     " project",
    //     " and",
    //     " navigate",
    //     " into",
    //     " it",
    //     ":\n",
    //     "  ",
    //     " ```\n",
    //     "  ",
    //     " mkdir",
    //     " my",
    //     "_fl",
    //     "ask",
    //     "_project",
    //     "\n",
    //     "  ",
    //     " cd",
    //     " my",
    //     "_fl",
    //     "ask",
    //     "_project",
    //     "\n",
    //     "  ",
    //     " ``",
    //     "`\n\n",
    //     "3",
    //     ".",
    //     " Create",
    //     " a",
    //     " virtual",
    //     " environment",
    //     " (",
    //     "optional",
    //     " but",
    //     " recommended",
    //     "):\n",
    //     "  ",
    //     " ```\n",
    //     "  ",
    //     " python",
    //     " -",
    //     "m",
    //     " v",
    //     "env",
    //     " v",
    //     "env",
    //     "\n",
    //     "  ",
    //     " source",
    //     " v",
    //     "env",
    //     "/bin",
    //     "/",
    //     "activate",
    //     "     ",
    //     " #",
    //     " for",
    //     " Mac",
    //     "/Linux",
    //     "\n",
    //     "  ",
    //     " v",
    //     "env",
    //     "\\",
    //     "Scripts",
    //     "\\",
    //     "activate",
    //     "        ",
    //     " #",
    //     " for",
    //     " Windows",
    //     "\n",
    //     "  ",
    //     " ``",
    //     "`\n\n",
    //     "4",
    //     ".",
    //     " Create",
    //     " a",
    //     " new",
    //     " Python",
    //     " file",
    //     " for",
    //     " your",
    //     " Flask",
    //     " application",
    //     ",",
    //     " for",
    //     " example",
    //     " `",
    //     "app",
    //     ".py",
    //     "`,",
    //     " and",
    //     " open",
    //     " it",
    //     " in",
    //     " your",
    //     " text",
    //     " editor",
    //     ".\n",
    //     "  ",
    //     " Add",
    //     " the",
    //     " following",
    //     " code",
    //     " to",
    //     " create",
    //     " a",
    //     " simple",
    //     " Flask",
    //     " app",
    //     ":\n",
    //     "  ",
    //     " ```",
    //     "python",
    //     "\n",
    //     "  ",
    //     " from",
    //     " flask",
    //     " import",
    //     " Flask",
    //     "\n\n",
    //     "  ",
    //     " app",
    //     " =",
    //     " Flask",
    //     "(__",
    //     "name",
    //     "__)\n\n",
    //     "  ",
    //     " @",
    //     "app",
    //     ".route",
    //     "('/')\n",
    //     "  ",
    //     " def",
    //     " hello",
    //     "():\n",
    //     "      ",
    //     " return",
    //     " '",
    //     "Hello",
    //     ",",
    //     " World",
    //     "!",
    //     "'\n\n",
    //     "  ",
    //     " if",
    //     " __",
    //     "name",
    //     "__",
    //     " ==",
    //     " '__",
    //     "main",
    //     "__':\n",
    //     "      ",
    //     " app",
    //     ".run",
    //     "()\n",
    //     "  ",
    //     " ``",
    //     "`\n\n",
    //     "5",
    //     ".",
    //     " Run",
    //     " your",
    //     " Flask",
    //     " app",
    //     ":\n",
    //     "  ",
    //     " ```\n",
    //     "  ",
    //     " python",
    //     " app",
    //     ".py",
    //     "\n",
    //     "  ",
    //     " ``",
    //     "`\n\n",
    //     "6",
    //     ".",
    //     " Open",
    //     " your",
    //     " web",
    //     " browser",
    //     " and",
    //     " go",
    //     " to",
    //     " `",
    //     "http",
    //     "://",
    //     "127",
    //     ".",
    //     "0",
    //     ".",
    //     "0",
    //     ".",
    //     "1",
    //     ":",
    //     "500",
    //     "0",
    //     "/",
    //     "`",
    //     " to",
    //     " see",
    //     " your",
    //     " Flask",
    //     " app",
    //     " running",
    //     ".\n\n",
    //     "That",
    //     "'s",
    //     " it",
    //     "!",
    //     " You",
    //     " now",
    //     " have",
    //     " a",
    //     " basic",
    //     " Flask",
    //     " project",
    //     " set",
    //     " up",
    //     ".",
    //     " You",
    //     " can",
    //     " continue",
    //     " adding",
    //     " routes",
    //     ",",
    //     " templates",
    //     ",",
    //     " and",
    //     " other",
    //     " features",
    //     " to",
    //     " build",
    //     " your",
    //     " web",
    //     " application",
    //     "."
    //   ];
    // console.log("test result",answer)

    // let elements :any = []
    // try{
    //     if(typeof answer ==='string')
    //     {
    //         elements = JSON.parse(answer)
    //     }
    //     else
    //     {
    //         elements = answer
    //     }
    // }
    // catch(e)
    // {
    //     const cleanString = answer
    //         .replace(/\\"/g, '"')   
    //         .replace(/[{}]/g, '')    
    //         .replace(/\\'/g, "'") 
    //         .replace(/(^"|"$)/g, '')
    //         .replace(/(^\\\"|\\\"$)/g, '')
    //     const stringArray = cleanString.split(',').map((item:any) => item.trim());
    //     elements = stringArray.map((item:any) => item.replace(/"/g, ''));
    // }

    // const [currentIndex, setCurrentIndex] = useState(0);
    // const [displayText, setDisplayText] = useState<JSX.Element[]>([]);

    // useEffect(() => {
    //     if (currentIndex < elements.length) {
    //         const timer = setTimeout(() => {
    //             const newElement = elements[currentIndex].split('\n').map((part:any, index:any) => (
    //                 <React.Fragment key={currentIndex + '-' + index}>
    //                     {part}
    //                     {index < elements[currentIndex].split('\n').length - 1 && <br />}
    //                 </React.Fragment>
    //             ));
    //             setDisplayText((prev) => [...prev, ...newElement]);
    //             setCurrentIndex(currentIndex + 1);
    //         }, 100); 

    //         return () => clearTimeout(timer); 
    //     }
    // }, [currentIndex, elements]);
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


    // else if (typeof answer === 'string') {
    //     combinedString = answer;
    // }

    // let combinedString = answer?.join(' ').trim();

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

    // useEffect(() => {
    //   if (lastElementRef.current) {
    //     lastElementRef.current?.scrollIntoView({ behavior: 'smooth' });
    //   }
    // }, [displayText]);

    // useEffect(() => {
    //     const objDiv = document.getElementById("ChatId");
    //     if (objDiv) {
    //         objDiv.scrollTop = objDiv.scrollHeight;
    //         lastElementRef.current?.scrollIntoView({ behavior: 'smooth' });
    //     }
    //   }, [displayText]);


    // useEffect(() => {
    //     //3️⃣ bring the last item into view        
    //     lastElementRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    // }, [displayText]);

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
        // <div style={style}>
        //     {displayText.map((element, index) => (
        //         <span key={index}>{element}</span>
        //     ))}
        // </div>
        // <div style={style}>
        //     {displayText.map((element, index) => (
        //         <React.Fragment key={index}>{element}</React.Fragment>
        //     ))}
        // </div>
        <div id={`answer-${index}`} style={style}>
            {displayText.map((element, index) => (
                // <React.Fragment key={index}>{element}</React.Fragment>
                <span key={index} ref={index === displayText.length - 1 ? lastElementRef : null}>
                    {element}
                </span>
            ))}
        </div>


    );
};

export default Chatbot;
