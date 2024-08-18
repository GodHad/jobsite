import Link from "next/link"

export function SavedJobs({savedPositions}) {
    return (
        <div className="row">
            <div className="col-12">
                <div
                    className="job-saved row bg-white p-5 rounded-xl m-1 shadow align-items-center justify-content-center">

                    <div className={"12"}>
                        <h3 className={"m-0"}>Saved Jobs</h3>


                    </div>


                </div>

                {savedPositions && savedPositions.map((savedPosition, index) => {
                    return (
                        <Link href={"/jobs/" + savedPosition.positionId} key={savedPosition.id}>
                            <a>
                                <div className="job-saved row bg-white p-3 rounded-xl m-1 shadow mt-2">
                                    <div
                                        className={"col-12 d-flex flex-direction-column justify-content-start align-items-center"}>
                                        <img className={"mr-3"}
                                             src={savedPosition.companyImageUrl || "/assets/placeholder.jpg"}
                                             style={{width: 50}}/>
                                        <p className={"m-0 font-weight-bold"}>{savedPosition.jobTitle}
                                            <br/>
                                            <small>{savedPosition.companyName}</small>
                                            <br/>
                                            <small>Posted: {savedPosition.createdAt}</small>

                                        </p>
                                    </div>

                                </div>
                            </a>
                        </Link>
                    )
                })}

                <Link href={"saved-jobs"}>
                    <a>
                        <h4 className={"text-center mt-3 font-weight-bld"}>View more saved positions</h4>
                    </a>
                </Link>

            </div>


        </div>
    )
}