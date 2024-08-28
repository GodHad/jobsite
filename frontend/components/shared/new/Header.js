import * as React from "react";
import Image from 'next/image';
import Link from "next/link";

export function Header({ user, clientUrl }) {

    return (
        <>
            <style jsx>
                {`
                .new-header {
                    background-color: #1e202d !important;
                    padding: 20px 52px;
                    display: flex;
                    justify-content: space-between;
                    letter-spacing: 3px;
                    font-family: 'Inter', 'Noto Sans Hebrew', 'Alef', sans-serif;
                }
                
                .new-header .logo {
                    display: flex;
                    gap: 24px;
                    flex-direction: row;
                    align-items: center;
                    font-family: Nunito;
                }

                .new-header .logo .logo-title {
                    font-weight: 700;
                    font-size: 20px;
                    line-height: 27px;
                    color: #fffcfc;
                    margin: 0;
                }

                .new-header .all-jobs-btn {
                    margin-top: 20px;
                }

                .new-header .all-jobs-btn a {
                    color: #fffcfc;
                    font-weight: 700;
                    font-size: 14px;
                }

                button.nav-menu {
                    background-color: transparent;
                    border: none;
                }

                @media (max-width: 560px) {
                    .new-header {
                        padding: 10px 15px;
                    }
                }
            `}
            </style>
            <div className="new-header">
                <a href={clientUrl} style={{ backgroundColor: "transparent" }} className="logo">
                    <Image src="/assets/image/logo.png" width="17" height="37" alt="Logo" />
                    <p className="logo-title">AUTOFLY</p>
                </a>
                <div className="d-flex flex-row justify-content-center align-items-center" style={{ gap: '60px' }}>
                    <div className="all-jobs-btn d-flex flex-column justify-content-center align-items-center">
                        <div>
                            <Image src="/assets/image/all-jobs.png" width="50" height="45" alt="all jobs" />
                        </div>
                        <Link href={"/jobs"}><a>כל המשרות</a></Link>
                    </div>
                    <button className="nav-menu" onClick={e => { document.querySelector("#kt_aside").classList.toggle("aside-on") }}>
                        <svg width="47px" height="47px" viewBox="0 0 20.00 20.00" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="2">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier"> <path fill="#000000" fillRule="evenodd" d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z" /> </g>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}
