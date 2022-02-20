import React, { useState, useRef } from 'react';
import keccak256 from 'keccak256';
import { sha256 } from 'js-sha256';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const inputFile = useRef(null);

  const handleFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;
      const file = files[0];
      const parts = filename.split('.');
      const fileType = parts[parts.length - 1];
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = reader.result;
        alert(keccak256(content).toString('hex'));
      };
      const text = reader.readAsBinaryString(e.target.files[0]);
      setFile(files[0]);
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
      <div className="button" onClick={onButtonClick}>
        Upload
      </div>
    </div>
  );
};

export default FileUpload;
