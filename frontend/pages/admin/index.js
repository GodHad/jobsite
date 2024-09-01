import { Layout } from "../../components/shared/menu/Layout";
import DataTable, { createTheme } from 'react-data-table-component';
import { useEffect, useState } from "react";
import { getFormInputValues } from "../../components/get-named-inputs-values";
import { Requests } from "../../components/CustomHooks/Requests";
import { NotifyComponent } from "../../components/shared/Notify";
import config from "../../config/default.js"
import * as moment from "moment"

const serverUrl = config.domain.server
import Link from "next/link"
import { DisplayRichText } from "../../components/pages/admin/DisplayRichText";
import Head from "next/head";

createTheme('solarized', {
    text: {
        primary: 'black',
        secondary: 'black',
    },
    // background: {
    //     default: '#002b36',
    // },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#073642',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
});

export default function AdminUserIndexList({ user, router, pageTitle, clientUrl }) {
    const [users, setUsers] = useState(null)
    const [jobApplications, setJobApplications] = useState(null)
    const [positions, setPositions] = useState({
        data: null,
        _metadata: {
            page_size: 10,
            page: 1
        }
    })
    const [pendingDelete, setPendingDelete] = useState("")
    const [pendingUserDelete, setPendingUserDelete] = useState("")
    useEffect(() => {
        getAllUsers()
        getAllPositions()
        getJobApplications()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    async function getJobApplications() {
        try {
            const url = `${serverUrl}/system/job-application`
            const { data } = await Requests('get', url)
            setJobApplications(data)

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function getAllUsers(url = `${serverUrl}/system/users?sortBy=createdAt&sortDirection=DESC`) {
        try {
            const data = await Requests('get', url)
            setUsers(data)

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function getAllPositions(url = `${serverUrl}/system/positions?sortBy=id&sortDirection=DESC&page_size=${positions._metadata.page_size}&page=${positions._metadata.page}`) {
        try {
            const { data, _metadata } = await Requests('get', url)

            setPositions({ data, _metadata })

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function paginate({ page = positions._metadata.page, page_size = positions._metadata.page_size }) {
        getAllPositions(`${serverUrl}/system/positions?sortBy=createdAt&sortDirection=DESC&page_size=${page_size}&page=${page}`)
    }

    async function onSort({ name }, direction) {
        const url = `${serverUrl}/system/users?sortBy=${name}&sortDirection=${direction.toUpperCase()}`
        getAllUsers(url)
    }

    async function onPositionsSort({ name }, direction) {
        const url = `${serverUrl}/system/positions?&page_size=${positions._metadata.page_size}&page=${positions._metadata.page}&sortBy=${name}&sortDirection=${direction.toUpperCase()}`
        getAllPositions(url)
    }

    async function deletePosition(positionId, e) {
        e.preventDefault()


        try {
            const getPositionUrl = `${serverUrl}/system/position/${positionId}`
            await Requests('delete', getPositionUrl)

            getAllPositions()

            NotifyComponent('success', 'Success')
        } catch (error) {
            NotifyComponent('failure', error.message)
        }

    }


    async function deleteUser(positionId, e) {
        e.preventDefault()


        try {
            const getPositionUrl = `${serverUrl}/system/user/${positionId}`
            await Requests('delete', getPositionUrl)

            getAllUsers()

            NotifyComponent('success', 'Success')
        } catch (error) {
            NotifyComponent('failure', error.message)
        }

    }

    async function uploadFile(e) {
        try {
            const files = e.target.files;
            const formData = new FormData()
            formData.append('file', files[0])

            const url = `${serverUrl}/system/position/bulk`
            await Requests('post-form-data', url, {}, formData)

            getAllPositions()

            NotifyComponent('success', 'Success')
        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }


    const columns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
            width: '60px'
        },
        {
            name: 'firstname',
            selector: (row) => row.firstname,
            sortable: true,
        },
        {
            name: 'lastname',
            selector: (row) => row.lastname,
            sortable: true,
        },
        {
            name: 'email',
            selector: (row) => row.email,
            sortable: true,
            width: '180px'
        },
        {
            name: 'subscribe type',
            selector: (row) => row.subscribeType === 'option1' ? '4 NIS' : row.subscribeType === 'option2' ? '30 NIS' : 'None',
            sortable: true,
            width: '150px'
        },
        {
            name: 'subscribe period',
            selector: (row) => row.subscribeStatus ? `${moment(row.subscribeStartDate).format('YYYY-MM-DD')}~${moment(row.subscribeEndDate).format('YYYY-MM-DD')}` : '',
            width: '180px'
        },
        {
            name: 'subscribe status',
            selector: (row) => row.subscribeStatus ? row.subscribeStatus : '',
            sortable: true,
            width: '140px'
        },
        {
            name: 'createdAt',
            selector: (row) => moment(row.createdAt).local().format('YYYY-MM-DD HH:mm:ss'),
            sortable: true,
        },
    ];

    const positionColumns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'companyName',
            selector: (row) => row.companyName.slice(0, 50),
            sortable: true,
        },
        {
            name: 'companySize',
            selector: (row) => row.companySize,
            sortable: true,
        },
        {
            name: 'companyIndustry',
            selector: (row) => row.companyIndustry.slice(0, 50),
            sortable: true,
        },
        {
            name: 'jobTitle',
            selector: (row) => row.jobTitle.slice(0, 50),
            sortable: true,
        },
        {
            name: 'jobLocation',
            selector: (row) => row.jobLocation.slice(0, 50),
            sortable: true,
            wrap: true
        },
        {
            name: 'jobDescription',
            selector: (row) => row.jobDescription.slice(0, 10),
            sortable: true,
        },
        {
            name: 'Hi-Tech',
            selector: (row) => row.hiTech ? "Yes" : "No",
            sortable: true,
        },
        {
            name: 'publishDate',
            selector: (row) => moment(row.createdAt).local().format('YYYY-MM-DD HH:mm:ss'),
            sortable: true,
        },
    ];

    const jobApplicationsColumns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'userId',
            selector: (row) => row.userId,
            sortable: true,
        },
        {
            name: 'fullName',
            selector: (row) => <span>{row.firstname} {row.lastname}</span>,
            sortable: true,
        },

        {
            name: 'email',
            selector: (row) => <span>{row.email}</span>,
            sortable: true,
        },

        {
            name: 'positionLink',
            selector: (row) => (<Link href={`/jobs/${row.positionId}`}><a>View Position Applied</a></Link>),
            sortable: true,
        },
        {
            name: 'Date Applied',
            selector: (row) => moment(row.createdAt).local().format('YYYY-MM-DD HH:mm:ss'),
            sortable: true,
        },
    ];

    const processingJobApplicationsColumns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'userId',
            selector: (row) => row.userId,
            sortable: true,
        },
        {
            name: 'fullName',
            selector: (row) => <span>{row.firstname} {row.lastname}</span>,
            sortable: true,
        },

        {
            name: 'email',
            selector: (row) => <span>{row.email}</span>,
            sortable: true,
        },

        {
            name: 'positionLink',
            selector: (row) => (<Link href={`/jobs/${row.positionId}`}><a>View Position Applied</a></Link>),
            sortable: true,
        },
        {
            name: 'Date Initiated',
            selector: (row) => moment(row.createdAt).local().format('YYYY-MM-DD HH:mm:ss'),
            sortable: true,
        },
    ];


    if (!user || !users || !positions.data || !jobApplications) return <Layout loading={true} />

    return (
        <>
            <Head>
                <title>{pageTitle} - Admin</title>
            </Head>
            <Layout loading={false} activeItem={"profile"} breadcrumbs={["Jobs", "Index"]} user={user} router={router} clientUrl={clientUrl}>
                <h1 className={"text-center"}> Admin</h1>
                <div className="card rounded-sm mb-3">
                    <div className="card-body">
                        <DataTable
                            title="Users"
                            columns={columns}
                            // theme="solarized"
                            data={users}
                            striped={true}
                            highlightOnHover={true}
                            className={"custom-datatable"}
                            onSort={onSort}
                            sortServer={true}
                            pagination={true}
                            dense={true}


                            expandableRows={true}
                            expandOnRowClicked={true}
                            expandableRowsComponent={(props) => (
                                <>
                                    {pendingUserDelete !== 'user-' + props.data.id ?
                                        <a href={"#"} className={"btn btn-warning w-120px border mb-3 mt-3 "}
                                            onClick={e => {
                                                e.preventDefault()
                                                setPendingUserDelete('user-' + props.data.id)
                                            }}>Delete</a> :
                                        <></>}

                                    {pendingUserDelete === 'user-' + props.data.id ?
                                        <a href={"#"} className={"btn btn-danger w-120px border mb-3 mt-3 "}
                                            onClick={deleteUser.bind(this, props.data.id)}>Confirm Delete</a> : <></>
                                    }

                                </>
                            )}

                        />
                    </div>
                </div>

                <div className={"d-inline-block mr-1"}>
                    <Link href={"/admin/jobs/create"}>
                        <a className={"btn btn-sm btn-white border mb-3 "}>Create Position</a>
                    </Link>
                </div>

                <div className={"d-inline-block"}>
                    <input type="file"
                        id="csv-select" name="avatar"
                        accept=".csv" className={"d-none"} onChange={uploadFile} />
                    <a className={"btn btn-sm btn-white border mb-3 "}
                        onClick={ev => document.querySelector("#csv-select").click()}>Bulk Import Positions (CSV)</a>
                </div>

                <div className="card rounded-sm">


                    <div className="card-body">
                        <DataTable
                            title="Positions"
                            columns={positionColumns}
                            // theme="solarized"
                            data={positions.data}
                            striped={true}
                            highlightOnHover={true}
                            className={"custom-datatable"}
                            onSort={onPositionsSort}
                            paginationTotalRows={positions._metadata.total_count}
                            sortServer={true}
                            paginationServer={true}
                            onChangePage={e => paginate({ page: e })}
                            onChangeRowsPerPage={e => paginate({ page_size: e })}
                            pagination={true}
                            dense={true}
                            expandableRows={true}
                            expandOnRowClicked={true}
                            paginationResetDefaultPage={positions.data.length === 0 && positions._metadata.page > 1}
                            expandableRowsComponent={(props) => (
                                <>
                                    <Link href={`/jobs/${props.data.id}`}>
                                        <a className={"btn btn-info w-120px border mb-3 mt-3 "}>View Job Post</a>
                                    </Link>


                                    <Link href={`/admin/jobs/${props.data.id}/edit`}>
                                        <a className={"btn btn-info w-120px border mb-3 mt-3 "}>Edit</a>
                                    </Link>


                                    {pendingDelete !== 'position-' + props.data.id ?
                                        <a href={"#"} className={"btn btn-warning w-120px border mb-3 mt-3 "}
                                            onClick={e => {
                                                e.preventDefault()
                                                setPendingDelete('position-' + props.data.id)
                                            }}>Delete</a> :
                                        <></>}

                                    {pendingDelete === 'position-' + props.data.id ?
                                        <a href={"#"} className={"btn btn-danger w-120px border mb-3 mt-3 "}
                                            onClick={deletePosition.bind(this, props.data.id)}>Confirm Delete</a> : <></>
                                    }


                                    <h4 className={"text-info"}>Job Description</h4>
                                    <DisplayRichText html={props.data.jobDescription} />
                                    <br />
                                    <h4 className={"text-info"}>Company About</h4>
                                    <p>{props.data.companyAbout}</p>
                                </>
                            )}
                        />
                    </div>
                </div>


                <div className="card rounded-sm mt-3">


                    <div className="card-body">
                        <DataTable
                            title="Job Applications(Applied)"
                            columns={jobApplicationsColumns}
                            // theme="solarized"
                            data={jobApplications.filter(application => !application.processing)}
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
                                        readOnly={true} defaultValue={props.data.coverLetter} />


                                    <Link href={"/jobs/" + props.data.positionId}>
                                        <a className={"btn btn-info mb-6 mr-2 mb-2"}>View Position</a>
                                    </Link>


                                    <a href={`${serverUrl}/system/job-application/${props.data.id}`} target={"_blank"}
                                        rel={"noopener nofollow noreferrer"} className={"btn btn-info mb-6"}>Download
                                        CV</a>

                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="card rounded-sm mt-3">
                    <div className="card-body">
                        <DataTable
                            title="Job Applications(Processing)"
                            columns={processingJobApplicationsColumns}
                            // theme="solarized"
                            data={jobApplications.filter(application => application.processing)}
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
                                        readOnly={true} defaultValue={props.data.coverLetter} />


                                    <Link href={"/jobs/" + props.data.positionId}>
                                        <a className={"btn btn-info mb-6 mr-2 mb-2"}>View Position</a>
                                    </Link>


                                    <a href={`${serverUrl}/system/job-application/${props.data.id}`} target={"_blank"}
                                        rel={"noopener nofollow noreferrer"} className={"btn btn-info mb-6 mr-2"}>Download
                                        CV</a>

                                    <a className={"btn btn-info mb-6"} onClick={async () => {
                                        try {
                                            await Requests('get', `${serverUrl}/system/job-application-processed/${props.data.id}`);
                                            setJobApplications(jobApplications.map(application => application.id === props.data.id ? { ...application, processing: false } : application))
                                            NotifyComponent('success', 'Success!')
                                        } catch (error) {
                                            NotifyComponent('failure', error.message)
                                        }
                                    }}>Process Application</a>

                                </>
                            )}
                        />
                    </div>
                </div>
            </Layout>
        </>
    )
}