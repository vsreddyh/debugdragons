import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faCamera } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import NothingHere from './nothinghere';
import ProjectCard from './ProjectCard';

export default function StudentProfile({
    studentproj,
    handlestudentdetail,
    studentdetail,
    handleclick,
}) {
    const [editMode, setEditMode] = useState(false);
    const [studentDescription, setStudentDescription] = useState('');
    const [studentorganization, setStudentOrganization] = useState('');
    const [studentfield, setStudentField] = useState('');

    const handlePhotoChange = async (event) => {
        const selectedProfilePhoto = event.target.files[0];
        if (selectedProfilePhoto) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];
                console.log(base64data);

                let temp = event.target.value;
                const profilePhotoName = temp.replace('C:\\fakepath\\', '');

                try {
                    const response = await axios.post(
                        `https://schedio-coral.vercel.app/en/uploadProfilePhoto`,
                        {
                            profilePhoto: base64data,
                            pphotoname: profilePhotoName,
                            userId: studentdetail._id,
                        }
                    );
                    console.log('Photo saved successfully');
                    const ppid = response.data.fileId;
                } catch (error) {
                    console.error('Error uploading photo:', error);
                }
            };
            reader.readAsDataURL(selectedProfilePhoto);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleStudentDescription = (event) => {
        setStudentDescription(event.target.value);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setStudentDescription('');
        setStudentField('');
        setStudentOrganization('');
    };

    const handleStudentDescriptionSave = async () => {
        console.log('Edited College Name:', studentDescription);
        setEditMode(false);
        try {
            const response = await axios.post(
                `https://schedio-coral.vercel.app/en/uploadDescription`,
                {
                    studentDescription: studentDescription,
                    studentorganization: studentorganization,
                    studentfield: studentfield,
                    userId: studentdetail._id,
                }
            );
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
        handlestudentdetail();
    };
    useEffect(() => {
        setStudentDescription(studentdetail.student_description);
        setStudentField(studentdetail.student_field);
        setStudentOrganization(studentdetail.student_organization);
    }, [studentdetail]);
    return (
        <div className='mprofile'>
            {studentdetail && (
                <div className='mpcontainer'>
                    <div className='mpprofile'>
                        <div className='mppicedit'>
                            <label htmlFor='fileInput'>
                                <span>
                                    <FontAwesomeIcon icon={faCamera} />
                                </span>
                            </label>
                            <input
                                id='fileInput'
                                type='file'
                                accept='image/*'
                                onChange={handlePhotoChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className='mpbg'></div>
                        <div className='mpphoto'>
                            <img
                                className='profile-picture'
                                src={`/en/image/${studentdetail.photo}`}
                                alt='Profile Picture'
                            />
                        </div>
                        <div className='mpdetails'>
                            <div className='mpdet'>
                                <div className='mpname'>
                                    <div className='mprealname'>
                                        <p>{studentdetail.student_name}</p>
                                    </div>
                                    <div
                                        className='editoption'
                                        onClick={handleEditClick}
                                    >
                                        Edit <span>&#128393;</span>
                                    </div>
                                </div>
                                <p className='mpgmname'>
                                    {studentdetail.email_address}
                                </p>
                                <div className='mpgmname'>
                                    {editMode ? (
                                        <React.Fragment>
                                            <select
                                                className='shopnm'
                                                value={studentfield}
                                                onChange={(e) =>
                                                    setStudentField(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value='Employed'>
                                                    Employed
                                                </option>
                                                <option value='Unemployed'>
                                                    Unemployed
                                                </option>
                                            </select>
                                            <br />
                                            <input
                                                className='shopnm'
                                                type='text'
                                                placeholder='Enter your organization name'
                                                value={studentorganization}
                                                onChange={(e) =>
                                                    setStudentOrganization(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <br />
                                            <input
                                                className='shopnm'
                                                type='text'
                                                placeholder='Tell something about yourself'
                                                value={studentDescription}
                                                onChange={
                                                    handleStudentDescription
                                                }
                                            />
                                            <br />
                                            <button
                                                className='shopbutton1'
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <p className='mpgmname'>
                                                {studentdetail.field_name}
                                            </p>
                                            <p className='mpgmname'>
                                                {studentdetail.college_name}
                                            </p>
                                            <p className='mpgmname'>
                                                {studentdetail.Description}
                                            </p>
                                        </React.Fragment>
                                    )}
                                    {editMode && (
                                        <button
                                            className='shopbutton'
                                            onClick={
                                                handleStudentDescriptionSave
                                            }
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className='mpprojects'>
                <div className='mpheading'>
                    <h5 className='myprj'>MY PROJECTS</h5>
                </div>
                <div className='mlkmj'>
                    {studentproj &&
                        studentproj.map((suggestion, index) => (
                            <div
                                key={index}
                                className='grid-item'
                                onClick={() => handleclick(suggestion._id)}
                            >
                                <ProjectCard
                                    projinfo={suggestion}
                                    index={index}
                                />
                            </div>
                        ))}
                    {studentproj.length === 0 && <NothingHere />}
                </div>
            </div>
        </div>
    );
}
