import { Layout } from "../../components/shared/new/Layout";
import Head from "next/head";
import moment from "moment";
import { ProfileHeader } from "../profile";
import { useState, useEffect } from "react";
import { NotifyComponent } from "../../components/shared/Notify";
import { Requests } from "../../components/CustomHooks/Requests";
import Link from 'next/link'

function MyApplication({ user, query, router, serverUrl, pageTitle, loading }) {
    const [jobApplications, setJobApplications] = useState(null)
    const [processingJobApplications, setProcessingJobApplications] = useState(null)

    async function getJobApplications() {
        try {
            const url = `${serverUrl}/job-application`
            const { data } = await Requests('get', url)
            setJobApplications(data.filter(application => !application.processing))
            setProcessingJobApplications(data.filter(application => application.processing))
        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    useEffect(() => {
        getJobApplications();
    }, [])

    if (!jobApplications) return <Layout loading={true} />
    console.log(jobApplications, processingJobApplications)
    return (
        <>
            <Head>
                <title>{pageTitle} - My Applications</title>
            </Head>
            <Layout loading={loading} user={user}
                router={router}>
                <ProfileHeader title="מועמדויות" user={user} router={router} />
                <ApplicationRow title="מועמדויות שהוגשו" applications={jobApplications} type={"submitted"} />
                <ApplicationRow title="מועמדויות בתהליך הגשה" applications={processingJobApplications} type={"processing"} />
            </Layout>
        </>
    )
}

export default MyApplication;

function ApplicationRow({ title, applications, type }) {
    return (
        <>
            <style jsx>{`
                .application-label {
                    margin: 32px 73px 32px 30px;
                    padding: 32px 0;
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: right;
                    color: rgba(0, 0, 0, .75);
                    border-bottom: 1px solid rgba(0,0,0,.4);
                }

                .application-main {
                    margin: 36px 73px 36px 79px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #1B1B1B66;
                    padding:  10px 30px 0 53px;
                    border-radius: 8px;
                    background-color: #fff;
                }

                .title-applied-time h3 {
                    font-size: 24px;
                    font-weight: 400;
                    line-height: 48px;
                    letter-spacing: -0.017em;
                    text-align: left;
                    color: #0079B9;
                    cursor: pointer;
                }
                
                .title-applied-time p {
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: left;
                    color: #000000BF;
                }

                p.application-desc, .applications > p {
                    font-family: Inter;
                    font-size: 24px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: -0.017em;
                    text-align: right;
                    color: #000000BF;
                }

                .applications > p {
                    text-align: center;
                    font-size: 16px;
                }
            `}</style>
            <div className="application-container">
                <div className="application-label">
                    <h2>{title}</h2>
                </div>
                <div className="applications">
                    {
                        applications.length > 0
                            ?
                        applications.map(application => (
                            <div className="application-main" key={type + application.id}>
                                <div className="title-applied-time">
                                    <Link href={`/jobs/${application.positionId}`}><h3>{application.position.jobTitle}</h3></Link>
                                    <p>{type === "submitted" ? "Applied" : type === "saved" ? 'Saved' : 'Initiated'}: {moment(application.createdAt).format("MMM DD, YYYY hh:mm A")}</p>
                                </div>
                                <p className="application-desc">
                                    {type === "submitted" ? "הוגשה" : type === "saved" ? '' : 'בתהליך'}
                                </p>
                            </div>
                        ))
                            :
                        <>
                            {type === "submitted" && <p>No job is submitted.</p>}
                            {type === "processing" && <p>No job on processing.</p>}
                        </>
                    }
                </div>
            </div>
        </>
    )
}
