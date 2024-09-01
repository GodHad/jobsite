import * as React from "react";
import config from "../../../config/default.js"

const serverUrl = config.domain.server

import Link from "next/link"
import { NotifyComponent } from "../Notify";
import { Requests } from "../../CustomHooks/Requests";

export function Header({ user, clientUrl, router }) {

    async function logout(event) {
        event.preventDefault();


        try {
            const url = `${serverUrl}/auth/logout`
            const data = await Requests('post', url, {}, {})

            window.location.href = "/"

        } catch (error) {
            NotifyComponent('failure', error.message)
        }

    }

    return (
        <>
            <div id="kt_header" className="header header-fixed">
                <div className="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
                    <div id="kt_header_menu" className="header-menu header-menu-mobile header-menu-layout-default">
                        <ul className="menu-nav">
                            <li className="menu-item menu-item-active" aria-haspopup="true">

                                <a href={clientUrl} style={{ backgroundColor: "transparent" }} className="menu-link">
                                    <img src={"/assets/placeholder.jpg"} style={{ maxWidth: 115, maxHeight: 40 }} />
                                </a>


                            </li>
                        </ul>
                    </div>
                </div>


                <div className="container-fluid d-flex align-items-stretch justify-content-between">
                    <div className="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">


                    </div>


                    <div className="topbar">
                        <div className="topbar-item">
                            <a
                                className="btn btn-icon btn-clean btn-lg mr-1"
                                id="kt_quick_panel_toggle"
                                onClick={() => router.back()}
                            >
                                <i className="fas fa-arrow-left text-light"></i>
                            </a>
                        </div>
                        <div className="topbar-item">


                            <a href={clientUrl} className="btn btn-icon btn-clean btn-lg mr-1"
                                id="kt_quick_panel_toggle">
                                <i className="fas fa-home text-light"></i>

                            </a>

                        </div>


                        {user && user.admin ?
                            <>
                                <div className="topbar-item">

                                    <Link href="/admin">
                                        <a className="btn btn-icon btn-clean btn-lg mr-1" id="kt_quick_panel_toggle">
                                            <i className="fas fa-tools text-light"></i>

                                        </a>
                                    </Link>
                                </div>
                            </> : <></>}


                        {user ?
                            <>

                                <div className="topbar-item">
                                    <Link href="/my-applications">
                                        <a className="btn btn-icon btn-clean btn-lg mr-1" id="kt_quick_panel_toggle">
                                            <i className="far fa-file-alt text-light"></i>
                                        </a>
                                    </Link>
                                </div>


                                <div className="topbar-item">
                                    <Link href="/profile">
                                        <a className="btn btn-icon btn-clean btn-lg mr-1" id="kt_quick_panel_toggle">
                                            <i className="fas fa-user-circle text-light"></i>

                                        </a>
                                    </Link>
                                </div>

                                <div className="topbar-item">
                                    <a href={"#"} onClick={logout} className="btn btn-icon btn-clean btn-lg mr-1"
                                        id="kt_quick_panel_toggle">
                                        {/*<i className="fas fa-sign-in-alt text-light"></i>*/}
                                        <i className="fas fa-sign-out-alt text-danger"></i>

                                    </a>
                                </div>


                                <div className="topbar-item">
                                    <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
                                        id="kt_quick_user_toggle">
                                        {/*<span*/}
                                        {/*    className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hi,</span>*/}
                                        {/*<span*/}
                                        {/*    className="text-light-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">{user.firstname}</span>*/}
                                        <span className="symbol symbol-35 symbol-light-success">
                                            <span className="symbol-label font-size-h5 font-weight-bold" style={{
                                                backgroundImage: `url(${user.photoUrl})`
                                            }}>
                                                {/*{user.lastname}*/}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                            </> : <>


                                <div className="topbar-item">
                                    <a href={"/sign-in"} className="btn btn-icon btn-clean btn-lg mr-1"
                                        id="kt_quick_panel_toggle">
                                        {/*<i className="fas fa-sign-in-alt text-light"></i>*/}
                                        <i className="fas fa-sign-in-alt text-info"></i>

                                    </a>
                                </div>


                            </>}


                        {/*<div className="topbar-item">*/}
                        {/*    <a href="/" className="btn btn-icon btn-clean btn-lg mr-1" id="kt_quick_panel_toggle">*/}
                        {/*        <i className="fas fa-suitcase text-light"></i>*/}

                        {/*    </a>*/}
                        {/*</div>*/}


                    </div>


                </div>


            </div>
            <style jsx>
                {`
                  //@media screen and (min-width: 600px) {
                  //    #kt_header, #kt_subheader  {
                  //      display: none;
                  //    }
                  //}                
                `}
            </style>


        </>
    )
}
