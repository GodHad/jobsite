import {Layout} from "../../../../components/shared/menu/Layout";
import {useEffect, useState} from "react";
import {Requests} from "../../../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../../../components/shared/Notify";
import {getFormInputValues} from "../../../../components/get-named-inputs-values";
import {JobDescriptionEditor} from "../../../../components/pages/admin/JobDescriptionEditor";
import {EditorState, ContentState} from 'draft-js';

import Image from "next/image"

import draftToHtml from "draftjs-to-html";

let htmlToDraft;


export default function AdminJobEdit({user, serverUrl, query, router}) {
    const [companyIndustries, setCompanyIndustries] = useState([])
    const [jobLocations, setJobLocations] = useState([])
    const [position, setPosition] = useState({})

    const [editorState, setEditorState] = useState(false)
    const [contentHTML, setContentHTML] = useState(null)

    const [defaultContentState, setDefaultContentState] = useState(null)
    const [hiTech, setHiTech] = useState(false);

    function onDescriptionEditorStateChange(EditorState) {
        setEditorState(EditorState)

    }

    function onDescriptionEditorChange(RawDraftContentState) {
        const html = draftToHtml(RawDraftContentState);
        setContentHTML(html)
    }

    async function getPositionParams() {
        try {
            const url = `${serverUrl}/system/position/params`
            const {companyIndustries, jobLocations} = await Requests('get', url)

            setCompanyIndustries(companyIndustries);
            setJobLocations(jobLocations);

            const getPositionUrl = `${serverUrl}/system/position/${query.id}`
            const position = await Requests('get', getPositionUrl)
            setContentHTML(position.jobDescription)
            setPosition(position)
            setHiTech(position.hiTech)

            const blocksFromHtml = htmlToDraft(position.jobDescription);
            const {contentBlocks, entityMap} = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);


            setEditorState(editorState)


        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function updatePosition(event) {
        try {
            event.preventDefault()
            const url = `${serverUrl}/system/position`
            const body = getFormInputValues(event)
            if (body.jobApplicationType === "external" && (!body.jobExternalUrl || body.jobExternalUrl === "")) throw new Error("Job External Url is required for selected application type")
            body.jobDescription = contentHTML;
            body.companyImageUrl = body.companyImageUrl === "" ? null : body.companyImageUrl
            body.hiTech = hiTech;
            await Requests('put', url, {}, body)

            NotifyComponent('success', 'Success')

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    useEffect(() => {
        htmlToDraft = require('html-to-draftjs').default
        getPositionParams()
    }, [])

    if (!position) return <Layout loading={true}/>

    return (
        <>
            <Layout loading={false} activeItem={"profile"} breadcrumbs={["Jobs", "Index"]} user={user} router={router}>
                <div className="row">


                    <div className={"col-md-9 col-12 mx-auto main-column"}>
                        <h1 className={"text-center"}> Edit Position</h1>
                        {/*<div className="card">*/}


                        {/*    <div className="card-body">*/}

                        <form onSubmit={updatePosition}>
                            <input type={"hidden"} name={"id"} defaultValue={position.id}/>
                            <label>Job Title</label>
                            <input name={"jobTitle"} type="text" className="form-control mb-3"
                                   defaultValue={position.jobTitle}/>

                            <label>Job External Url (Optional)</label>
                            <input name={"jobExternalUrl"} type="text" className="form-control mb-3"
                                   defaultValue={position.jobExternalUrl}/>

                            <label>Job Application Type</label>
                            <select name={"jobApplicationType"} className={"form-control mb-3"}>
                                <option value={position.jobApplicationType}>{position.jobApplicationType}</option>
                                <option value={"external"}>External</option>
                                <option value={"internal"}>Internal</option>
                            </select>

                            <label>Job Location</label>
                            <select name={"jobLocation"} className="form-control mb-3">
                                <option value={position.jobLocation}>{position.jobLocation}</option>
                                {
                                    jobLocations.map((item, index) => {
                                        return (<option key={index} value={item}>{item}</option>)
                                    })
                                }
                            </select>

                            <label>Job Description</label>
                            {/*<textarea name={"jobDescription"} type="text" className="form-control mb-3" defaultValue={position.jobDescription} />*/}
                            <div className={"bg-white p-1"}>
                                <JobDescriptionEditor
                                    editorState={editorState}
                                    onEditorStateChange={onDescriptionEditorStateChange}
                                    onEditorChange={onDescriptionEditorChange}
                                    // defaultContentState={defaultContentState}
                                />
                            </div>

                            {/*<label>Job Requirements</label>*/}
                            {/*<textarea name={"jobRequirements"} type="text" className="form-control mb-3" defaultValue={position.jobRequirements} />*/}

                            <label>Company Name</label>
                            <input name={"companyName"} type="text" className="form-control mb-3"
                                   defaultValue={position.companyName}/>

                            <label>Company Size</label>
                            <input name={"companySize"} type="text" className="form-control mb-3"
                                   defaultValue={position.companySize}/>

                            <label>Company Image Url</label>
                            <input name={"companyImageUrl"} type="text" className="form-control mb-3"
                                   defaultValue={position.companyImageUrl} onChange={e => {
                                e.preventDefault();
                                document.querySelector("#company-image-url").src = e.target.value;
                            }}/>
                            <img id={"company-image-url"} src={position.companyImageUrl}
                                 style={{maxWidth: 150, maxHeight: 150}} className={"d-block m-auto"}/>

                            <label>Company Industry</label>
                            <select name={"companyIndustry"} className="form-control mb-3">
                                <option value={position.companyIndustry}>{position.companyIndustry}</option>
                                {
                                    companyIndustries.map((item, index) => {
                                        return (<option key={index} value={item}>{item}</option>)
                                    })
                                }
                            </select>

                            <label>Company About</label>
                            <textarea name={"companyAbout"} type="text" className="form-control mb-3"
                                      defaultValue={position.companyAbout}/>

                            {/*<label>Publish Date</label>*/}
                            {/*<input name={"publishDate"} type="text" className="form-control mb-3" defaultValue={position.publishDate}  />*/}
                            <div className="d-flex flex-row align-items-center">
                                <label>Hi-Tech</label>
                                <input name={"hiTech"} type="checkbox" className="form-control ml-3" checked={hiTech} onChange={(e) => setHiTech(e.target.checked)} style={{width: '12px'}} defaultChecked={hiTech} />
                            </div>

                            <button className="btn btn-dark btn-sm btn-block" type={"submit"}>
                                Update
                            </button>
                        </form>
                        {/*    </div>*/}
                        {/*</div>*/}


                    </div>
                </div>
            </Layout>


            <style jsx>{` .main-column {
              max-width: 1200px
            }

            label {
              text-transform: uppercase;
              font-weight: 600;
              font-size: 80%;
              margin: 0;
            }`}</style>

        </>
    )
}