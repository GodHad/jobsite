import { Layout } from "../../components/shared/new/Layout";
import Head from "next/head";
import { CommonContent } from "../../components/shared/new/CommonContent";
import ProjectItem from "../../components/shared/ProjectItem";
import Image from "next/dist/client/image";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import Select from "react-dropdown-select";
import { JobSearch } from "../../components/JobSearch";
import { SavedJobs } from "../../components/SavedJobs";
import { JobsFeed } from "../../components/JobsFeed";
import { useEffect, useLayoutEffect, useState } from "react";
import { Requests } from "../../components/CustomHooks/Requests";
import { NotifyComponent } from "../../components/shared/Notify";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index"
import { store } from "../../state/store";
import { reset, updateLocation } from "../../state/action-creators";
import ReactPaginate from 'react-paginate';
import ClipLoader from 'react-spinners/ClipLoader';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

function JobIndex({ props, user, serverUrl, router, pageTitle }) {
    const [loading, setLoading] = useState(false);
    const { query } = router;

    const state = useSelector((state) => state);
    const { title, location, industry, pageSize, page } = state.filters;
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
            const { companyIndustries, jobLocations } = await Requests('get', url)
            setCompanyIndustries(companyIndustries)
            setJobLocations(jobLocations)
        } catch (error) {
            console.log(error.message)
        }
    }

    async function getSavedPositions() {
        try {
            const url = `${serverUrl}/saved-position?page_size=5`
            const { data, savedPositionIds } = await Requests('get', url)
            setSavedPositions(data)
            setSavedPositionsIds(savedPositionIds)
        } catch (error) {
            console.log(error.message)
        }
    }


    async function getJobs({ url = null, page = jobs._metadata.page, page_size = jobs._metadata.page_size }) {
        try {
            setLoading(true);
            const { innerWidth: width, innerHeight: height } = window;
            const { title, industry, location } = state.filters;

            const encodedFilters = JSON.parse(JSON.stringify({ title, industry, location }));
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
            if (data.length === 0 && _metadata.page > 1) getJobs({ page: 1 })
            setJobs({ data, _metadata })
            setJobTitles(distinctJobTitle)


            filterData.jobTitle && updateTitle(decodeURIComponent(filterData.jobTitle))
            filterData.companyIndustry && updateIndustry(decodeURIComponent(filterData.companyIndustry))
            filterData.jobLocation && updateLocation(decodeURIComponent(filterData.jobLocation))
            updatePageSize(decodeURIComponent(_metadata.page_size))
            // updatePage(decodeURIComponent(_metadata.page))
            setLoading(false);

        } catch (error) {
            NotifyComponent('failure', error.message)
            setLoading(false);
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

        getJobs({ url })
        getSavedPositions()
        getPositionParams()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const debouncedLocation = useDebounce(location, 500);
    const debouncedPage = useDebounce(page, 500);
    const debouncedIndustry = useDebounce(industry, 500);

    useEffect(() => {
        getJobs({ page })
        getSavedPositions();
    }, [debouncedLocation, debouncedPage, debouncedIndustry])

    if (!jobs.data) return <Layout loading={true} />

    return (
        <>
            <Head>
                <title>{pageTitle} - Jobs</title>
            </Head>
            <Layout loading={false} activeItem={"jobsIndex"} breadcrumbs={["Jobs", "Index"]} user={user}
                router={router}>
                <CommonContent />
                <Filter location={location} updateLocation={updateLocation} companyIndustries={companyIndustries} updateIndustry={updateIndustry} />
                {loading 
                    ?
                        <LoadingComponent />
                    :
                    <>
                        {
                            jobs.data.length === 0 ?
                                <p className={"mt-4 text-center"}>No jobs found for this search criteria. <a href={"#"}
                                    onClick={reset}>Reset
                                    Filters</a>
                                </p> : <MatchedProjects projects={jobs.data} serverUrl={serverUrl} />
                        }
                        <PaginatedItems itemsPerPage={pageSize} totalCount={jobs._metadata.total_count} currentPage={page} updatePage={updatePage} />
                    </>
                }
            </Layout>
        </>
    )
}

export default JobIndex;

const marks = [
    {
        value: 0,
        label: '100k+',
    },
    {
        value: 20,
        label: '1k+',
    },
    {
        value: 40,
        label: '101 - 1k',
    },
    {
        value: 60,
        label: '21 - 100',
    },
    {
        value: 80,
        label: '0 - 20',
    },
    {
        value: 100,
        label: 'הכל',
    },
];

const EmployeeSlider = () => {
    const [value, setValue] = useState(0);
    const [right, setRight] = useState(-2)

    const handleChange = (event) => {
        const tempSliderValue = event.target.value;
        setValue(tempSliderValue);
        const progress = (tempSliderValue / event.target.max) * 100;
        updateRightPosition(tempSliderValue, window.innerWidth)
        event.target.style.background = `linear-gradient(to right, #FF6C6C ${progress}%, #ccc ${progress}%)`;
    };

    const updateRightPosition = (sliderValue, windowWidth) => {
        if (windowWidth > 560) {
            setRight((-2 * sliderValue / 10 - 2) + Math.round(248 / 100 * sliderValue));
        } else {
            setRight((-2 * sliderValue / 10 - 2) + Math.round(180 / 100 * sliderValue));
        }
    };

    useEffect(() => {
        const handleResize = () => {
            updateRightPosition(value, window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [value]);

    return (
        <>
            <style jsx>{`
            .range-slider {
                flex: 1;
                position: relative;
                width: 248px;
                justify-content: center;
            }

            @media (max-width: 560px) {
                .range-slider {
                    width: 180px;
                }
            }
    
            .sliderticks {
                width: 265px;
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
                position: relative;
                right: 10px;
            }

            @media (max-width: 560px) {
                .sliderticks {
                    width: 180px;
                }
            }
    
            .sliderticks span {
                line-height: 14px;
                font-family: 'Inter';
                font-weight: 600;
                font-size: 12px;
                color: #c4c4c4;
            }

            @media (max-width: 560px) {
                .sliderticks span {
                    font-size: 10px;
                }
            }
    
            input[type="range"] {
                transform: rotateY(180deg);
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                cursor: pointer;
                outline: none;
                border-radius: 15px;
                height: 4px;
                background: #ccc;
            }
    
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 20px;
                width: 20px;
                background-color: #fff;
                border: 2px solid #FF6C6C;
                border-radius: 50%;
                transition: 0.2s ease-in-out;
            }
    
            .thumb-inner {
                background-color: #FF6C6C;
                width: 12px;
                height: 12px;
                top: 11px;
                position: absolute;
                transform: translate(-50%, -50%);
                border-radius: 50%;
            }

            @media (max-width: 1000px) {
                .thumb-inner {
                    top: 10px;
                }
            }
    
            input[type="range"]::-moz-range-thumb {
                height: 20px;
                width: 20px;
                background-color: #fff;
                border: 2px solid #FF6C6C;
                border-radius: 50%;
                transition: 0.2s ease-in-out;
            }
    
            input[type="range"]::-webkit-slider-thumb:hover {
                box-shadow: 0 0 0 10px rgba(255, 85, 0, 0.1);
            }
    
            input[type="range"]:active::-webkit-slider-thumb {
                box-shadow: 0 0 0 13px rgba(255, 85, 0, 0.2);
            }
    
            input[type="range"]:focus::-webkit-slider-thumb {
                box-shadow: 0 0 0 13px rgba(255, 85, 0, 0.2);
            }
    
            input[type="range"]::-moz-range-thumb:hover {
                box-shadow: 0 0 0 10px rgba(255, 85, 0, 0.1);
            }
    
            input[type="range"]:active::-moz-range-thumb {
                box-shadow: 0 0 0 13px rgba(255, 85, 0, 0.2);
            }
    
            input[type="range"]:focus::-moz-range-thumb {
                box-shadow: 0 0 0 13px rgba(255, 85, 0, 0.2);
            }
    
            .range {
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 500px;
                margin: 0 auto;
                height: 8rem;
                width: 80%;
                background: #fff;
                padding: 0px 10px;
            }
    
            .value {
                font-size: 26px;
                width: 50px;
                text-align: center;
            }
            `}
            </style>
            <div className="range-slider">
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="20" // Ensure step is defined
                    value={value}
                    id="range"
                    onChange={handleChange}
                />
                <span className="thumb-inner" style={{ right: right + 'px' }}></span>
                <div className="sliderticks">
                    {marks.map(mark => (
                        <span key={'mark' + mark.value}>{mark.label}</span>
                    ))}
                </div>
            </div>
        </>
    );
};

const HiTechSwitch = () => (
    <div className="d-flex flex-row align-items-center">
        <style jsx>
            {`
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* The slider */
            .slider {
                transform: rotateY(180deg);
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 28px;
                width: 28px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }

            input + .slider:after {
                margin-left: 1px;
                height: 28px;
                width: 28px;
                top: 1px;
            }

            input:checked + .slider {
                background-color: #FF6C6C;
            }

            input:checked + .slider:after {
                margin-left: 27px;
                background-color: #fff;
            }

            input:focus + .slider {
                box-shadow: 0 0 1px #FF6C6C;
            }

            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            /* Rounded sliders */
            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                width: auto;
                border-radius: 50%;
            }
        `}
        </style>
        <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
        </label>
        <label style={{ marginLeft: '23px' }}>הייטק בלבד</label>
    </div>
);

const LocationInput = ({ placeholder, id, value, updateLocation }) => {
    return (
        <div className="d-flex flex-column">
            <style jsx>{`
                input {
                    width: 197px;
                    border: 1px solid #ced4da;
                    padding: 14px 17px;
                    font-size: 16px;
                    border-radius: 4px;
                    text-align: right;
                }

                @media (max-width: 560px) {
                    input {
                        width: 150px
                    }
                }
                
                label {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                    color: #2d2d2d;
                    text-align: right;
                }
            `}</style>
            <label htmlFor={id}>מיקום</label>
            <input type="text" id={id} value={value} placeholder={placeholder} onChange={(e) => { updateLocation(e.target.value) }} />
        </div>
    )
}

const RoleInput = ({ placeholder, id }) => {
    const [value, setValue] = useState('');
    return (
        <div className="d-flex flex-column">
            <style jsx>{`
                input {
                    width: 260px;
                    border: 1px solid #ced4da;
                    padding: 13px 17px;
                    font-size: 16px;
                    border-radius: 4px;

                }

                @media (max-width: 560px) {
                    input {
                        width: 220px
                    }
                }
                
                label {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                    color: #2d2d2d;
                    text-align: right;
                }
            `}</style>
            <label htmlFor={id}>תפקיד</label>
            <input type="text" id={id} value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} />
        </div>
    )
}

const CustomDateInput = ({ value, onClick }) => (
    <div className="custom-input" onClick={onClick}>
        <input
            type="text"
            value={value}
            readOnly
            placeholder="Select a date"
        />
        <FaCalendarAlt className="calendar-icon" />
    </div>
);

const DateInput = () => {
    const [startDate, setStartDate] = useState(new Date());

    const formatDate = (date) => {
        return date ? format(date, 'dd/MM/yyyy') : '';
    };

    return (
        <div className="d-flex flex-column">
            <style jsx>{`
                input {
                    width: 197px;
                    border: 1px solid #ced4da;
                    padding: 13px 17px;
                    font-size: 16px;
                    border-radius: 4px;
                    text-align: right;
                }
                
                label {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                    color: #2d2d2d;
                    text-align: right;
                }
            `}</style>
            <label>:פורסם ב</label>
            <DatePicker selected={startDate} dateFormat={"dd/MM/yyyy"} onChange={(date) => setStartDate(date)} customInput={<CustomDateInput value={formatDate(startDate)} />} />
        </div>
    )
}

const BranchSelector = ({ id, companyIndustries, updateIndustry }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (values) => {
        if (values.length === 0) updateIndustry(null);
        else {
            setSelectedOption(values);
            updateIndustry(values[0].value)
        }
    }

    return (
        <div className="d-flex flex-column">
            <style jsx>{`
                label {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                    color: #2d2d2d;
                    text-align: right;
                }
            `}</style>
            <label>ענף</label>
            <Select
                id={id}
                defaultValue={selectedOption}
                onChange={handleChange}
                options={companyIndustries.map(companyIndustry => ({ value: companyIndustry, label: companyIndustry }))}
                dropdownHeight="300px"
                direction="rtl"
                style={{
                    width: '260px',
                    height: '51px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    fontWeight: 400,
                    fontSize: '16px',
                    paddingRight: '23px'
                }}
                placeholder="למשל שיווק"
                clearable={true}
            />
        </div>
    )
}

function Filter({ location, updateLocation, companyIndustries, updateIndustry }) {
    const handleLocationChange = (e) => {
        updateLocation(e);
    }
    return (
        <>
            <style jsx>{`
                .filter-container {
                    background-color: rgba(202, 199, 199, .4);
                    padding: 90px 80px 80px;
                    border-radius: 8px;
                    flex-direction: row;
                    justify-content: space-between;
                }

                @media (max-width: 1480px) {
                    .filter-container {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                .hi-tech-employee {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    max-width: 700px;
                    gap: 250px;
                }

                @media (max-width: 1480px) {
                    .hi-tech-employee {
                        align-items: center;
                        gap: 200px;
                    }
                }

                @media (max-width: 700px) {
                    .hi-tech-employee {
                        align-items: center;
                        gap: 100px;
                    }
                }

                .hi-tech-filter {
                    font-family: 'Inter';
                    max-width: 187px;
                }


                .hi-tech-filter span {
                    color: #A6A3A3;
                }
                
                .hi-tech-filter-switch {
                    padding: 10px 0;
                    gap: 24px;
                    border-bottom: 1px solid rgba(189, 189, 189, 0.8)
                }
                
                .hi-tech-filter-switch span {
                    font-weight: 500;
                    font-size: 14px;
                    letter-spacing: 1px;
                }

                .btn-custom {
                    margin-top: 13px;
                    background-color: rgb(189, 189, 189);
                    border: 1px solid rgba(189, 189, 189, .8);
                    border-radius: 4px;
                    width: 100%;
                    height: 43px;
                }
                
                .number-of-employees h4 {
                    font-weight: 600;
                    font-size: 14px;
                    color: #000;
                    text-align: right;
                }

                .location-role {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    max-width: 700px;
                    gap: 26px;
                }

                @media (max-width: 1480px) {
                    .location-role {
                        align-items: center;
                    }
                }

                .location-filter {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                    gap: 177px;
                }

                @media (max-width: 700px) {
                    .location-filter {
                        gap: 50px;
                    }
                }

                .role-filter {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                }
            `}</style>
            <div className="d-flex filter-container">
                <div className="hi-tech-employee">
                    <div className="hi-tech-filter">
                        <div className="hi-tech-filter-switch d-flex flex-row align-items-center">
                            <HiTechSwitch sx={{ m: 1 }} defaultChecked />
                        </div>
                        <button className="btn-custom"></button>
                    </div>
                    <div className="number-of-employees">
                        <h4>מספר עובדים בחברה</h4>
                        <div className="slider-container">
                            <EmployeeSlider
                                defaultValue={100}
                                step={null}
                                valueLabelDisplay="auto"
                                marks={marks}
                            />
                        </div>
                    </div>
                </div>
                <div className="location-role">
                    <div className="location-filter">
                        <LocationInput id="location-input" value={location} placeholder="למשל תל אביב" updateLocation={handleLocationChange} />
                        <RoleInput id="role-input" placeholder="e.g. Senior Public Relation" />
                    </div>
                    <div className="role-filter">
                        <DateInput />
                        <BranchSelector
                            id="role-selector"
                            companyIndustries={companyIndustries}
                            updateIndustry={updateIndustry}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

function MatchedProjects({ projects, serverUrl }) {
    return (
        <div className="matched-projects">
            {projects.map(project => (
                <ProjectItem key={'project' + project.id} project={project} serverUrl={serverUrl} />
            ))}
        </div>
    )
}

function PaginatedItems({ itemsPerPage, totalCount, updatePage, currentPage }) {
    const [itemOffset, setItemOffset] = useState(0);
    const pageCount = Math.ceil(totalCount / itemsPerPage);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalCount;
        setItemOffset(newOffset);
        updatePage(event.selected + 1);
    };

    return (
        <ReactPaginate
            previousLabel={null}
            nextLabel={null}
            breakLabel="..."
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            previousClassName={'previous'}
            nextClassName={'next'}
            disabledClassName={'disabled'}
            activeClassName={'active'}
            forcePage={currentPage - 1 >= pageCount ? 0 : currentPage - 1}
        />
    );
}

const LoadingComponent = () => (
    <>
        <style jsx>{`
            .loader-container {
                height: 50px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `}</style>
        <div className={"loader-div"}>
            <div className={"loader-container"}>
                <ClipLoader />
            </div>
        </div>
    </>
)