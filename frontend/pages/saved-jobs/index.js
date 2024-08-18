import {Layout} from "../../components/shared/menu/Layout";
import DataTable from "react-data-table-component";
import {useState, useEffect} from "react"
import {Requests} from "../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../components/shared/Notify";
import Link from "next/link"
import Head from "next/head"

export default function SavedPositionsIndex({user, query, router, serverUrl, pageTitle}) {
    const [savedPositions, setSavedPositions] = useState(null)

    async function getSavedPositions() {
        try {
            const url = `${serverUrl}/saved-position`
            const {data} = await Requests('get', url)

            setSavedPositions(data)

        } catch (error) {
            NotifyComponent('failure', error.message)
            router.push("sign-in")
        }
    }

    useEffect(() => {
        getSavedPositions()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!savedPositions) return <Layout loading={true}/>

    const jobApplicationsColumns = [
        {
            name: 'id',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'positionLink',
            selector: (row) => (<Link href={`/jobs/${row.positionId}`}><a>View Position </a></Link>),
            sortable: true,
        },
        {
            name: 'Date Posted',
            selector: (row) => row.createdAt,
            sortable: true,
        },
    ];

    async function unsavePosition(positionId) {
        try {
            const url = `${serverUrl}/saved-position/` + positionId
            const data = await Requests('delete', url)

            NotifyComponent('success', "Success")

            getSavedPositions()

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    return (
        <>
            <Head>
                <title>{pageTitle} - Saved Jobs</title>
            </Head>
            <Layout user={user} router={router} query={query}>
                <div className="row">
                    <div className="col-12">
                        <h1 className={"text-center"}>Saved Jobs</h1>

                        <div className="card rounded-sm">


                            <div className="card-body">
                                <DataTable
                                    title="Saved Jobs"
                                    columns={jobApplicationsColumns}
                                    // theme="solarized"
                                    data={savedPositions}
                                    striped={true}
                                    highlightOnHover={true}
                                    className={"custom-datatable"}
                                    pagination={true}
                                    dense={true}
                                    expandableRows={true}
                                    expandOnRowClicked={true}
                                    expandableRowsComponent={(props) => (
                                        <>


                                            <button className={"btn btn-danger m-2"}
                                                    onClick={unsavePosition.bind(this, props.data.id)}>Delete Save
                                            </button>


                                            <Link href={"/jobs/" + props.data.positionId}>
                                                <a className={"btn btn-info m-2 "}>View Position</a>
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