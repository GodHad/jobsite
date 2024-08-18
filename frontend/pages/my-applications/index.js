import {Layout} from "../../components/shared/menu/Layout";
import DataTable from "react-data-table-component";
import {useState, useEffect} from "react"
import {Requests} from "../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../components/shared/Notify";
import Link from "next/link"
import Head from "next/head";

export default function MyApplicationsIndex({user, query, router, serverUrl, pageTitle}) {
    const [jobApplications, setJobApplications] = useState(null)

    async function getJobApplications() {
        try {
            const url = `${serverUrl}/job-application`
            const {data} = await Requests('get', url)

            setJobApplications(data)

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    useEffect(() => {
        getJobApplications()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!jobApplications) return <Layout loading={true}/>

    const jobApplicationsColumns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'positionLink',
            selector: (row) => (<Link href={`/jobs/${row.positionId}`}><a>View Position Applied</a></Link>),
            sortable: true,
        },
        {
            name: 'Date Applied',
            selector: (row) => row.createdAt,
            sortable: true,
        },
    ];

    return (
        <>
            <Head>
                <title>{pageTitle} - My Applications</title>
            </Head>
            <Layout user={user} router={router} query={query}>
                <div className="row">
                    <div className="col-12">
                        <h1 className={"text-center"}>Submitted applications</h1>

                        <div className="card rounded-sm">


                            <div className="card-body">
                                <DataTable
                                    title="Applications"
                                    columns={jobApplicationsColumns}
                                    // theme="solarized"
                                    data={jobApplications}
                                    striped={true}
                                    highlightOnHover={true}
                                    className={"custom-datatable"}
                                    pagination={true}
                                    dense={true}
                                    expandableRows={true}
                                    expandOnRowClicked={true}
                                    expandableRowsComponent={(props) => (
                                        <>
                                            <h5>Application details</h5>


                                            <p className={"font-weight-bold m-0"}>Name</p>
                                            <p>{props.data.firstname} {props.data.lastname}</p>

                                            <p className={"font-weight-bold m-0"}>Linkedin Profile Url</p>
                                            <p>{props.data.linkedinProfile}</p>

                                            <p className={"font-weight-bold m-0"}>Email</p>
                                            <p>{props.data.email}</p>

                                            {/*<p className={"font-weight-bold m-0"}>Phone Number</p>*/}
                                            {/*<p>{props.data.phone}</p>*/}

                                            <p className={"font-weight-bold m-0"}>CV Filename</p>
                                            <p>{props.data.resumeFileName}</p>

                                            <p className={"font-weight-bold m-0"}>Website</p>
                                            <p>{props.data.website}</p>


                                            <p className={"font-weight-bold m-0"}>Cover Letter</p>
                                            <textarea className={"form-control mb-2"}
                                                      readOnly={true}>{props.data.coverLetter}</textarea>


                                            <Link href={"/jobs/" + props.data.positionId}>
                                                <a className={"btn btn-info mb-6"}>View Position</a>
                                            </Link>

                                        </>
                                    )}
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </Layout>
        </>
    )
}