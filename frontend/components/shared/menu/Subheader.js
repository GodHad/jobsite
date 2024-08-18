import * as React from "react";

export function Subheader({breadcrumbs=[]}){
    return(



        <div className="subheader py-2 py-lg-4 subheader-solid" id="kt_subheader">
            <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
                <div className="d-flex align-items-center flex-wrap mr-2">

                    {
                        breadcrumbs.map((item, index) => {
                            return (
                                <div className={"d-flex align-items-center flex-wrap mr-2"} key={index}>
                                    {
                                        breadcrumbs.length===1?<h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">{item}</h5>:
                                            index===0?
                                                <>
                                                    <h5 className="text-dark font-weight-bold mt-2 mb-2 mr-5">{item}</h5>
                                                    <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
                                                </>:index===breadcrumbs.length-1?
                                                <span className="text-muted font-weight-bold mr-4">{item}</span>
                                                :<>
                                                    <span className="text-muted font-weight-bold mr-4">{item}</span>
                                                    <div className="subheader-separator subheader-separator-ver mt-2 mb-2 mr-4 bg-gray-200"></div>
                                                </>
                                    }
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>


    )
}