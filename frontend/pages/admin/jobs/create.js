import {Layout} from "../../../components/shared/menu/Layout";
import {useEffect, useState} from "react";
import {Requests} from "../../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../../components/shared/Notify";
import {getFormInputValues} from "../../../components/get-named-inputs-values";
import {JobDescriptionEditor} from "../../../components/pages/admin/JobDescriptionEditor"

import draftToHtml from 'draftjs-to-html';
import Image from "next/image"


export default function AdminJobCreate({user, serverUrl, router}) {
    const [companyIndustries, setCompanyIndustries] = useState([])
    const [jobLocations, setJobLocations] = useState([])
    const [editorState, setEditorState] = useState(false)
    const [contentHTML, setContentHTML] = useState(null)

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

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function createPosition(event) {
        try {
            event.preventDefault()
            const url = `${serverUrl}/system/position`
            const body = getFormInputValues(event)
            if (body.jobApplicationType === "external" && (!body.jobExternalUrl || body.jobExternalUrl === "")) throw new Error("Job External Url is required for selected application type")
            body.jobDescription = contentHTML;
            await Requests('post', url, {}, body)

            NotifyComponent('success', 'Success')

            await router.push('/admin')

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    useEffect(() => {
        getPositionParams()
    }, [])

    return (
        <>
            <Layout loading={false} activeItem={"profile"} breadcrumbs={["Jobs", "Index"]} user={user} router={router}>
                <div className="row">


                    <div className={"col-md-9 col-12 mx-auto main-column"}>
                        <h1 className={"text-center"}> Create Position</h1>
                        {/*<div className="card bg-transparent">*/}


                        {/*<div className="card-body">*/}

                        <form onSubmit={createPosition}>
                            <label>Job Title</label>
                            <input name={"jobTitle"} type="text" className="form-control mb-3"/>

                            <label>Job External Url (Optional)</label>
                            <input name={"jobExternalUrl"} type="text" className="form-control mb-3"
                            />

                            <label>Job Application Type</label>
                            <select name={"jobApplicationType"} className={"form-control mb-3"}>

                                <option value={"external"}>External</option>
                                <option value={"internal"}>Internal</option>
                            </select>

                            <label>Job Location</label>
                            <select name={"jobLocation"} className="form-control mb-3">
                                {
                                    jobLocations.map((item, index) => {
                                        return <option key={index} value={item}>{item}</option>
                                    })
                                }
                            </select>

                            <label>Job Description</label>
                            {/*<textarea name={"jobDescription"} type="text" className="form-control mb-3"  />*/}

                            <div className={"bg-white p-1"}>
                                <JobDescriptionEditor editorState={editorState}
                                                      onEditorStateChange={onDescriptionEditorStateChange}
                                                      onEditorChange={onDescriptionEditorChange}/>
                            </div>

                            {/*<label>Job Requirements</label>*/}
                            {/*<textarea name={"jobRequirements"} type="text" className="form-control mb-3"  />*/}

                            <label>Company Name</label>
                            <input name={"companyName"} type="text" className="form-control mb-3"/>

                            <label>Company Size</label>
                            <input name={"companySize"} type="text" className="form-control mb-3"/>


                            <label>Company Image Url</label>
                            <input name={"companyImageUrl"} type="text" className="form-control mb-3" onChange={e => {
                                e.preventDefault();
                                document.querySelector("#company-image-url").src = e.target.value;
                            }}/>
                            <img id={"company-image-url"} src={""} style={{maxWidth: 150, maxHeight: 150}}
                                 className={"d-block m-auto"}/>

                            <label>Company Industry</label>
                            <select name={"companyIndustry"} className="form-control mb-3">
                                {
                                    companyIndustries.map((item, index) => {
                                        return <option key={index} value={item}>{item}</option>
                                    })
                                }
                            </select>

                            <label>Company About</label>
                            <textarea name={"companyAbout"} type="text" className="form-control mb-3"/>

                            {/*<label>Publish Date</label>*/}
                            {/*<input name={"publishDate"} type="text" className="form-control mb-3"  />*/}


                            <button className="btn btn-dark btn-sm btn-block" type={"submit"}>
                                Create
                            </button>
                        </form>
                        {/*</div>*/}
                        {/*</div>*/}


                        {/*<DisplayRichText html={contentHTML}/>*/}


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