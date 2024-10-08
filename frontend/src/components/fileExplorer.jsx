import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileOrFolder from './fileorfolder';
import './fileExplorer.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams } from 'react-router-dom';
import axiosInstance from '../settings/axiosInstance';
import Loading from './Loading';

const FileExplorer = () => {
    const [sider, setsider] = useState(true);
    const { data } = useParams();
    const [fileName, setFileName] = useState('');
    const [folderStructure, setFolderStructure] = useState(null);
    const [fileContents, setFileContents] = useState({});
    const [file, setFile] = useState('');
    const [fname, setFname] = useState('');
    const [cde, setcde] = useState();
    const [openforpath, setopenforpath] = useState('');
    const [codeExplain, setCodeExplain] = useState('');
    const [display, setDisplay] = useState(0);

    const [fileId, setFileId] = useState('');
    console.log(openforpath);
    const fetchFolderStructure = async (data) => {
        try {
            setFileId(data);
            const response = await axios.post(
                'https://schedio-coral.vercel.app/en/fexp',
                {
                    data,
                }
            );
            console.log(response.data.filename);
            setFolderStructure(response.data.folderStructure);
            setFileContents(response.data.fileContents);
            setFileName(response.data.filename);
        } catch (error) {
            console.error('Error fetching folder structure:', error);
        }
    };
    useEffect(() => {
        fetchFolderStructure(data);
    }, [data]);
    const handleCodeExplain = () => {
        setCodeExplain('');
        setsider(false);
        console.log(cde);
        const response = axios.post(
            'https://schedio-coral.vercel.app/en/explainCode',
            {
                data: cde,
            }
        );
                console.log("hiiiiiii");
                console.log(response.data.ans);
                let codeExplainString = response.data.ans;
                codeExplainString = codeExplainString//.replace(/\n/g, '<br/>');
                setCodeExplain(codeExplainString);
            
    };
    console.log('a', data);
    return (
        <div class='febodyy'>
            {sider && (
                <div className='sider'>
                    {folderStructure ? (
                        <FileOrFolder
                            fileName={fileName}
                            name={fileName}
                            contents={folderStructure}
                            fileContents={fileContents}
                            setcde={setcde}
                            setopenforpath={setopenforpath}
                            openforpath={openforpath}
                        />
                    ) : (
                        <Loading />
                    )}
                </div>
            )}
            {sider ? (
                <div className='festage'>
                    <div className='file-content'>
                        <div>
                            <SyntaxHighlighter
                                language='javascript'
                                style={solarizedlight}
                                customStyle={{ backgroundColor: '#03070f' }}
                            >
                                {cde ? cde : 'No code'}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                    {sider && cde && (
                        <button
                            className='askme'
                            onClick={() => handleCodeExplain()}
                        >
                            Explain me!
                        </button>
                    )}
                    {!sider && <div className='explain-block'></div>}
                </div>
            ) : (
                <div className='festage1'>
                    <button className='fileback' onClick={() => setsider(true)}>
                        back
                    </button>
                    <div className='file-content1'>
                        <div>
                            <SyntaxHighlighter
                                language='javascript'
                                style={solarizedlight}
                                customStyle={{ backgroundColor: '#03070f' }}
                            >
                                {cde ? cde : 'No code'}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                    {!sider && (
                        <div
                            className='explain-block'
                            dangerouslySetInnerHTML={{
                                __html: codeExplain
                                    ? codeExplain
                                    : 'Generating',
                            }}
                        ></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileExplorer;
