import { useRef} from 'react';
const FileOpen = (props) => {
    const inputRef = useRef(null);
    let setFileContent = props.setFileContent;
    let setFileUrl = props.setFileUrl;
    let setTempgivestring = props.setTempgivestring;
    let fileReader;
    const handleClick = () => {
        inputRef.current.click();
    };
    const onChange = e => {
      let file = e.target.files;
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file[0]);
      setFileUrl(file[0]);
      // console.log('sdfffffffffffffffffffffff',file);
     
    };
    const handleFileRead = (e) => {
      let content = fileReader.result;
      setTempgivestring([{
        'string': fileReader.onload,
        'date': '',
        'offSetNum': 0,
      }
      ])
      setFileContent(content);
      console.log('sdfffffffffffffffffffffff',content);
    };
    return (
      <div className='ml-5'>
      <input className=' fileurl '
          style={{display: 'none'}}
          ref={inputRef}
          type="file"
          onChange={onChange}
      />
        <button onClick={handleClick} className=" rounded text-white text-xl font-medium bg-[#0092cc] hover:bg-[#004b69] pr-2 pl-2">File Open</button>
      </div>
    );
};
export default FileOpen;    