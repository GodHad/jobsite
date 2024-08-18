import {Layout} from "../../components/shared/menu/Layout";
// import * as React from "react"
import {JobSearch} from "../../components/JobSearch";
import {SavedJobs} from "../../components/SavedJobs";
import {JobsFeed} from "../../components/JobsFeed";
import {useEffect, useLayoutEffect, useState} from "react";
import {Requests} from "../../components/CustomHooks/Requests";
import {NotifyComponent} from "../../components/shared/Notify";

import {useSelector, useDispatch} from "react-redux";

import Head from "next/head";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../state/index"
import {store} from "../../state/store";
import {reset, updateLocation} from "../../state/action-creators";


function JobIndex({props, user, serverUrl, router, pageTitle}) {

    const {query} = router;

    const state = useSelector((state) => state);
    const {title, location, industry, pageSize, page} = state.filters;
    const dispatch = useDispatch()
    const {
        updateIndustry, updateLocation, updateTitle, reset, updatePageSize, updatePage
    } = bindActionCreators(actionCreators, dispatch)


    const [jobs, setJobs] = useState({
        data: null,
        _metadata: {
            page_size: 10,
            page: 1
        }
    })


    const resetFilters = async (e) => {
        e.preventDefault()
        reset()
        setResetFiltersRand((Math.random() + 1).toString(36).substring(7))
    }

    const [companyIndustries, setCompanyIndustries] = useState([])
    const [jobLocations, setJobLocations] = useState([])
    const [jobTitles, setJobTitles] = useState([])
    const [savedPositions, setSavedPositions] = useState([])
    const [resetFiltersRand, setResetFiltersRand] = useState(null)
    const [savedPositionsIds, setSavedPositionsIds] = useState([])

    async function getPositionParams() {
        try {
            const url = `${serverUrl}/position/params`
            const {companyIndustries, jobLocations} = await Requests('get', url)
            setCompanyIndustries(companyIndustries)
            setJobLocations(jobLocations)
        } catch (error) {
            console.log(error.message)
        }
    }

    async function getSavedPositions() {
        try {
            const url = `${serverUrl}/saved-position?page_size=5`
            const {data, savedPositionIds} = await Requests('get', url)
            setSavedPositions(data)
            setSavedPositionsIds(savedPositionIds)
        } catch (error) {
            console.log(error.message)
        }
    }


    async function getJobs({url = null, page = jobs._metadata.page, page_size = jobs._metadata.page_size}) {
        try {

            const {innerWidth: width, innerHeight: height} = window;
            if (width <= 991.98) page_size = 100;
            const {title, industry, location} = state.filters;


            const encodedFilters = JSON.parse(JSON.stringify({title, industry, location}));
            for (const [key, value] of Object.entries(encodedFilters)) {
                encodedFilters[key] = encodeURIComponent(value)
            }

            let endpoint;
            if (url && url.includes("page_size")) {
                endpoint = url && url;
            } else if (url) {
                endpoint = url && url + `&page=${page}&page_size=${page_size}`;
            } else {
                endpoint = `${serverUrl}/position?jobTitle=${encodedFilters.title}&jobLocation=${encodedFilters.location}&companyIndustry=${encodedFilters.industry}&page=${page}&page_size=${page_size}`;
            }

            const {
                data,
                _metadata,
                filterData,
                distinctJobTitle,
            } = await Requests('get', endpoint)
            if (data.length === 0 && _metadata.page > 1) getJobs({page: 1})
            setJobs({data, _metadata})
            setJobTitles(distinctJobTitle)


            filterData.jobTitle && updateTitle(decodeURIComponent(filterData.jobTitle))
            filterData.companyIndustry && updateIndustry(decodeURIComponent(filterData.companyIndustry))
            filterData.jobLocation && updateLocation(decodeURIComponent(filterData.jobLocation))
            updatePageSize(decodeURIComponent(_metadata.page_size))
            updatePage(decodeURIComponent(_metadata.page))


        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function savePosition(id) {
        try {
            const url = `${serverUrl}/saved-position/` + id
            const data = await Requests('post', url, {}, {})

            NotifyComponent('success', "Success")

            getSavedPositions()

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }

    async function unsavePosition(id) {
        try {
            const url = `${serverUrl}/saved-position/` + id
            const data = await Requests('delete', url)

            NotifyComponent('success', "Success")

            getSavedPositions()

        } catch (error) {
            NotifyComponent('failure', error.message)
        }
    }


    useEffect(() => {

        const string = Object.entries(query).reduce((acc, [key, value]) => {
                if (acc && acc.length > 1 && value.length > 0)
                    return acc.length > 1 && `${acc}&${key}=${encodeURIComponent(value)}`
                else if (value.length > 0)
                    return `${key}=${encodeURIComponent(value)}`
                else
                    return acc || "";
            }, ""
        )

        const url = string.length > 1 && `${serverUrl}/position?${string}` || null

        getJobs({url})
        getSavedPositions()
        getPositionParams()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const _applyFilters = (event, page) => {
        event && event.preventDefault()
        getJobs({page})
        getSavedPositions()


        router.push(
            {
                pathname: `/`,
                query: {
                    jobLocation: location,
                    jobTitle: title,
                    companyIndustry: industry, page_size: pageSize, page


                }
            },
        );

    }


    if (!jobs.data) return <Layout loading={true}/>

    return (
        <>
            <Head>
                <title>{pageTitle} - Jobs</title>
            </Head>
            <Layout loading={false} activeItem={"jobsIndex"} breadcrumbs={["Jobs", "Index"]} user={user}
                    router={router}>
                <div className="row">
                    <div className={"col-md-12 col-lg-9 col-12 mb-4"}>
                        <JobSearch companyIndustry={companyIndustries}
                                   jobLocations={jobLocations} jobTitles={jobTitles}
                            // jobFilters={jobFilters}
                            // setJobFilters={setJobFilters}
                                   _getJobs={getJobs}
                            // firstRenderFilters={firstRenderFilters}
                            // searchSelectFieldValues={searchSelectFieldValues}
                            //        resetFiltersRand={resetFiltersRand}
                                   _applyFilters={_applyFilters}
                        />

                        {jobs.data.length === 0 ?
                            <p className={"mt-4 text-center"}>No jobs found for this search criteria. <a href={"#"}
                                                                                                         onClick={reset}>Reset
                                Filters</a>
                            </p>
                            : <>
                                <p className={"mt-4 text-center"}>{jobs._metadata.total_count} jobs found for this
                                    search criteria. <a href={"#"} onClick={reset}>Reset Filters</a>
                                </p>
                                <JobsFeed jobs={jobs.data} _metadata={jobs._metadata} _getJobs={getJobs} user={user}
                                          serverUrl={serverUrl} savedPositionsIds={savedPositionsIds}
                                          _savePosition={savePosition}
                                          _unsavePosition={unsavePosition}
                                          _applyFilters={_applyFilters}
                                />

                            </>}
                    </div>
                    <div className={"col-md-3 col-12 saved-jobs"}>
                        <SavedJobs savedPositions={savedPositions}/>
                    </div>
                </div>
            </Layout>


        </>
    )
}

export default JobIndex;