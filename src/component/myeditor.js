
import Editor from "@monaco-editor/react";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Config } from "../config/config";
import FileOpen from "./fileOpen";
import "./index.css";
export function Myeditor() {
    const [fileUrl, setFileUrl] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [changeString, setChangeString] = useState('');
    const [offSetNum, setOffSetNum] = useState(0);
    const [changeCounts, setChangeCounts] = useState(0);
    const [giveListLog, setGiveListLog] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    const [tempgivestring, setTempgivestring] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    ////////////////////////////////////////////////////////////////////
    async function handleEditorDidMount(monacoEditor, monaco) {
        setVars({ monacoEditor, monaco });
      }
    const [vars, setVars] = useState({});
    const [ids, setIds] = useState([]);
    const { monacoEditor, monaco } = vars;
    const handleChangeIds = useCallback(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
        setIds((ids) => {
          const newIds = monacoEditor.deltaDecorations(ids, [
            {
              range: new monaco.Range(1, 1, 1, 5),
              options: { inlineClassName: "base.case.lol" }
            }
          ]);
          return newIds;
        });
      }, [monacoEditor, monaco]);
      useEffect(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
    
        const ids = monacoEditor.deltaDecorations(
          [],
          [
            {
              range: new monaco.Range(1, 1, 1, 5),
              options: { inlineClassName: "base.case.rofl" }
            }
          ]
        );
        setIds(ids);
        return () => monacoEditor.deltaDecorations(ids, []);
      }, [monacoEditor, monaco]);
    ///////////////////////////////////////////////////////////////////
    let config = Config;
    const [ count, setCount ] = useState(0);
    const timerRef = useRef();
    useEffect(() => {
        const displayList = giveListLog.map(item => Object.assign(item, {show: false}))
        setDisplayList(displayList);
    }, [changeString])
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [ timerRef, setCount ]);
    useEffect(()=>{
        let tempGive = [];
        if (count % 5 === 0) {
            if(tempgivestring[0].string !== changeString){
                tempGive = [
                    {
                        'date': new Date().toLocaleString(),
                        'string': changeString,
                        'offSetNum': offSetNum,
                    },
                ];
                setGiveListLog([...giveListLog, ...tempGive]);
                setTempgivestring(tempGive);
                console.log('givestringlgo.string', tempgivestring[0].string);
                console.log('changestring', changeString);
            }  
            console.log('givelistlog', giveListLog);
        }  
    }, [count])
    const handleClickInfo = (selectedIndex) => {
        console.log('givelistlog');
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }
    const handleEditorChange = (value, event) => {
        let a=changeCounts;
        setChangeCounts(a++);
        let temp1 = '';
        temp1 = changeString +  event.changes[0].text;
        setChangeString(temp1);
        setOffSetNum(parseInt(event.changes[0].rangeOffset));
      }
    return (
        <div className="w-full flex justify-center flex-col mt-5  rounded border-b-1 border-[#451356] ">
            <div className="w-full text-4xl font-bold text-[#451356] h-12 text-center">{config.title}</div>
            <div className="w-full">
                <FileOpen setTempgivestring={setTempgivestring} setFileContent={setFileContent} setFileUrl={setFileUrl}/>
            </div>
            <div className="w-full flex flex-row border ">
                <div className="w-2/3 border-spacing-1 border-[#000000] ">                    
                <EditorWrapper
                    // language="javascript"
                    editorDidMount={handleEditorDidMount}
                    path={fileUrl.name}
                    defaultLanguage={fileUrl.type}
                    value={fileContent}
                />
                    
                </div>
                <div className="w-1/3  bg-[#D9E8F5]  " >
                    <div className='flex-col p-2'>
                        <p className='text-2xl'>Tracked Changes</p>
                        <p className=''>Tracked Changes:{changeCounts}</p>
                        <div className=' object-none object-center'>
                            <div className='h-auto'>
                                {giveListLog && giveListLog.map((item, index) =>(
                                    <div key = {index} className='border border-spacing-1 border-b-indigo-400'>
                                        <p className='text-mm border border-spacing-1 border-b-indigo-200 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.string : item.string.slice(0, 5)+'...'}</p>
                                        <p className="text-sm  ">{item.offSetNum}</p>
                                        <p className="text-sm ">{item.date}</p>
                                    </div>
                                ))}   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
    )
}

function EditorWrapper({ theme, path,defaultLanguage,value, language, editorDidMount }) {
    return (
        <Editor
            height="60vh"
            theme={theme}
            path={path}
            defaultLanguage={defaultLanguage}
            value={value}
            onMount={editorDidMount} /> 
    );
}
