import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import RoomIcon from '@material-ui/icons/Room';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/he';
moment.locale('he');

export default function ProjectItem({ project }) {
    return (
        <div className="project-item d-flex justify-content-between">
            <style jsx>
                {`
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

                @media (max-width: 650px) {
                    .project-item {
                        margin: 0 10px 28px;
                        flex-direction: column;
                    }
                }

                .common-buttons {
                    flex-direction: column;
                }
                    
                @media (max-width: 650px) {
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
                        
                @media (max-width: 850px) {
                    .submit-buttons {
                        margin-left: 25px;
                    }
                }
                                
                @media (max-width: 650px) {
                    .submit-buttons {
                        flex-direction: row;
                        gap: 26px;
                    }
                }
                .location span {
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
                
                @media (max-width: 650px) {
                    .submit-buttons a {
                        padding: 0px 18px;
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
                    .submit-buttons a:first-child {
                        width: 290px;
                    }
                }

                .job-details {
                    margin-top: 60px;
                }

                .job-details .title-time-icon .project-title {
                    margin-right: 15px;
                }

                @media (max-width: 750px) {
                    .job-details .title-time-icon .project-title {
                        margin-right: 0px;
                    }   
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

                @media (max-width: 650px) {
                    .job-details .title-time-icon .project-title h2 {
                        width: 300px;
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
                    margin-left: 120px;
                }
                    
                .working-number-type .working-number p {
                    margin: 0;
                    font-family: 'Inter';
                    color: #37d002;
                }

                p.type {
                    color: #31c5f3;
                    margin: 0;
                }

                .usericon-wrapper {
                    width: 24px;
                    margin-right: 30px;
                }

                @media (max-width: 750px) {
                    .usericon-wrapper {
                        margin-right: 5px;
                    }
                }
            `}
            </style>
            {/* {project.title} */}
            <div className="common-buttons d-flex justify-content-between">
                <div className='functional-buttons d-flex'>
                    <a href='#'><ShareOutlinedIcon fontSize='small' color='disabled' /></a>
                    <a href='#'><FavoriteBorderOutlinedIcon fontSize='small' color='disabled' /></a>
                </div>
                <div className='submit-buttons'>
                    <a href='#' className='d-flex flex-row align-items-center justify-content-center'>
                        <Image src={"/assets/image/launch.png"} width={14} height={14} />
                        <span>הגש/י מועמדות</span>
                    </a>
                    <a href='#' className='d-flex flex-row align-items-center justify-content-center'>
                        <span>הגש/י בקליק</span>
                        <span className='badge'>פרמיום</span>
                    </a>
                </div>
            </div>
            <div className='main-job-content d-flex flex-row justify-content-between'>
                <div className='job-details d-flex flex-column justify-content-between'>
                    <div className='title-time-icon d-flex flex-row justify-content-end align-items-center'>
                        <div className="project-title">
                            <h2>{project.title}</h2>
                            <a href='#'>{project.username}</a>
                        </div>
                    </div>
                    <div className='working-number-type d-flex flex-row justify-content-between align-items-end'>
                        <div className='working-number'>
                            <p>{project.workingNumber.toLocaleString('en-US')}</p>
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
                        <span>{project.location}</span>
                        <div style={{marginRight: 18}}>
                            <RoomIcon fontSize='small' color='disabled' />
                        </div>
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <p className='from-now'>{moment(project.created).fromNow()}</p>
                        <Image src={project.icon} width={60} height={64} />
                    </div>
                    <div className='d-flex flex-row justify-content-between align-items-center'>
                        <p className='type'>{project.type}</p>
                        <div style={{marginRight: 18}}>
                            <Image src={"/assets/image/desktop-icon.png"} width={20} height={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}