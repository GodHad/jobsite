import Link from "next/link"
import {useState} from "react";
import * as moment from "moment";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../state";

export function JobsFeed({
                             jobs,
                             _metadata,
                             _getJobs,
                             serverUrl,
                             user,
                             savedPositionsIds,
                             _savePosition,
                             _unsavePosition, _applyFilters
                         }) {
    const [shownMenu, setShownMenu] = useState(null)

    const dispatch = useDispatch()
    const {
        updateIndustry, updateLocation, updateTitle, reset, updatePageSize, updatePage
    } = bindActionCreators(actionCreators, dispatch)

    return (

        <div className={"row"}>
            {jobs.map((position, index) => {
                return (
                    <div className={"w-100"} key={position.id}>
                        <div className="col-12 " key={index}>
                            <div className="row bg-white rounded-xl m-1 shadow  p-3">
                                <div className="col-12 job-detail">
                                    <Link key={index} href={"/jobs/" + position.id}>
                                        <a>
                                            <div className="job-detail-left">

                                                <div style={{display: "inline-block"}} className={"mr-5"}>
                                                    <img src={position.companyImageUrl || "/assets/placeholder.jpg"}
                                                         style={{width: 50}}/>
                                                </div>
                                                <div style={{display: "inline-block"}}>
                                                    {/*<a href={"#"}>*/}
                                                    <h4 className={"mb-1"}>{position.jobTitle}</h4>
                                                    {/*</a>*/}

                                                    <p className={"mb-1"}><span
                                                        className={"text-success"}>{position.companyName}</span></p>


                                                    <p className={"m-0 text-muted"}>
                                                        <i className="fas fa-map-marker-alt mr-1"></i>
                                                        {position.jobLocation}</p>
                                                </div>


                                            </div>
                                        </a>
                                    </Link>


                                    <div className="job-detail-left">
                                        <div style={{display: "inline-block"}} className={"text-right"}>
                                            {/*<a href={"#"} className={"btn btn-sm btn-outline-light"}>*/}
                                            {/*    <i className="fas fa-save text-dark"></i>*/}
                                            {/*</a>*/}

                                            {/*{shownMenu === index ?*/}
                                            <div className={"d-flex"}>
                                                <div>
                                                    {position.jobApplicationType === "external" ?


                                                        <a className={"btn btn-dark  btn-sm"}
                                                           href={position.jobExternalUrl} target={"_blank"}
                                                           rel={"noopener nofollow noreferrer"}>Apply
                                                            <i className="fas fa-external-link-alt ml-1"/></a> :
                                                        <Link href={"/jobs/" + position.id}>
                                                            <a className={"btn btn-dark  btn-sm"}
                                                            >Easy Apply
                                                                <i className="fas fa-external-link-alt ml-1"/></a>
                                                        </Link>}
                                                </div>


                                                <div>
                                                    {user ?
                                                        <div className={"ml-3"}>
                                                            {savedPositionsIds.includes(position.id) ?

                                                                <>
                                                                    <button
                                                                        className={"btn btn-outline-light  btn-sm  "}
                                                                        onClick={() => _unsavePosition(position.id)}> Saved
                                                                        <i className="fas fa-check-double text-success"/>
                                                                    </button>
                                                                </> :

                                                                <button
                                                                    className={"btn btn-outline-primary btn-sm   "}
                                                                    onClick={() => _savePosition(position.id)}>Save
                                                                    <i className="far fa-save ml-4"/></button>}
                                                        </div>
                                                        :
                                                        <></>

                                                    }
                                                </div>


                                            </div>

                                            {/*:*/}
                                            {/*<button className={"btn btn-outline-dark  btn-sm "}*/}
                                            {/*        onClick={() => setShownMenu(index)}*/}
                                            {/*>*/}
                                            {/*    /!*<i className="fas fa-share"></i>*!/*/}
                                            {/*    <i className="fas fa-ellipsis-h"/>*/}
                                            {/*</button>*/}
                                            {/*}*/}


                                            <p className={"mb-1 text-dark mt-1"}>{moment(position.createdAt).local().fromNow()}</p>
                                            {/*<p className={"m-0 text-muted"}>*/}
                                            {/*    approx. 120 000 USD</p>*/}
                                        </div>
                                    </div>


                                </div>
                            </div>


                        </div>
                    </div>
                )
            })}

            <div className={"text-center col-12 paginate-section"}>
                <p className={"mt-2 text-center pr-5"}>Page {_metadata.page} of {_metadata.page_count} total
                    pages, {_metadata.total_count} total items found</p>

                {/*FIRST PAGE*/}
                {_metadata.links[2].previous ?
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary "}
                            onClick={(event) => {
                                _applyFilters(event, 1)
                                // _getJobs.bind(event, {url: serverUrl + _metadata.links[1].first})
                            }}>
                        <i className="fas fa-angle-double-left"/>
                    </button>
                    :
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary "}
                            disabled><i className="fas fa-angle-double-left"/></button>
                }

                {/*PREVIOUS PAGE*/}
                {_metadata.links[2].previous ?
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"}
                            onClick={(event) => {
                                _applyFilters(event, _metadata.page - 1)
                                // _getJobs.bind(event, {url: serverUrl + _metadata.links[2].previous})
                            }}>
                        <i
                            className="fas fa-caret-left"/></button> :
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"} disabled>
                        <i
                            className="fas fa-caret-left"/></button>}

                {/*NEXT PAGE*/}
                {_metadata.links[3].next ?
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"}
                            onClick={(event) => {
                                _applyFilters(event, _metadata.page + 1)
                                // _getJobs.bind(event, {url: serverUrl + _metadata.links[3].next})
                            }}>
                        <i className="fas fa-caret-right"/></button> :
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"} disabled>
                        <i
                            className="fas fa-caret-right"/></button>}
                {/*LAST PAGE*/}
                {_metadata.links[3].next ?
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"}
                            onClick={(event) => {
                                _applyFilters(event, _metadata.page_count)
                                // _getJobs.bind(event, {url: serverUrl + _metadata.links[4].last})
                            }}>
                        <i className="fas fa-angle-double-right"/></button>
                    :
                    <button className={"btn-sm mr-1 btn btn-icon btn-primary"} disabled>
                        <i className="fas fa-angle-double-right"/></button>
                }


            </div>


            <style jsx>
                {`
                  .job-detail-left {
                    display: flex;
                    align-items: center;
                  }

                  .job-detail {
                    display: flex;
                    justify-content: space-between;
                  }
                `}
            </style>

        </div>
    )
}
