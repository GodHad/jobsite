import Link from "next/link"
import { Requests } from "../../CustomHooks/Requests";
import { NotifyComponent } from "../Notify";
import config from "../../../config/default.js"

const serverUrl = config.domain.server

export function SideMenu({ user, router, clientUrl }) {

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
            <div className="aside aside-left aside-fixed d-flex flex-column flex-row-auto" id="kt_aside">
                <div className="brand flex-column-auto" id="kt_brand">
                    <a href={clientUrl} className="brand-logo">
                        {/*<img alt="Logo" className="w-65px" src="/22a.png"/>*/}
                    </a>
                </div>
                <div className="aside-menu-wrapper flex-column-fluid" id="kt_aside_menu_wrapper">
                    <div id="kt_aside_menu" className="aside-menu my-4" data-menu-vertical="1" data-menu-scroll="1"
                        data-menu-dropdown-timeout="500">
                        <ul className="menu-nav">
                            <li className={"menu-item "} aria-haspopup="true">

                                <Link href={"/jobs"}>
                                    <a className="menu-link" href={"#"}
                                        onClick={e => {
                                            router.push('/jobs');
                                            document.querySelector('#kt_aside').classList.remove('aside-on')
                                        }}>
                                        <i className="menu-icon fas fa-home"></i>
                                        <span className="menu-text">Home</span>
                                    </a>
                                </Link>

                            </li>

                            {user ?
                                <>
                                    {user.admin ?
                                        <li className="menu-item profile" aria-haspopup="true">
                                            {/*<Link href={"/admin"}>*/}
                                            <a className="menu-link" href={"#"}
                                                onClick={e => {
                                                    router.push('/admin');
                                                    document.querySelector('#kt_aside').classList.remove('aside-on')
                                                }}>
                                                <i className="menu-icon fas fa-tools "></i>
                                                <span className="menu-text">Admin</span>
                                            </a>
                                            {/*</Link>*/}

                                        </li> : <></>
                                    }


                                    <li className="menu-item profile" aria-haspopup="true">
                                        <Link href={"/my-applications"}>
                                            <a className="menu-link"
                                                onClick={e => {
                                                    //    router.push('/my-applications');
                                                    document.querySelector('#kt_aside').classList.remove('aside-on')
                                                }}>
                                                <i className="menu-icon far fa-file-alt "></i>
                                                <span className="menu-text">My Applications</span>
                                            </a>
                                        </Link>

                                    </li>


                                    <li className="menu-item profile" aria-haspopup="true">
                                        <Link href={"/profile"}>
                                            <a className="menu-link"
                                                onClick={e => {
                                                    document.querySelector('#kt_aside').classList.remove('aside-on')
                                                }}>
                                                <i className="menu-icon fas fas fa-user-circle "></i>
                                                <span className="menu-text">Profile</span>
                                            </a>
                                        </Link>

                                    </li>

                                    <li className="menu-item profile" aria-haspopup="true">
                                        <a href={"#"} className="menu-link" onClick={logout}>
                                            <i className="menu-icon fas fa-sign-out-alt"></i>
                                            <span className="menu-text">Sign Out</span>
                                        </a>

                                    </li>
                                </> :
                                <li className="menu-item profile" aria-haspopup="true">
                                    {/*<Link href={"/sign-in"}>*/}
                                    <a className="menu-link" href={"/sign-in"}>
                                        <i className="menu-icon fas fa-sign-in-alt "></i>
                                        <span className="menu-text">Sign In</span>
                                    </a>
                                    {/*</Link>*/}

                                </li>

                            }


                        </ul>
                    </div>
                </div>
            </div>

        </>
    )
}
