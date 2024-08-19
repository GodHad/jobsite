import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import RoomIcon from '@material-ui/icons/Room';
import Image from 'next/image';
import moment from 'moment';
import { Requests } from '../CustomHooks/Requests';
import { NotifyComponent } from './Notify';
import { useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

export default function ProjectItem({ project, serverUrl }) {

    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(false);

    async function getPosition() {
        if (position) {
            setPosition(null);
            return;
        }
        setLoading(true);
        try {
            const { data, applied, saved } = await Requests("get", serverUrl + "/position/" + project.id)
            setPosition(data)
            setLoading(false)
        } catch (error) {
            NotifyComponent("failure", error.message)
        }
    }
    return (
        <>
            <style jsx>{`
                .project-item {
                    margin: 0 53px 28px;
                    background: #fff;
                    border-radius: 16px;
                    padding: 16px 16px 23px 28px;
                    flex-direction: row;
                }
                
                @media (max-width: 850px) {
                    .project-item {
                        margin: 0 10px 28px;
                    }
                }

                @media (max-width: 1000px) {
                    .project-item {
                        margin: 0 10px 28px;
                        flex-direction: column;
                    }
                }

                .common-buttons {
                    flex-direction: column;
                }
                    
                @media (max-width: 1000px) {
                    .common-buttons {
                        flex-direction: row;
                    }
                }

                
                .functional-buttons, .location {
                    gap: 22px;
                }
                    
                .submit-buttons {
                    margin-left: 74px;
                    display: flex;
                    gap: 16px;
                    flex-direction: column;
                }
                        
                @media (max-width: 1000px) {
                    .submit-buttons {
                        margin-left: 0px;
                    }
                }
                                
                @media (max-width: 1000px) {
                    .submit-buttons {
                        flex-direction: row;
                        gap: 26px;
                    }
                }
                .location span {
                    font-family: 'Inter';
                    font-weight: 400;
                    font-size: 12px;
                    color: #5f5f5f;
                }

                .submit-buttons a {
                    width: 100%;
                    text-align: center;
                    padding: 10px 18px;
                    border: 1px solid #1E202D;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    letter-spacing: 1px;
                    line-height: 20px;
                    color: #1E202D;
                    position: relative;
                }
                
                @media (max-width: 1000px) {
                    .submit-buttons a {
                        padding: 0px 18px;
                    }
                }

                @media (max-width: 650px) {
                    .submit-buttons a {
                        padding: 10px 10px;
                    }
                }

                .submit-buttons a .badge {
                    position: absolute;
                    padding: 5px;
                    background-color: #FFD200;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 10px;
                    line-height: 12px;
                    color: #000;
                    letter-spacing: 0px;
                    top: -12px;
                    left: -21px;
                }
                    
                .submit-buttons a img {
                    margin-right: 5px;
                }
                    
                .submit-buttons a:first-child {
                    gap: 5px;
                    background-color: #1E202D;
                    color: #fff;
                }

                @media (max-width: 650px) {
                    .submit-buttons a span.btn-content {
                        display: none;
                    }
                }

                .job-details {
                    font-family: 'Inter';
                    margin-top: 49px;
                }

                @media (max-width: 750px) {
                    .job-details .title-time-icon .project-title {
                        margin-right: 0px;
                    }   
                }

                @media (max-width: 1000px) {
                    .main-job-content {
                        margin-top: 10px;
                    }
                }

                @media (min-width: 750px) {
                    .main-job-content {
                        min-width: 560px;
                    }
                }

                .main-job-content > div:last-child {
                    flex-grow: 1;
                }

                .job-details {
                    cursor: pointer;
                }
                
                .job-details .title-time-icon .project-title h2 {
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 21px;
                    color: #000;
                    width: 197px;
                    font-family: 'Inter';
                    margin: 0;
                }

                @media (max-width: 1000px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 500px;
                    }
                }

                @media (max-width: 850px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 450px;
                    }
                }

                @media (max-width: 700px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 350px;
                    }
                }

                @media (max-width: 600px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 250px;
                    }
                }

                @media (max-width: 500px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 200px;
                    }
                }

                .job-details .title-time-icon .project-title a {
                    font-weight: 500;
                    font-size: 16px;
                    color: #005cb1;
                }

                p.from-now {
                    font-weight: 400;
                    font-size: 12px;
                    color: #5f5f5f;
                    margin: 0;
                    margin-right: 21px;
                    font-family: 'Inter';
                    width: 80px;
                }

                @media (max-width: 750px) {
                    p.from-now {
                        margin-right: 5px;
                    }
                }
                
                .working-number-type {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 16.8px;
                    color: #5f5f5f;
                }
                    
                .working-number-type .working-number p {
                    margin: 0;
                    font-family: 'Inter';
                    color: #37d002;
                }

                p.type {
                    color: #31c5f3;
                    font-family: 'Inter';
                    margin: 0;
                }

                .usericon-wrapper {
                    width: 24px;
                    margin-left: 30px;
                    margin-right: 30px;
                }

                @media (max-width: 750px) {
                    .usericon-wrapper {
                        margin-right: 5px;
                    }
                }

                .location div {
                    gap: 5px;
                }
                
                .job-description {
                    margin: 30px 70px 30px 57px;
                    transition: height 0.1s;
                    overflow-y: hidden;
                }
                
                .job-description .job-description-row {
                    border-bottom: 1px solid rgba(0, 0, 0, .4);
                }

                .job-description .job-description-row:last-child {
                    border: none;
                }
                
                .job-description .job-description-title {
                    gap: 22px;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 22px;
                    color: #1e202d;
                    font-family: 'Inter', sans-serif;
                    text-align: right;
                    padding: 20px 37px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: end;
                }

                .job-description .job-description-content {
                    padding: 41px 26px;
                }

                .job-description .job-description-content p {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 22px;
                    font-family: 'Inter';
                    color: #555555;
                }

                .job-description .job-description-content h3 {
                    margin: 12px 0;
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 22px;
                    color: #000;
                }
                
                .job-description .company-brief-item {
                    width: 336px;
                }

                .job-description .company-brief h3 {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 22px;
                    color: #000;
                    margin-bottom: 40px;
                }

                .job-description .company-brief h4 {
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 22px;
                    color: #000;
                    margin-bottom: 20px;
                }

                .loader-container {
                    height: 30px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
            <div className="project-item d-flex justify-content-between">
                <div className="common-buttons d-flex justify-content-between">
                    <div className='functional-buttons d-flex'>
                        <a href='#'><ShareOutlinedIcon fontSize='small' color='disabled' /></a>
                        <a href='#'><FavoriteBorderOutlinedIcon fontSize='small' color='disabled' /></a>
                    </div>
                    <div className='submit-buttons'>
                        <a href={project.jobExternalUrl} className='d-flex flex-row align-items-center justify-content-center'>
                            <Image src={"/assets/image/launch.png"} width={14} height={14} />
                            <span className='btn-content'>הגש/י מועמדות</span>
                        </a>
                        <a className='d-flex flex-row align-items-center justify-content-center'>
                            <span className='btn-content'>הגש/י בקליק</span>
                            <span className='badge'>פרמיום</span>
                        </a>
                    </div>
                </div>
                <div className='main-job-content d-flex flex-row'>
                    <div className='job-details d-flex flex-column justify-content-between' onClick={getPosition}>
                        <div className='title-time-icon d-flex flex-row justify-content-end align-items-center'>
                            <div className="project-title">
                                <h2>{project.jobTitle}</h2>
                                <a>{project.companyName}</a>
                            </div>
                        </div>
                        <div className='working-number-type d-flex flex-row justify-content-end align-items-end'>
                            <div className='working-number'>
                                <p>{Number(project.companySize).toLocaleString('en-US')}</p>
                                עובדים
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className='usericon-wrapper'>
                            <Image src={"/assets/image/user-icon.png"} width={17} height={17} />
                        </div>
                    </div>
                    <div className='location d-flex flex-column justify-content-between'>
                        <div className='d-flex flex-row justify-content-between align-items-center'>
                            <span>{project.jobLocation}</span>
                            <div>
                                <RoomIcon fontSize='small' color='disabled' />
                            </div>
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center'>
                            <p className='from-now'>{moment(project.createdAt).fromNow()}</p>
                            <Image src={"/assets/image/Apple_logo_black.svg.png"} width={60} height={64} />
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center gap-'>
                            <p className='type'>{project.companyIndustry}</p>
                            <div>
                                <Image src={"/assets/image/desktop-icon.png"} width={20} height={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && 
                <div className={"loader-div"}>
                    <div className={"loader-container"}>
                        <ClipLoader />
                    </div>
                </div>
            }
            {position && <div className="job-description">
                <div className="job-description-row job-description-title">
                    <h2>תיאור משרה</h2>
                </div>
                <div className="job-description-row job-description-content">
                    {position.jobDescription}
                    <div className="job-description-title">
                        <Image src={"/assets/image/apple 2.png"} width={36} height={36} />
                        <h2>אודות</h2>
                    </div>
                </div>
                <div className="job-description-row job-description-content">
                    <div className="company-brief d-flex flex-row">
                        <div className="company-brief-item">
                            <h4>Industry</h4>
                            <h3>{position.companyIndustry}</h3>
                        </div>
                        <div className="company-brief-item">
                            <h4>Location</h4>
                            <h3>{position.jobLocation}</h3>
                        </div>
                        <div className="company-brief-item">
                            <h4># of Employees</h4>
                            <h3>{Number(position.companySize).toLocaleString('en-US')}</h3>
                        </div>
                    </div>
                    <p>{project.companyAbout}</p>
                </div>
            </div>}
        </>
    )
}