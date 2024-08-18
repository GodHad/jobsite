import Image from "next/image"
import {Layout} from "../../../components/shared/menu/Layout";
import {useEffect, useState} from "react";
import {Requests} from "../../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../../components/shared/Notify";
import {DisplayRichText} from "../../../components/pages/admin/DisplayRichText";
import Link from "next/link"
import {getFormInputValues} from "../../../components/get-named-inputs-values";
import Head from "next/head"

export default function ViewJobPage({user, router, serverUrl, query}) {
    const [position, setPosition] = useState(null)
    const [selectedFilename, setSelectedFileName] = useState(null)
    const [applied, setApplied] = useState(false)
    const [saved, setSaved] = useState(false)

    async function getPosition() {
        try {
            const {data, applied, saved} = await Requests("get", serverUrl + "/position/" + query.id)
            setPosition(data)
            setApplied(applied)
            setSaved(saved)
        } catch (error) {
            NotifyComponent("failure", error.message)
        }
    }

    useEffect(() => {
        getPosition()
    }, [])

    async function savePosition() {
        try {
            const url = `${serverUrl}/saved-position/` + query.id
            const data = await Requests('post', url, {}, {})

            NotifyComponent('success', "Success")

            getPosition()

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function unsavePosition() {
        try {
            const url = `${serverUrl}/saved-position/` + query.id
            const data = await Requests('delete', url)

            NotifyComponent('success', "Success")

            getPosition()

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function createApplication(event) {
        try {
            event.preventDefault()
            const body = getFormInputValues(event);
            const files = document.querySelector('#file-input').files;
            const formData = new FormData()
            formData.append('file', files[0])

            for (const [key, value] of Object.entries(body)) {
                if (key === 'file') continue;
                else if (key && value) {
                    formData.append(key, value)
                }

            }

            const url = `${serverUrl}/position/${query.id}/application`
            await Requests('post-form-data', url, {}, formData)

            getPosition()

            NotifyComponent('success', 'Success')
        } catch (error) {
            NotifyComponent('failure', error.message.includes(',') && error.message.split(',')[0] || error.message)
        }

    }


    if (!position) return <Layout loading={true}/>

    return (
        <>
            <Head>
                <title>Jobs - {position.jobTitle}</title>
            </Head>
            <Layout loading={false} activeItem={"jobsIndex"} breadcrumbs={["Jobs", "Index"]} user={user}
                    router={router}>
                <div className="row m-auto" style={{maxWidth: 950}}>


                    <div className={"col-12 rounded-xl bg-white border pt-6 pl-4 pb-6 mb-3"}>

                        <img src={position.companyImageUrl || "/assets/placeholder.jpg"}
                             style={{maxWidth: 50, maxHeight: 50}} className={"mb-4"}/>

                        <h1>{position.jobTitle}</h1>
                        <p className={"text-capitalize"}>

                            <i className="fas fa-briefcase text-dark mr-4"></i>
                            {position.companyName} - {position.jobLocation} - {position.createdAt}</p>

                        <p className={"text-capitalize"}>

                            <i className="far fa-building text-dark mr-4"></i>
                            {position.companySize} employees - {position.companyIndustry}</p>


                        {position.jobApplicationType === "external" ?


                            <a className={"btn btn-primary rounded-xl mr-4 btn-sm"}
                               href={position.jobExternalUrl} target={"_blank"}
                               rel={"noopener nofollow noreferrer"}>Apply
                                <i className="fas fa-external-link-alt ml-1"></i></a> :
                            <>
                                {user ?

                                    <a className={"btn btn-primary rounded-xl mr-4 btn-sm"}
                                       href={"#apply"}>Easy Apply
                                        <i className="fas fa-external-link-alt ml-4"></i></a>
                                    :
                                    <Link href={"/sign-in?next=" + "/jobs/" + query.id}>
                                        <a className={"btn btn-primary rounded-xl mr-4 btn-sm"}
                                        >Easy Apply
                                            <i className="fas fa-external-link-alt ml-4"></i></a>
                                    </Link>
                                }


                            </>
                        }


                        {user && user.admin ?
                            <Link href={"/admin/jobs/" + query.id + "/edit"}>
                                <a style={{
                                    position: "absolute", top: 0, right: 0
                                }} className={"btn btn-inforounded-xl mr-4"} href={"#"}>
                                    <i className="far fa-edit text-info"></i></a>
                            </Link> : <></>

                        }

                        {user ?
                            <>
                                {saved ?

                                    <>
                                        <button className={"btn btn-outline-light  btn-sm rounded-xl "}
                                                onClick={unsavePosition}> Saved
                                            <i
                                                className="fas fa-check-double text-success"></i>
                                        </button>
                                    </> :

                                    <button className={"btn btn-outline-primary rounded-xl btn-sm"}
                                            onClick={savePosition}>Save
                                        <i className="far fa-save ml-4"></i></button>}
                            </>
                            :
                            <></>

                        }


                    </div>


                    <div className={"col-12 rounded-xl bg-white border pt-6 pl-4 pb-6 mb-3"}>
                        <h4>About the job</h4>

                        <DisplayRichText html={position.jobDescription}/>


                    </div>


                    <div className={"col-12 rounded-xl bg-white border pt-6 pl-4 pb-6 mb-3"}>
                        <h4>About the company</h4>
                        <div className={"company-about"}>
                            <img src={position.companyImageUrl || "/assets/placeholder.jpg"}
                                 style={{maxWidth: 50, maxHeight: 50}} className={"mb-4 mr-4"}/>
                            <p>
                                <span>{position.companyName}</span>

                            </p>
                        </div>

                        <p className={"text-muted"}>
                            <span>{position.companyName} - {position.companySize} employees </span>
                        </p>

                        <p>
                            {position.companyAbout}
                        </p>


                    </div>

                    {!user ?
                        <></> :
                        <>
                            {
                                position.jobApplicationType === "internal" ?
                                    <div className={"col-12 rounded-xl bg-white border  mb-3 p-0"}>

                                        {user ?
                                            applied ?
                                                // <Link href={"/sign-in?next=" + "/jobs/" + query.id}>
                                                //     <a className={"font-weight-bold"}>
                                                <div className={"blurred rounded-xl"}>
                                                    <h1 className={"text-center"}>
                                                        <i className="fas fa-check-double text-success mr-4"></i>
                                                        You already applied to this position!
                                                    </h1>
                                                </div>
                                                // </a>
                                                // </Link>
                                                : <></>
                                            :
                                            <Link href={"/sign-in?next=" + "/jobs/" + query.id}>
                                                <a className={"font-weight-bold"}>
                                                    <div className={"blurred rounded-xl"}>
                                                        <h5 className={"text-center"}>
                                                            <i className="fas fa-lock mr-4 mb-4 text-dark"></i>
                                                            Login to apply
                                                        </h5>
                                                    </div>
                                                </a>
                                            </Link>
                                        }


                                        <div className={"p-4"}>
                                            <h4>Apply for this job</h4>


                                            <form onSubmit={createApplication}>

                                                <div className="row">
                                                    <div className="col">
                                                        <label>First Name</label>
                                                        <input name={"firstname"} className={"form-control"}
                                                               defaultValue={user && user.firstname}/>
                                                    </div>
                                                    <div className="col">
                                                        <label>Last Name</label>
                                                        <input name={"lastname"} className={"form-control"}
                                                               defaultValue={user && user.lastname}/>
                                                    </div>
                                                </div>


                                                <label className={"m-0"}>Email</label>
                                                <input name={"email"} className={"form-control"}
                                                       defaultValue={user && user.email}/>
                                                <label className={"m-0"}>Resume / CV</label>
                                                {user && user.resumeFileName ?
                                                    <p className={"m-0"}>
                                                        <small>
                        <span
                            className={"font-weight-bold"}>Current CV:</span> {user.resumeFileName}
                                                            <a href={`${serverUrl}/user/cv`}
                                                               rel={"noreferrer noopener nofollow"}><i
                                                                className="fas fa-file-download text-dark ml-1 mr-1"></i></a>
                                                        </small>
                                                    </p> : <></>
                                                }


                                                <div className={"position-relative"}>
                                                    <input id={"file-input"} name={"file"} type="file"
                                                           className="custom-file-input"
                                                           accept={`application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain,
                                       application/pdf, image/*,
                                       application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
                                       application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
                                       application/vnd.openxmlformats-officedocument.presentationml.slideshow,
                                       .xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf
                                       `}
                                                           onChange={e => e.target.files.length > 0 && setSelectedFileName(e.target.files[0].name)}
                                                    />
                                                    <label className="custom-file-label "
                                                           htmlFor="file-input">{selectedFilename || "Choose file"}</label>
                                                </div>

                                                <label className={"m-0"}>Cover Letter</label>
                                                <textarea name={"coverLetter"} className={"form-control"}
                                                          defaultValue={user && user.coverLetter}/>
                                                <label className={"m-0"}>LinkedIn Profile</label>


                                                <p className={"m-0"}>
                                                    <small>Eg: https://www.linkedin.com/in/username</small>
                                                </p>
                                                <input name={"linkedinProfile"} className={"form-control"}
                                                       defaultValue={user && user.linkedinProfileUrl}/>
                                                <label className={"m-0"}>Website</label>
                                                <input name={"website"} className={"form-control"}
                                                       defaultValue={user && user.website}/>

                                                <div className="text-center" id={"apply"}>
                                                    <button className={"btn btn-light-primary rounded-xl mx-auto my-4"}
                                                            type={"submit"}>Submit Application
                                                        <i className="far fa-paper-plane ml-4"></i></button>
                                                </div>


                                            </form>

                                        </div>
                                        : <></>


                                    </div>

                                    : <></>
                            }</>
                    }
                </div>


                <style jsx>{`
                  h4, button, h3, h1 {
                    font-weight: bold;
                  }

                  .company-about {
                    display: flex;
                    flex-direction: row;
                  }

                  .company-about > p {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }

                  .blurred {
                    background-color: white;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(2px);
                    z-index: 10;
                  }
                `}</style>
            </Layout>
        </>
    )
}
