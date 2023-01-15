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
    const [offSetNum, setOffSetNum] = useState(1);
    const [changeCounts, setChangeCounts] = useState(0);
    const [startLines, setStartLines] = useState(1);
    const [startColumns, setStartColumns] = useState(1);
    const [endLines, setEndLines] = useState(1);
    const [decIns, setDecIns] = useState([]);
    const [decDel, setDecDel] = useState([]);
    const [delPos, setDelPos] = useState(0);
    const [delStr, setDelStr] = useState('');
    const [endColumns, setEndColumns] = useState(1);
    const [startEventFlag, setStartEventFlag] = useState(0);
    const [detectFlag, setDetectFlag] = useState(false);
    const [point, setPoint] = useState([]);

    const [prevPos,setPrevPos]=useState(0);
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
    
    const [vars, setVars] = useState({});
    const { monacoEditor, monaco } = vars;
    let config = Config;
    let delbutton=false;
    const [count, setCount ] = useState(1);
    const timerRef = useRef();
    // const [delbutton, setDelbutton ] = useState(true);
    let delString, delbString,delSLine,     delSColmn,    delELine,     delEColmn; 
    async function editorDidMount(monacoEditor, monaco) {
        setVars({ monacoEditor, monaco });
        monacoEditor.onMouseDown(function () {
        });
        monacoEditor.onMouseUp(function () {
            let insertrange = {
                range: monacoEditor.getSelection(),
                options: { inlineClassName: "base.case.lol" }
            }
            if(decDel.length<1){
                // console.log("sssssssselected=====",decDel);
                // let aa=[insertrange];
                // setDecDel(aa);
                // console.log("sssssssselected=====",decDel);
            }
            else{console.log("selected");
                let asa = setDecDel.map(item => Object.assign(item));asa.push(insertrange);setDecDel(asa);  
            }  
            delSLine=monacoEditor.getSelection().startLineNumber;   
            delSColmn=  monacoEditor.getSelection().startColumn; 
            delELine=monacoEditor.getSelection().endLineNumber;   
            delEColmn=  monacoEditor.getSelection().endColumn; 
            delbString=monacoEditor.getModel().getValueInRange(new monaco.Range(monacoEditor.getSelection().startLineNumber,monacoEditor.getSelection().startColumn-1,monacoEditor.getSelection().startLineNumber,monacoEditor.getSelection().startColumn));
            delString=monacoEditor.getModel().getValueInRange(monacoEditor.getSelection());
            // console.log("Up",delSLine,            delSColmn,             delELine,        delEColmn);
            // console.log(delPos,'=====',delColmn,'==',monacoEditor.getModel().getValueInRange(monacoEditor.getSelection()));
        });
        monacoEditor.onKeyDown(function (event) {
            if(event.code=="Delete"){
                delbutton=true;
                const sl=delSLine,sc=delSColmn,el=delELine,ec=delEColmn;
                // console.log("Working",14,5,15,6);
                monacoEditor.executeEdits("", [ { range: new monaco.Range(sl,sc,sl,sc), text: delString ,forceMoveMarkers: true} ]);
                let insertrange = {
                    range: new monaco.Range(sl, sc, sl, ec),
                    options: { inlineClassName: "base.case.lol" }
                }
                let aa=[insertrange];
                setDecDel(aa);
                setDecDel(aa);
                // console.log(delString);
                let p=changeCounts;p++;setChangeCounts(p);
                // console.log(decIns.length);
            }
        });
    }

    useEffect(() => {
        if (fileContent) {
            setStartEventFlag(1);    
        }
    }, [])
    // monacoEditor.onmousesown(function () {
    //     alert('F1119 pressed!');
    // });
    // useEffect(() => {
    //     const displayList = giveListLog.map(item => Object.assign(item, {show: false}))
    //     setDisplayList(displayList);
    // }, [changeString])

    // useEffect(() => {
    //     timerRef.current = setInterval(() => {
    //         setCount(c => c + 1);
    //     }, 1000);
    //     return () => {
    //         clearInterval(timerRef.current);
    //     };
    // }, [ timerRef, setCount ]);

    // useEffect(()=>{
    //     let tempGive = [];
    //     if(tempgivestring[0].string !== changeString){
    //         if (count % 10 === 0 ) {
    //             tempGive = [
    //                 {
    //                     'date': new Date().toLocaleString(),
    //                     'string': changeString,
    //                     'offSetNum': offSetNum,
    //                 },
    //             ];
    //             // console.log('tempGive', tempGive);
    //             setTempgivestring(tempGive);
    //             setGiveListLog([...giveListLog, ...tempGive]);
    //             const obj = [...giveListLog, ...tempGive];
    //             const blob = new Blob([JSON.stringify(obj, null, 1)], {type : 'application/json'});
    //             saveFile(blob, fileUrl);
    //         }  
    //     }
    // }, [count])

    useEffect(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
        const qwe = monacoEditor.deltaDecorations(
          [], decIns
        );
        const qwea = monacoEditor.deltaDecorations(
            [], decDel
          );
        // console.log(monacoEditor);
        return () => {
            monacoEditor.deltaDecorations(qwe, []);
            monacoEditor.deltaDecorations(qwea, []);
        }
    }, [changeCounts]);   

    const handleClickInfo = (selectedIndex) => {
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }
    
    const handleEditorChange = (count, event) => {
        if(!delbutton){
            if (!startEventFlag) {
                setStartEventFlag(true)
            }
            else{
                if (prevPos==0) {//Startting
                    // console.log("Now startting");
                    setStartLines(event.changes[0].range.startLineNumber);
                    setStartColumns(event.changes[0].range.startColumn);
                    setEndLines(event.changes[0].range.endLineNumber);
                    setEndColumns(event.changes[0].range.endColumn);
                    let insertrange = {
                        range: new monaco.Range(startLines, startColumns, endLines, endColumns),
                        options: { inlineClassName: "base.case.rofl" }
                    }
                    let a=[insertrange];
                    setDecIns(a);
                    // console.log("------",startColumns,"------",startLines,"------",endColumns,"------",endLines);         &&(event.changes[0].startColumn<=item.range.startColumn)
                }
                else{//Not Startting
                    if(prevPos==event.changes[0].rangeOffset-1){//Contiuous     
                        decIns.map(item=>{
                                if((item.range.startLineNumber===event.changes[0].range.startLineNumber)&&(event.changes[0].range.startColumn<=item.range.startColumn) ){
                                    let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                    item.range=new monaco.Range(a,b,c,d); 
                                }
                        })               
                        setEndLines(event.changes[0].range.endLineNumber);
                        setEndColumns(event.changes[0].range.endColumn);
                        let as = decIns.map(item => Object.assign(item));
                        as[as.length-1].range=new monaco.Range(startLines, startColumns, endLines, endColumns+2);
                        setDecIns(as);
                        // console.log("Continuos");
                    }
                    else{//Not contiuous
                        decIns.map(item=>{
                                if((item.range.startLineNumber===event.changes[0].range.startLineNumber)&&(event.changes[0].range.startColumn<=item.range.startColumn) ){
                                    let a=item.range.startLineNumber,b=item.range.startColumn+1,c=item.range.endLineNumber,d=item.range.endColumn+1;
                                    item.range=new monaco.Range(a,b,c,d); 
                                }
                        })
                        
                        if(prevPos<(event.changes[0].rangeOffset-1)){//down
                            setStartLines(event.changes[0].range.startLineNumber);
                            setStartColumns(event.changes[0].range.startColumn);
                            setEndLines(event.changes[0].range.endLineNumber);
                            setEndColumns(event.changes[0].range.endColumn);
                            let as = decIns.map(item => Object.assign(item));
                            let insertrange = {
                                range: new monaco.Range(startLines, startColumns, endLines, endColumns),
                                options: { inlineClassName: "base.case.rofl" }
                            }
                            as.push(insertrange);
                            setDecIns(as);
                            // console.log("Down editting");
                        }
                        else{//before  in the furture  keycode=enter action process add.
                            setStartLines(event.changes[0].range.startLineNumber);
                            setStartColumns(event.changes[0].range.startColumn);
                            setEndLines(event.changes[0].range.endLineNumber);
                            setEndColumns(event.changes[0].range.endColumn);
                            let as = decIns.map(item => Object.assign(item));
                            let insertrange = {
                                range: new monaco.Range(startLines, startColumns, endLines, endColumns),
                                options: { inlineClassName: "base.case.rofl" }
                            }
                            as.push(insertrange);
                            setDecIns(as);                  
                            
                            // console.log("Up editting");
                        }                   
                        // console.log("Not continuous");
                    }
                    // console.log("Now started");
                }
                setPrevPos(event.changes[0].rangeOffset);
                let a=changeCounts;a++;
                setChangeCounts(a);            
            }
            // setDelbutton(false);     
            // delbutton=false;  
        }
        
        
        // if (!startEventFlag) {
        //     setStartEventFlag(true)
        // }
        // else{
        //     if (!detectFlag) {
        //         setStartLines(event.changes[0].range.startLineNumber);
        //         setStartColumns(event.changes[0].range.startColumn+1);
        //         setOffSetNum(event.changes[0].rangeOffset)
        //         setEndLines(event.changes[0].range.startLineNumber);
        //         setEndColumns(event.changes[0].range.startColumn);
        //         setDetectFlag(true);
        //         // console.log("part1===>>>");
        //     } else {
        //         if (Math.abs(event.changes[0].rangeOffset - offSetNum) > 1) {
        //             if (event.changes[0].rangeOffset > offSetNum) {
        //                 let as = decIns.map(item => Object.assign(item));
        //                 let insertrange = {
        //                     range: new monaco.Range(startLines, startColumns-2, endLines, endColumns+1),
        //                     options: { inlineClassName: "base.case.rofl" }
        //                 }
        //                 as.push(insertrange);
        //                 setDecIns(as);
        //                 setOffSetNum(event.changes[0].rangeOffset);
        //                 setDetectFlag(false);
        //                 // console.log("part2===>>>");
        //             }
        //             else{
        //                 let as = decIns.map(item => Object.assign(item));
        //                 let insertrange = {
        //                     range: new monaco.Range(startLines, startColumns-1, endLines, endColumns+1),
        //                     options: { inlineClassName: "base.case.rofl" }
        //                 }
        //                 as.push(insertrange);
        //                 setDecIns(as);
        //                 setOffSetNum(event.changes[0].rangeOffset);
        //                 setStartLines(event.changes[0].range.startLineNumber);
        //                 setStartColumns(event.changes[0].range.startColumn-1);
        //                 setDetectFlag(false);
        //                 // console.log("part3===>>>");
        //             }
                    
        //         } else {
        //             setEndLines(event.changes[0].range.startLineNumber);
        //             setEndColumns(event.changes[0].range.startColumn );
        //             setOffSetNum(event.changes[0].rangeOffset);
        //             const newDecIns = decIns.map((obj, index)=>{
        //                 return obj;
        //             })
        //             // setDecIns(newDecIns);
        //             // console.log("part4===>>>");
        //         }
        //     }
            
        // }
        
        
        
        // let as = decIns.map(item => Object.assign(item));
        // let insertrange = {
        //     range: new monaco.Range(startLines, startColumns, endLines, endColumns),
        //     options: { inlineClassName: "base.case.rofl" }
        // }
        // as.push(insertrange);
        // setDecIns(as);



        
        // let temp1 = '';
        // temp1 = changeString + event.changes[0].text;
        // setChangeString(temp1);
        // console.log(decIns);  
    }
    const saveFile = async (blob, fileUrl) => {
        // const a = document.createElement('a');
        // a.download = fileUrl.name;
        // a.href = URL.createObjectURL(blob);
        // a.addEventListener('click', (e) => {
        //   setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        // });
        // a.click();
    }
    
    return (
        <div className="w-full flex justify-center flex-col mt-5  rounded border-b-1 border-[#451356] ">
            <div className="w-full text-4xl font-bold text-[#451356] h-12 text-center">{config.title}</div>
            <div className="w-full">
                <FileOpen setTempgivestring={setTempgivestring} setStartEventFlag={setStartEventFlag} setFileContent={setFileContent} setFileUrl={setFileUrl}/>
            </div>
            <div className="w-full flex flex-row border ">
                <div className="w-2/3 border-spacing-1 border-[#000000] ">                    
                <EditorWrapper
                    path={fileUrl.name} defaultLanguage={fileUrl.type} value={fileContent} handleEditorChange={handleEditorChange} editorDidMount={editorDidMount}/>  
                </div>
                <div className="w-1/3  bg-[#D9E8F5]  " >
                    <div className='flex-col p-5'>
                        <p className='text-2xl font-bold'>Tracked Changes</p>
                        
                        <div className='border-spacing-1 '>
                            
                            <div className='h-auto'>
                                {giveListLog && giveListLog.map((item, index) =>(
                                    <div key = {index} className='border rounded-xl shadow-slate-700 border-b-indigo-400'>
                                        <p className='text-xl font-medium'>Tracked Changes:{changeCounts}</p>
                                        <p className='text-mm pl-5 hover:text-lime-800 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.string : item.string.slice(0, 5)+'...'}</p>
                                        <p className="text-sm  pl-5">{item.offSetNum}</p>
                                        <p className="text-sm pl-5">{item.date}</p>
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
function EditorWrapper({ theme, path,defaultLanguage,value, language, editorDidMount, handleEditorChange }) {

    return (
        <Editor
            height="80vh"
            theme={theme}
            path={path}
            defaultLanguage={defaultLanguage}
            value={value}
            onMount={editorDidMount}
            onChange={handleEditorChange}
            /> 
    );
}
