import {Header} from "./Header";


import * as React from "react";
import Footer from "./Footer";

export function Layout({children}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
