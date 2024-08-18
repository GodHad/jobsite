import Link from "next/link";
import * as React from "react";

export function MobileHeader({clientUrl,}) {
    return (
        <div id="kt_header_mobile" className="header-mobile align-items-center header-mobile-fixed">

            <a href={clientUrl}>
                <img alt="Logo" className="w-45px" src={"/assets/placeholder.jpg"}
                     style={{maxWidth: 115, maxHeight: 40}}/>
            </a>
            <div className="d-flex align-items-center">
                <button className="btn p-0 burger-icon burger-icon-left" id="kt_aside_mobile_toggle" onClick={e => {

                    document.querySelector("#kt_aside").classList.toggle("aside-on")
                }}>
                    <span/>
                </button>

                {/*<button className="btn p-0 burger-icon ml-4" id="kt_header_mobile_toggle">*/}
                {/*    <span></span>*/}
                {/*</button>*/}
                {/*<button className="btn btn-hover-text-primary p-0 ml-2 burger-icon burger-icon-left" id="kt_header_mobile_topbar_toggle" onClick={e => {*/}
                {/*    e.preventDefault();*/}
                {/*    document.querySelector('body').classList.toggle('topbar-mobile-on')*/}
                {/*}}>*/}
                {/*	<span className="svg-icon svg-icon-xl">*/}

                {/*	</span>*/}
                {/*</button>*/}
            </div>
        </div>
    )
}
