import { Header } from "./Header";
import { useState, useEffect } from "react";

import {SideMenu} from "../menu/Sidemenu";
import * as React from "react";
import Footer from "./Footer";
import ClipLoader from "react-spinners/ClipLoader";

export function Layout({ children, activeItem, user, logout, breadcrumbs, loading, router, clientUrl, serverUrl }) {

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
                    <ClipLoader />
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
            <Header user={user} clientUrl={clientUrl} />
            <SideMenu clientUrl={clientUrl} activeItem={activeItem} user={user} logout={logout}
                router={router} />
            {children}
            <Footer serverUrl={serverUrl} />
        </>
    )
}
