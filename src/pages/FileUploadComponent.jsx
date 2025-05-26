import React, { useState } from 'react';
import { API } from '../utils/api';
import '../styles/FileUploadComponent.css';
import Navbar from '../components/Navbar';
import '../styles/Layout.css';

const FileUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);

    const newTitles = { ...titles };
    newFiles.forEach(file => {
      newTitles[file.name] = file.name.replace(/\.[^/.]+$/, "");
    });
    setTitles(newTitles);
  };

  const handleTitleChange = (fileName, title) => {
    setTitles({
      ...titles,
      [fileName]: title
    });
  };

  const removeFile = (fileName) => {
    setFiles(files.filter(file => file.name !== fileName));
    const newTitles = { ...titles };
    delete newTitles[fileName];
    setTitles(newTitles);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const results = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', titles[file.name]);

        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { status: 'uploading', progress: 0 }
        }));

        const response = await API.post('/api/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: { status: 'uploading', progress }
            }));
          }
        });

        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { status: 'success', progress: 100 }
        }));

        results.push(response.data);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { status: 'error', progress: 0, error: error.message }
        }));
      }
    }

    setUploadedDocuments([...uploadedDocuments, ...results]);
    setIsUploading(false);
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="file-upload-container">
        <h2>Document Upload</h2>

        <div className="upload-section">
          <label className="file-input-label">
            Select Files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
            />
          </label>

          <button
            onClick={uploadFiles}
            disabled={isUploading || files.length === 0}
            className="upload-button"
          >
            {isUploading ? 'Uploading...' : 'Upload Documents'}
          </button>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h3>Selected Files ({files.length})</h3>
            <ul>
              {files.map((file) => (
                <li key={file.name} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>

                    {uploadProgress[file.name]?.status === 'uploading' && (
                      <div className="progress-bar">
                        <div
                        //  className="progress-fill" 
                        //  style={{ width: `${uploadProgress[file.name].progress}%` }}
                        ></div>
                      </div>
                    )}

                    {uploadProgress[file.name]?.status === 'success' && (
                      <span className="status success">✓ Uploaded</span>
                    )}

                    {uploadProgress[file.name]?.status === 'error' && (
                      <span className="status error">✗ Error</span>
                    )}
                  </div>

                  <div className="file-title-input">
                    <label>Title:</label>
                    <input
                      type="text"
                      value={titles[file.name] || ''}
                      onChange={(e) => handleTitleChange(file.name, e.target.value)}
                      placeholder="Enter document title"
                    />
                  </div>

                  <button
                    onClick={() => removeFile(file.name)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {uploadedDocuments.length > 0 && (
          <div className="uploaded-documents">
            <h3>Uploaded Documents</h3>
            <ul>
              {uploadedDocuments.map((doc, index) => (
                <li key={index} className="document-item">
                  <div className="document-info">
                    <h4>{doc.title}</h4>
                    <p><strong>Original Language:</strong> {doc.language}</p>
                    {doc.translationLanguage && (
                      <p><strong>Translated to:</strong> {doc.translationLanguage}</p>
                    )}
                    <p><strong>Word Count:</strong> {doc.wordCount}</p>
                    <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleString()}</p>
                  </div>
                  <div className="document-preview">
                    <h5>Content Preview:</h5>
                    <p className="content-preview">
                      {doc.content.substring(0, 150)}...
                    </p>
                    {doc.translatedContent && (
                      <>
                        <h5>Translated Preview:</h5>
                        <p className="translated-preview">
                          {doc.translatedContent.substring(0, 150)}...
                        </p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;