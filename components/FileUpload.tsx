import React, { useState, useRef } from 'react';
import keccak256 from 'keccak256';
import { sha256 } from 'js-sha256';

type TransactionData = {
  fileNameHash:string,
  dataHash:String
};
const FileUpload = ({modifyData}) => {
  const inputFile = useRef(null);
  const [firstFileName, setFirstFileName] = useState("")
  const [firstFileHash, setFirstFileHash] = useState("")
  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;
      setFirstFileName(filename)
      console.log(filename)
      const file = files[0];
      const parts = filename.split('.');
      const fileType = parts[parts.length - 1];
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = reader.result as string;
        const fileHash = keccak256(filename).toString('hex')
        const dataHash = keccak256(content).toString('hex')
        // const fileHash = sha256(firstFileName)
        // const dataHash = sha256(content)
        console.log("0x" + dataHash, "0x" + fileHash)
        modifyData("0x" + dataHash, "0x" + fileHash)
        setFirstFileHash("0x" + dataHash)
      };
      const text = reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <div>
      <input
        style={{ display: 'none' }}
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      {firstFileName}<br></br>{firstFileHash}
      <br></br>
      <button className="button" onClick={onButtonClick}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
