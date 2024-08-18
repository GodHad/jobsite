import Image from "next/image";
import React from 'react'

export function CommonContent () {
    return (
        <>  
            <style jsx>
                {`
                    .common-content {
                        position: relative;
                    }

                    .common-content .description {
                        padding: 74px;
                        box-shadow: 0 0 20px 50px rgba(255, 255, 255, 0.15);
                        background-color: rgba(255, 255, 255, .15);
                        backdrop-filter: blur(10px);
                        position: absolute;
                        width: 100%;
                        bottom: 0px;
                        gap: 80px;
                    }

                    @media (max-width: 1200px) {
                        .common-content .description {
                            padding: 30px;
                            gap: 40px;
                        }
                    }

                    @media (max-width: 800px) {
                        .common-content .description {
                            padding: 10px;
                            gap: 20px;
                        }
                    }
                `}
            </style>
            <div className="common-content">
                <Image src={'/assets/image/homepage - gettyimages 1.png'} width={1680} height={785} />
                <div className="description d-flex flex-row">
                    <Item icon={'chart'} number={"1300+"} title={"Jobs Posted"} />
                    <Item icon={'bag'} number={"3k+"} title={"Companies"} />
                </div>
            </div>
        </>
    )
}

function Item({icon, number, title}) {
    return (
        <>
            <style jsx>
                {`
                    .icon {
                        padding: 5px;
                        background-color: white;
                        opacity: .4;
                        margin-right: 40px;
                        border-radius: 30%;
                    }

                    @media (max-width: 1200px) {
                        .icon {
                            margin-right: 20px;
                        }
                    }
                        
                    .item-description {
                        font-family: Nunito;
                        color: white;
                    }


                    .item-description .item-number {
                        font-weight: 800;
                        font-size: 30px;
                        margin: 0;
                    }

                    .item-description .item-title {
                        font-weight: 400;
                        font-size: 20px;
                        margin: 0;
                    }
                    
                    @media (max-width: 800px) {
                        .item-description .item-number {
                            font-size: 20px;
                        }

                        .item-description .item-title {
                            font-size: 15px;
                        }
                    }
                `}
            </style>
            <div className="d-flex flex-row gap-3 align-items-center">
                <div className="icon">
                    {
                        icon === 'chart' 
                            ? 
                        <svg width="30px" height="23px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#130F26" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M12 3L12 21" stroke="#323232" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17 7L17 21" stroke="#323232" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M7 10L7 21" stroke="#323232" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> 
                            :
                        <div className="d-flex flex-column">
                            <svg width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.1091 3.78247C11.3441 3.025 12.181 2.46301 13.1648 2.46301H16.9531C17.9369 2.46301 18.7739 3.025 19.0088 3.78247H11.1091ZM24.1481 3.78169H21.2408C20.9618 2.0106 19.1557 0.630371 16.9532 0.630371H13.1648C10.9623 0.630371 9.15622 2.0106 8.87723 3.78169H5.98457C2.90102 3.78169 0.390137 5.87036 0.390137 8.43539C0.390137 8.43539 0.463554 10.4386 0.507605 11.0615C0.507605 11.1836 0.581023 11.2936 0.698491 11.3546L2.10811 12.1608C4.5309 13.4812 7.36335 14.4253 10.3559 14.8968C10.5512 14.9274 10.742 14.8455 10.8434 14.7038C11.7141 13.4983 13.3087 12.7227 15.059 12.7227C16.821 12.7227 18.401 13.5068 19.2468 14.7112C19.3466 14.8553 19.5404 14.9396 19.7372 14.9078C22.7547 14.4376 25.5871 13.4922 28.0246 12.1486C28.0833 12.1242 28.7294 11.7699 29.4357 11.3412C29.5517 11.2704 29.6221 11.1531 29.6251 11.0334C29.6545 9.52126 29.7426 8.43539 29.7426 8.43539C29.7426 5.87036 27.2317 3.78169 24.1481 3.78169Z" fill="#230B34"/>
                            </svg>
                            <svg width="29" height="12" viewBox="0 0 29 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M28.6483 0.665826C28.619 0.677656 28.5897 0.689486 28.5897 0.689486C25.6296 2.27476 22.0687 3.32766 18.332 3.76539C17.8044 3.82454 17.2769 3.55244 17.1304 3.12655C16.808 2.15646 15.7676 1.51761 14.522 1.51761H14.5073H14.478C13.2324 1.51761 12.192 2.15646 11.8696 3.12655C11.7231 3.55244 11.1956 3.82454 10.668 3.76539C6.93128 3.32766 3.37039 2.27476 0.410308 0.689486C0.395654 0.677656 0.249116 0.606674 0.131885 0.665826C0 0.724978 0 0.866942 0 0.866942L0.102577 6.90044C0.102577 9.38483 2.59373 11.396 5.67105 11.396H23.3143C26.3916 11.396 28.8828 9.38483 28.8828 6.90044L29 0.866942C29 0.866942 29 0.724978 28.8681 0.665826C28.7948 0.630334 28.7069 0.642165 28.6483 0.665826Z" fill="#230B34"/>
                            </svg>
                            </div>                            
                    }
                </div>
                <div className="item-description">
                    <h3 className="item-number">
                        {number}
                    </h3>
                    <h3 className="item-title">
                        {title}
                    </h3>
                </div>
            </div>
        </>
    )
}