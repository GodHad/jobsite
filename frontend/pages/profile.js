import { Layout } from "../components/shared/new/Layout.js";
import Head from "next/head";
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input/input';
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input/input'
import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import en from 'react-phone-number-input/locale/en';
import moment from 'moment';
import { Requests } from "../components/CustomHooks/Requests.js";
import { NotifyComponent } from "../components/shared/Notify.js";
import { getFormInputValues } from "../components/get-named-inputs-values.js";
import { useRouter } from 'next/router'
import config from "../config/default.js"
import { DivLoader } from "../components/shared/DivLoader.js";
import mammoth from 'mammoth';

function Profile({ props, loading, user, serverUrl, router, pageTitle, userChecks }) {

    if (loading) return <Layout loading={true} />
    const [phoneNumber, setPhoneNumber] = useState(user.phoneCountryPrefix ? '+' + getCountryCallingCode(user.phoneCountryPrefix) + user.phoneNumber.replaceAll(' ', '') : '');
    const [country, setCountry] = useState(user.phoneCountryPrefix ? user.phoneCountryPrefix : "US");
    const [selectedFilename, setSelectedFileName] = useState(null);
    const [coverLetter, setCoverLetter] = useState(user.coverLetter);
    const [coverFileLoading, setCoverFileLoading] = useState(false);

    const inputFileRef = useRef(null);
    const coverFile = useRef(null);

    async function updateProfile(event) {
        try {
            event.preventDefault();
            const body = getFormInputValues(event);
            const files = inputFileRef.current.files;
            const formData = new FormData()
            formData.append('file', files[0])
            for (const [key, value] of Object.entries(body)) {
                if (key === 'file') continue;
                else if (key && value) {
                    formData.append(key, value)
                }
            }

            if (isValidPhoneNumber('+' + getCountryCallingCode(country) + phoneNumber)) throw new Error('Phone Number is invalid.')

            formData.append('phoneCountryPrefix', country)

            const url = `${serverUrl}/user`
            const data = await Requests('put-form-data', url, {}, formData)
            userChecks()

            NotifyComponent('success', "You updated your profile successfully.")

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    const handleCoverFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setCoverFileLoading(true);
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverLetter(e.target.result);
                setCoverFileLoading(false);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const reader = new FileReader();
            reader.onload = (e) => {
                mammoth.extractRawText({ arrayBuffer: e.target.result })
                    .then((result) => {
                        setCoverLetter(result.value);
                    })
                    .catch((err) => {
                        console.error('Error reading .docx file', err);
                    });
            };
            setCoverFileLoading(false);
            reader.readAsArrayBuffer(file);
        } else {
            NotifyComponent('failure', 'Unsupported file type');
            setCoverFileLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>{pageTitle} - Profile</title>
            </Head>
            <Layout loading={false} user={user}
                router={router}>
                <style jsx>{`
                    .main-content {
                        padding: 0 151px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-column-gap: 11.6em;
                        background-color: #F5F5F5;
                    }
                    
                    .upload-container {
                        margin-top: 7px;
                    }

                    .upload-label {
                        font-size: 16px;
                        font-weight: 600;
                        line-height: 22px;
                        letter-spacing: -0.017em;
                        text-align: right;
                        color: #0079B9;
                        cursor: pointer;
                        margin-bottom: 15px;
                    }

                    .upload-label span {
                        color: #C5383D;
                    }
                    
                    .upload-label img {
                        margin-left: 21px;
                    }

                    .upload-file-button > div {
                        width: 32.5%;
                        max-width: 205px;
                        aspect-ratio: 1 / 1;
                        border-radius: 8px;
                    }

                    @media (max-width: 1120px) {
                        .upload-file-button > div {
                            width: 120px;
                            height: 120px;
                        }
                    }

                    .upload-file {
                        margin-right: 80px;
                        border: 1px solid #1B1B1B;
                    }

                    .upload-file p {
                        max-width: 148px;
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 24.55px;
                        text-align: center;
                        color: #1B1B1B;
                        word-break: break-word;
                    }

                    .upload-file .uploaded-time {
                        max-width: 148px;
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 16.37px;
                        text-align: center;
                    }

                    .upload-button {
                        border: 1px solid #8692A6;
                        background: #999999;
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 24.55px;
                        text-align: center;
                        color: #FAFAFB;
                        cursor: pointer;
                    }

                    .elses-wrapper {
                        margin: 80px 84px 200px;
                        position: relative;
                    }

                    .elses-wrapper .loader-wrapper {
                        position: absolute; 
                        width: 100%;
                        height: 88%; 
                        top: 0;
                    }

                    .elses-wrapper textarea {
                        height: 596px;
                        border: 1px solid #1B1B1B;
                        background: #fff;
                        border-radius: 8px;
                        padding: 10px;
                        width: 100%;
                    }

                    .elses-wrapper .save-upload-buttons {
                        margin-top: 10px;
                    }

                    .elses-wrapper .save-upload-buttons .upload-buttons label {
                        margin: 0;
                    }

                    .save-button span {
                        border-bottom: 1px solid #BDBDBDCC;
                        margin-top: 10px;
                    }

                    .save-button button {
                        background: #1E202D;
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 22px;
                        letter-spacing: -0.017em;
                        text-align: left;
                        border: none;
                        color: #fff;
                        width: 187px;
                        border-radius: 4px;
                        text-align: center;
                        padding: 9px 0;
                        margin-top: 13px;
                    }

                    .warning-message {
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 22px;
                        letter-spacing: -0.017em;
                        padding: 0 151px;
                        text-align: left;
                        margin-top: 10px;
                    }

                    @media (max-width: 1120px) {
                        .upload-file-button > div {
                            width: 150px;
                            height: 150px;
                        }

                        .upload-file p,
                        .upload-file .uploaded-time {
                            max-width: 121px;
                        }

                        .upload-file {
                            margin-right: 20px;
                        }

                        .main-content, .warning-message {
                            grid-column-gap: 2.6rem;
                            padding: 0 70px;
                        }
                    }

                    @media (max-width: 820px) {
                        .main-content {
                            display: block;
                        }
                    }

                    input[type="file"] {
                        display: none;
                    }
                `}</style>
                <div className="profile-container">
                    <ProfileHeader title={"פרופיל"} user={user} router={router} />
                    <p className="warning-message">* מציין שדה חובה</p>
                    <form onSubmit={updateProfile}>
                        <div className="main-content">
                            <CustomInput label="שם משפחה" name="lastname" defaultValue={user.lastname} mandatory={true} />
                            <CustomInput label="שם פרטי" name="firstname" defaultValue={user.firstname} mandatory={true} />
                            <CustomInput label="מספר טלפון" mandatory={true}>
                                <div className="phone-input d-flex flex-row">
                                    <CustomDropdown
                                        labels={en}
                                        value={country}
                                        onChange={setCountry}
                                    />
                                    <PhoneInput
                                        className="phone-input"
                                        international
                                        name="phoneNumber"
                                        country={country}
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        style={{
                                            width: 'calc(100% - 120px)',
                                            border: '1px solid #1B1B1B',
                                            borderLeft: '0px',
                                            borderTopRightRadius: '8px',
                                            borderBottomRightRadius: '8px'
                                        }}
                                    />
                                </div>
                            </CustomInput>
                            <CustomInput label="@  אימייל " name={"email"} defaultValue={user.email} mandatory={true} />
                            <CustomInput label="קישור פרופיל לינקדין" name={"linkedinProfile"} defaultValue={user.linkedinProfileUrl} icon={"in"} />
                            <CustomInput label="כתובת" name={'address'} defaultValue={user.address} mandatory={true} />
                            <CustomInput label="אתר פרטי" name={"website"} defaultValue={user.website} />
                            <div className="upload-container d-flex flex-column">
                                <label className="upload-label"><span>* </span>העלה קורות חיים<img src="/assets/image/upload-icon.png" width={36} height={33} /></label>
                                <div className="upload-file-button d-flex flex-row justify-content-end">
                                    <div className="upload-file d-flex flex-column justify-content-center align-items-center">
                                        <p>{user.resumeFileName}</p>
                                        <p className="uploaded-time">Uploded on {moment(user.updatedAtAt).format('MMM DD, YYYY')}</p>
                                    </div>
                                    <div className="upload-button d-flex flex-column justify-content-center align-items-center" onClick={() => inputFileRef.current.click()}>
                                        <p>{selectedFilename || ""}</p>
                                        <p>+</p>
                                        <p>העלה קובץ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input id={"file-input"} ref={inputFileRef} name={"file"} type="file" className="custom-file-input"
                            accept={`application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, 
                                application/pdf, image/*,
                                application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
                                application/vnd.openxmlformats-officedocument.presentationml.slideshow,
                                .xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf
                                `}
                            onChange={e => e.target.files.length > 0 && setSelectedFileName(e.target.files[0].name)}
                        />
                        <div className="elses-wrapper">
                            <textarea name="coverLetter" defaultValue={coverLetter} placeholder="מכתב מקדים ברירת מחדל" onChange={(e) => setCoverLetter(e.target.value)} maxLength={2500} />
                            {
                                coverFileLoading &&
                                <div className="loader-wrapper">
                                    <DivLoader />
                                </div>
                            }
                            <div className="save-upload-buttons d-flex justify-content-between">
                                <div className="d-flex flex-column save-button">
                                    <span></span>
                                    <button type="submit">
                                        שמור
                                    </button>
                                </div>
                                <div className="upload-buttons d-flex flex-column">
                                    {/* <label className="upload-label"><span>* </span>העלה קורות חיים<img src="/assets/image/upload-icon.png" width={36} height={33} /></label> */}
                                    <label className="upload-label" onClick={(() => coverFile.current.click())}><span>* </span>צרף מכתב מקדים<img src="/assets/image/upload-icon.png" width={36} height={33} /></label>
                                    <input type="file" accept=".txt,.docx,.doc" ref={coverFile} onChange={handleCoverFileChange} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Layout>
        </>
    )
}

export default Profile;

function CustomInput({ label, defaultValue, mandatory, icon = '', children, name }) {
    return (
        <>
            <style jsx>{`
                .custom-input {
                    margin-top: 7px;
                }

                .custom-input label {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: right;
                    color: #000000BF;
                }

                .custom-input label span {
                    color: #C5383D;
                }

                .custom-input input {
                    background-color: #FFF;
                    border-radius: 8px;
                    border: 1px solid #1B1B1B;
                    padding: 25px 34px 25px 68px;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 16.94px;
                    text-align: left;
                    color: #494949;
                    position: relative
                }

                .custom-input input.with-icon {
                    background-image: url(/assets/image/linkedin-icon.png);
                    background-repeat: no-repeat;
                    background-position: 34px;
                }
            `}</style>
            <div className="custom-input d-flex flex-column">
                <label>{mandatory ? <span>* </span> : ''}{label}</label>
                {children ? children : <input name={name} className={`${icon ? "with-icon" : ''}`} type="text" defaultValue={defaultValue} />}
            </div>
        </>
    )
}

const CustomDropdown = ({ value, onChange, labels }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleSelect = (country) => {
        onChange(country);
        setIsOpen(false);
    };

    return (
        <div className="custom-dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <img
                    src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
                    alt={`${value} flag`}
                />
                +{getCountryCallingCode(value)}
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className="dropdown-list">
                    {getCountries().map((country) => (
                        <div
                            key={country}
                            className="dropdown-item"
                            onClick={() => handleSelect(country)}
                        >
                            <img
                                src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
                                alt={`${country} flag`}
                            />
                            {labels[country]} (+{getCountryCallingCode(country)})
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
                .custom-dropdown {
                    position: relative;
                    width: 120px;
                    background-color: white;
                    border: 1px solid #1B1B1B;
                    border-right: none;
                    border-top-left-radius: 8px;
                    border-bottom-left-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 25px 0 25px 33px;
                }
                .dropdown-header {
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 5px;
                    width: 100%;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 16.94px;
                    text-align: left;

                }
                .dropdown-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border: 1px solid #ccc;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1000;
                    width: 280px;
                }
                .dropdown-item {
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                .dropdown-item img {
                    margin-right: 10px;
                }
                .dropdown-item:hover {
                    background-color: #f5f5f5;
                }
            `}</style>
        </div>
    );
};

CustomDropdown.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    labels: PropTypes.objectOf(PropTypes.string).isRequired,
};

export function ProfileHeader({ title, user, router }) {
    return (
        <>
            <style jsx>{`
                .profile-header {
                    font-family: 'Inter', 'Noto Sans Hebrew', 'Alef', sans-serif;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 50px 82px;
                    background-color: rgba(202, 199, 199, 0.4);
                    box-shadow: 13px 4px 10px 0px #00000040;
                    border-radius: 8px;
                    position: relative;
                }

                .back-button {
                    position: absolute;
                    right: 40px;
                    top: 7px;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 21.82px;
                    color: #8692A6;
                    cursor: pointer;
                }

                .back-button span:last-child {
                    border-top: 2px solid #8692A6;
                    border-right: 2px solid #8692A6;
                    width: 12px;
                    height: 12px;
                    display: inline-block;
                    transform: rotate(45deg);
                    margin-left: 22px;
                }

                @media (max-width: 620px) {
                    .profile-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                }

                .profile-header-title {
                    font-weight: 800;
                    font-size: 32px;
                    line-height: 22px;
                    text-align: right;
                    color: #1E202D;
                }

                .profile-header-avatar img {
                    border-radius: 50%;
                }

                .profile-header-name {
                    display: flex;
                    gap: 37px;
                    justify-content: space-between;
                    align-items: center;
                }

                .profile-name {
                    font-size: 24px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: left;
                    color: #0079B9;
                }

                .profile-role {
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: left;
                }
            `}</style>
            <div className="profile-header">
                <div className="back-button" onClick={() => router.back()}>
                    <span>חזור</span>
                    <span></span>
                </div>
                <div className="profile-header-name">
                    <div className="profile-header-avatar">
                        <img src={user.linkedinPhotoUrl} width={132} height={132} />
                    </div>
                    <div className="profile-name-role">
                        <h2 className="profile-name">{user.firstname + ' ' + (user.lastname ? user.lastname : '')}</h2>
                        <h2 className="profile-role">UX/UI Designer</h2>
                    </div>
                </div>
                <div className="profile-header-title">{title}</div>
            </div>
        </>
    )
}