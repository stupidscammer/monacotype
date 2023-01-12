
import Editor, { monaco,useMonaco } from "@monaco-editor/react";
import files from "./files";
import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
export function Myeditor() {
    const [fileName, setFileName] = useState("script.js");
    const [displayList, setDisplayList] = useState([]);
    const file = files[fileName];

    // const editor = monaco.editor.create(document.getElementById("container"), {
    //     value: "function hello() {\n\talert('Hello world!');\n}",
    //     language: "javascript"
    // });
    
    // editor.onDidChangeModelContent = e => {
    //     console.log(editor.getValue());
    // };


    const givenList=[{
        caption:'Unknown Changed Inserted',
        time:'03/03/2021 09:34',
        info:'delete data',
    },{
        caption:'Unknown Changed Inserted',
        time:'03/03/2021 09:34',
        info:'output data',
    },{
        caption:'Unknown Changed Inserted',
        time:'03/03/2021 09:34',
        info:'input data',
    }];

    useEffect(() => {
        const displayList = givenList.map(item => Object.assign(item, {show: false}))
        setDisplayList(displayList);
    }, [])

    const handleClickInfo = (selectedIndex) => {
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }
    const handleEditorChange = (value, event) => {
        // event.getValue();
        console.log(event.changes[0]);
        console.log("You typed in ",event.changes[0].range.startLineNumber,"th line, ",event.changes[0].range.startColumn,"th Colum ",event.changes[0].rangeOffset,"th Offset '",event.changes[0].text,"'");
      }
    return (
        <div className='flex flex-row'>
            <div className='w-9/12'>
                <div className='mt-24 ml-16 w-9/12 object-none object-center border border-black'>
                {/* <div id="container"></div> */}
                    <Editor
                        height="60vh"
                        path={file.name}
                        defaultLanguage={file.language}
                        defaultValue={file.value}
                        onChange={handleEditorChange}
                    />
                </div>
            </div>
            <div className='w-3/12 mr-2'>
                <div className='flex-col'>
                    <p className='text-2xl'>Tracked Changes</p>
                    <p className=''>Tracked Changes</p>
                    <div className='border border-black object-none object-center'>
                        <div className='h-auto'>
                        {displayList.map((item, index) => (
                            <div key={`show_data_${index}`}>
                                <p className='text-lg'>{item.caption}</p>
                                <p className='text-base ml-5'>({item.time})</p>
                                <p className='text-sm ml-10 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.info : item.info.slice(0, 5)+'...'}</p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
