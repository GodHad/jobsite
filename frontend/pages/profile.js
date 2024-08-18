import {useEffect, useState} from "react";
import {GetUser} from "../components/CustomHooks/GetUser";
import {Layout} from "../components/shared/menu/Layout";

import {Requests} from "../components/CustomHooks/Requests";
import {NotifyComponent} from "../components/shared/Notify";
import {getFormInputValues} from "../components/get-named-inputs-values";
import {useRouter} from 'next/router'
import config from "../config/default.js"
import Head from "next/head";

const serverUrl = config.domain.server

export default function Profile({user, userChecks, router, pageTitle}) {
    const [selectedFilename, setSelectedFileName] = useState(null)

    async function updateProfile(event) {
        try {
            event.preventDefault();
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


            const url = `${serverUrl}/user`
            const data = await Requests('put-form-data', url, {}, formData)
            userChecks()

            NotifyComponent('success', "Success")

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    if (!user) return <Layout loading={true}/>

    return (
        <>
            <Head>
                <title>{pageTitle} - Profile</title>
            </Head>
            <Layout loading={false} activeItem={"profile"} breadcrumbs={["Jobs", "Index"]} user={user} router={router}>
                <div className="row">
                    <div className={"col-md-9 col-12 mx-auto main-column"}>
                        <h1 className={"text-center"}> Update Profile</h1>

                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={updateProfile}>
                                    <div className="row">
                                        <div className="col-6"><label>Firstname</label>
                                            <input name={"firstname"} type="text" className="form-control "
                                                   placeholder={"Firstname"} defaultValue={user.firstname}/></div>
                                        <div className="col-6"><label>Lastname</label>
                                            <input name={"lastname"} type="text"
                                                   className="form-control "
                                                   placeholder={"lastname"} defaultValue={user.lastname}/></div>
                                    </div>


                                    <label>Contact Email:</label>
                                    <input name={"email"} type={"text"} className={"form-control"}
                                           defaultValue={user.email}/>


                                    <label htmlFor="">LinkedIn Profile Url:</label>
                                    <p className={"m-0"}>
                                        <small>Eg: https://www.linkedin.com/in/username</small>
                                    </p>
                                    <input name={"linkedinProfile"} type="text" className={"form-control"}
                                           defaultValue={user.linkedinProfileUrl}/>

                                    <label htmlFor="">Website Url (Optional):</label>
                                    <input name={"website"} type="text" className={"form-control"}
                                           defaultValue={user.website}/>

                                    <label htmlFor="">Cover Letter</label>
                                    <textarea name={"coverLetter"} className={"form-control"}
                                              defaultValue={user.coverLetter}></textarea>

                                    <label htmlFor="">Resume / CV</label>

                                    {user.resumeFileName ?
                                        <p className={"m-0"}>
                                            <small>
                                                <span
                                                    className={"font-weight-bold"}>Current CV:</span> {user.resumeFileName}
                                                <a href={`${serverUrl}/user/cv`} rel={"noreferrer noopener nofollow"}><i
                                                    className="fas fa-file-download text-dark ml-1 mr-1"></i></a>
                                            </small>
                                        </p> : <></>
                                    }


                                    <div className={"position-relative mb-6"}>
                                        <input id={"file-input"} name={"file"} type="file" className="custom-file-input"
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

                                    <button className="btn btn-dark btn-block" type={"submit"}>
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>


                    </div>
                </div>
            </Layout>


            <style jsx>{` .main-column {
              max-width: 1000px
            }

            label {
              margin-bottom: 0;
              margin-top: 5px;
            }`}</style>


        </>
    )
}