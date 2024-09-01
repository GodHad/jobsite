import {MobileHeader} from "./MobileHeader";
import {Header} from "./Header";
import {Subheader} from "./Subheader";
import {SideMenu} from "./Sidemenu";
import {useEffect} from 'react'
import {useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";


import * as React from "react";

export function Layout({children, activeItem, user, logout, breadcrumbs, loading, router, clientUrl}) {


    const [ready, setReady] = useState(false)
    useEffect(() => {
        document.querySelector("body").classList.add(
            "header-fixed", "header-mobile-fixed", "subheader-enabled", "subheader-fixed", "aside-enabled", "aside-fixed"
        )
        document.querySelector("body").id = "kt_body"
        setReady(true)
    }, []);


    if (loading === true || ready === false) {
        return (

            <div className={"loader-div"}>
                <div className={"loader-container"}>
                    <ClipLoader/>
                </div>

                <style jsx>{`
                  .loader-container {
                    height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }

                `}</style>

            </div>
        )
    }

    return (
        <>
            <MobileHeader clientUrl={clientUrl}/>
            <Header user={user} clientUrl={clientUrl} router={router} />
            <div className="d-flex flex-column flex-root">
                <div className="d-flex flex-row flex-column-fluid page">
                    <SideMenu clientUrl={clientUrl} activeItem={activeItem} user={user} logout={logout}
                              router={router}/>

                    <div className="d-flex flex-column flex-row-fluid wrapper" id="kt_wrapper">

                        <div className="content d-flex flex-column flex-column-fluid" id="kt_content">
                            {/*<Subheader breadcrumbs={breadcrumbs}/>*/}


                            <div className="d-flex flex-column-fluid">
                                <div className="container-fluid">
                                    {children}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
