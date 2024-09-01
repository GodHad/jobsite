import React from 'react';
import { Layout } from "../../components/shared/new/Layout";
import Head from "next/head";
import { CommonContent } from "../../components/shared/new/CommonContent";
import ProjectItem from "../../components/shared/ProjectItem";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import Select from "react-dropdown-select";
import { useEffect, useState } from "react";
import { Requests } from "../../components/CustomHooks/Requests";
import { NotifyComponent } from "../../components/shared/Notify";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../state/index"
import ReactPaginate from 'react-paginate';
import { DivLoader } from '../../components/shared/DivLoader';
import moment from 'moment';

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

function JobIndex({ props, user, serverUrl, clientUrl, router, pageTitle }) {
    const [loading, setLoading] = useState(false);
    const { query } = router;

    const state = useSelector((state) => state);
    const { title, location, industry, pageSize, page, employAmount, date, hiTech } = state.filters;
    const dispatch = useDispatch()
    const {
        updateIndustry, updateLocation, updateTitle, reset, updatePageSize, updatePage, updateEmployAmount, updateDate, updateHiTech
    } = bindActionCreators(actionCreators, dispatch)


    const [jobs, setJobs] = useState({
        data: null,
        _metadata: {
            page_size: 10,
            page: 1
        }
    })

    const [companyIndustries, setCompanyIndustries] = useState([])

    async function getPositionParams() {
        try {
            const url = `${serverUrl}/position/params`
            const { companyIndustries, jobLocations } = await Requests('get', url)
            setCompanyIndustries(companyIndustries)
        } catch (error) {
            console.log(error.message)
        }
    }


    async function getJobs({ url = null, page = jobs._metadata.page, page_size = jobs._metadata.page_size }) {
        try {
            setLoading(true);
            const { title, industry, location, employAmount, date, hiTech } = state.filters;

            const encodedFilters = JSON.parse(JSON.stringify({ title, industry, location, employAmount, date, hiTech }));
            for (const [key, value] of Object.entries(encodedFilters)) {
                encodedFilters[key] = encodeURIComponent(value)
            }

            let endpoint;
            if (url && url.includes("page_size")) {
                endpoint = url && url;
            } else if (url) {
                endpoint = url && url + `&page=${page}&page_size=${page_size}`;
            } else {
                endpoint = `${serverUrl}/position?jobTitle=${encodedFilters.title}&jobLocation=${encodedFilters.location}&companyIndustry=${encodedFilters.industry}&companySize=${encodedFilters.employAmount}&publishDate=${encodedFilters.date}&hiTech=${hiTech}&page=${page}&page_size=${page_size}`;
            }

            const {
                data,
                _metadata,
                filterData,
                distinctJobTitle,
            } = await Requests('get', endpoint)
            if (data.length === 0 && _metadata.page > 1) getJobs({ page: 1 })
            setJobs({ data, _metadata })


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

    async function updateHiTechView() {
        try {
            if (user) {
                await Requests('post', serverUrl + '/user/update-hitech-view', {}, { hiTech })
            } else {
                localStorage.setItem('hi-tech-view', hiTech)
            }
            NotifyComponent('success', 'Success to save');
        } catch (error) {
            NotifyComponent('failure', error.message);
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
        getPositionParams()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (user) updateHiTech(user.hiTechView);
        else if (localStorage.getItem('hi-tech-view')) updateHiTech(localStorage.getItem('hi-tech-view') === "true")
    }, [user])

    const debouncedTitle = useDebounce(title, 500);
    const debouncedLocation = useDebounce(location, 500);
    const debouncedPage = useDebounce(page, 500);
    const debouncedIndustry = useDebounce(industry, 500);
    const debouncedEmployAmount = useDebounce(employAmount, 1000);

    useEffect(() => {
        getJobs({ page })
    }, [debouncedLocation, debouncedPage, debouncedIndustry, debouncedTitle, debouncedEmployAmount, date, hiTech])

    if (!jobs.data) return <Layout loading={true} />

    return (
        <>
            <Head>
                <title>{pageTitle} - Jobs</title>
            </Head>
            <Layout loading={false} activeItem={"jobsIndex"} breadcrumbs={["Jobs", "Index"]} user={user}
                router={router} clientUrl={clientUrl} serverUrl={serverUrl}>
                <CommonContent />
                <Filter title={title} location={location} employAmount={employAmount} date={date} hiTech={hiTech} updateLocation={updateLocation} companyIndustries={companyIndustries} updateIndustry={updateIndustry} updateTitle={updateTitle} updateEmployAmount={updateEmployAmount} updateDate={updateDate} updateHiTech={updateHiTech} updateHiTechView={updateHiTechView} />
                {loading
                    ?
                    <div className="loader-wrapper">
                        <DivLoader />
                    </div>
                    :
                    <>
                        {
                            jobs.data.length === 0 ?
                                <p className={"mt-4 text-center"}>No jobs found for this search criteria. <a href={"#"}
                                    onClick={reset}>Reset
                                    Filters</a>
                                </p> : <MatchedProjects projects={jobs.data} serverUrl={serverUrl} user={user} router={router} />
                        }
                        <PaginatedItems itemsPerPage={pageSize} totalCount={jobs._metadata.total_count} currentPage={page} updatePage={updatePage} />
                    </>
                }
                <style jsx>{`
                    .loader-wrapper {
                        width: 100%;
                        height: 750px; 
                        position: relative
                    }
                `}</style>
            </Layout>
        </>
    )
}

export default JobIndex;

const marks = [
    {
        value: 5,
        label: '100k+',
    },
    {
        value: 4,
        label: '1k+',
    },
    {
        value: 3,
        label: '101 - 1k',
    },
    {
        value: 2,
        label: '21 - 100',
    },
    {
        value: 1,
        label: '0 - 20',
    },
    {
        value: 0,
        label: 'הכל',
    },
];

const EmployeeSlider = ({ employAmount, updateEmployAmount }) => {
    const [value, setValue] = useState(employAmount);
    const [newValue, setNewValue] = useState(employAmount);
    const [right, setRight] = useState(-2)
    const [isDragging, setIsDragging] = useState(false)

    const handleChange = (event) => {
        const tempSliderValue = event.target.value;
        updateEmployAmount(tempSliderValue);
        setValue(tempSliderValue)
        const progress = (tempSliderValue / event.target.max) * 100;
        updateRightPosition(tempSliderValue, window.innerWidth)
        event.target.style.background = `linear-gradient(to right, #FF6C6C ${progress}%, #ccc ${progress}%)`;
    };

    const updateRightPosition = (sliderValue, windowWidth) => {
        if (windowWidth > 560) {
            setRight((-2 * sliderValue / 50 - 2) + Math.round(248 / 500 * sliderValue));
        } else {
            setRight((-2 * sliderValue / 50 - 2) + Math.round(180 / 500 * sliderValue));
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const slider = document.getElementById('range');
            const rect = slider.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            let newValue = Math.round((offsetX / rect.width) * 5);
            if (newValue < 0) newValue = 0;
            if (newValue > 5) newValue = 5;
            setNewValue(Math.floor(5 - newValue))
        }
    };

    const debouncedValue = useDebounce(newValue, 500);

    useEffect(() => {
        setValue(debouncedValue);
        updateRightPosition(debouncedValue, window.innerWidth);
        updateEmployAmount(debouncedValue);
    }, [debouncedValue])

    useEffect(() => {
        const handleResize = () => {
            updateRightPosition(value, window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [value]);

    // useEffect(() => {
    //     if (isDragging) {
    //         window.addEventListener('mousemove', handleMouseMove);
    //         window.addEventListener('mouseup', handleMouseUp);
    //     } else {
    //         window.removeEventListener('mousemove', handleMouseMove);
    //         window.removeEventListener('mouseup', handleMouseUp);
    //     }

    //     return () => {
    //         window.removeEventListener('mousemove', handleMouseMove);
    //         window.removeEventListener('mouseup', handleMouseUp);
    //     };
    // }, [isDragging]);

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
                height: 12px;
                width: 12px;
                background-color: #FF6C6C;
                // border: 2px solid #FF6C6C;
                border-radius: 50%;
                transition: 0.2s ease-in-out;
                box-shadow:
                0 0 0 3px #fff,
                0 0 0 5px #FF6C6C;
            }
    
            .thumb-inner {
                background-color: #FF6C6C;
                width: 12px;
                height: 12px;
                top: 12px;
                position: absolute;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                z-index: 5;
            }

            @media (max-width: 1000px) {
                .thumb-inner {
                    top: 11px;
                }
            }
    
            input[type="range"]:focus::-moz-range-thumb {
                box-shadow:
                0 0 0 3px #fff,
                0 0 0 5px #FF6C6C;
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
                    min={0}
                    max={5}
                    step={1}
                    value={value}
                    id="range"
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                />
                {/* <span
                    className="thumb-inner"
                    style={{ right: right + 'px' }}
                ></span> */}
                <div className="sliderticks">
                    {marks.map(mark => (
                        <span key={'mark' + mark.value}>{mark.label}</span>
                    ))}
                </div>
            </div>
        </>
    );
};

const HiTechSwitch = ({ hiTech, updateHiTech }) => (
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
            <input type="checkbox" checked={hiTech} onChange={(e) => { updateHiTech(e.target.checked); }} />
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

const RoleInput = ({ placeholder, id, value, updateTitle }) => {
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
            <input type="text" id={id} value={value} placeholder={placeholder} onChange={(e) => updateTitle(e.target.value)} />
        </div>
    )
}

const CustomDateInput = React.forwardRef(({ value, onClick, handleClear }, ref) => (
    <div className="custom-input" onClick={onClick}>
        <input
            type="text"
            value={value}
            readOnly
            placeholder="בחר תאריך"
            ref={ref} // Forward the ref to the input element
        />
        <FaCalendarAlt className="calendar-icon" />
        <button type="button" className='clear-button' onClick={handleClear}>
            ×
        </button>
        <style jsx>{`
            .clear-button {
                position: absolute;
                left: 35px;
                font-size: 16px;
                background: transparent;
                border: none;
            }
        `}</style>
    </div>
));

const DateInput = ({ date, updateDate }) => {
    const [startDate, setStartDate] = useState(date ? parseISO(date) : '');

    const formatDate = (date) => {
        return date ? format(date, 'dd/MM/yyyy') : '';
    };

    const handleClear = () => {
        setStartDate('');
        updateDate(null)
    }

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
            <DatePicker selected={startDate} dateFormat={"dd/MM/yyyy"} onChange={(date) => { setStartDate(date); updateDate(moment(date).format('YYYY-MM-DD')) }} customInput={<CustomDateInput value={formatDate(startDate)} handleClear={handleClear} />} />
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

function Filter({ title, location, employAmount, date, hiTech, companyIndustries, updateTitle, updateLocation, updateIndustry, updateEmployAmount, updateDate, updateHiTech, updateHiTechView }) {
    const handleLocationChange = (e) => {
        updateLocation(e);
    }
    return (
        <>
            <style jsx>{`
                .filter-container {
                    font-family: 'Inter', 'Noto Sans Hebrew', 'Alef', sans-serif;
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
                    border-radius: 4px;
                    width: 100%;
                    height: 43px;
                    color: white;
                    background-color: #FF6C6C;
                    border: none;
                }
                
                .btn-custom:disabled {
                    background-color: rgb(189, 189, 189);
                    border: 1px solid rgba(189, 189, 189, .8);
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
                            <HiTechSwitch hiTech={hiTech} updateHiTech={updateHiTech} />
                        </div>
                        <button className="btn-custom" onClick={updateHiTechView}>Save</button>
                    </div>
                    <div className="number-of-employees">
                        <h4>מספר עובדים בחברה</h4>
                        <div className="slider-container">
                            <EmployeeSlider
                                defaultValue={100}
                                step={null}
                                valueLabelDisplay="auto"
                                marks={marks}
                                updateEmployAmount={updateEmployAmount}
                                employAmount={employAmount}
                            />
                        </div>
                    </div>
                </div>
                <div className="location-role">
                    <div className="location-filter">
                        <LocationInput id="location-input" value={location} placeholder="למשל תל אביב" updateLocation={handleLocationChange} />
                        <RoleInput id="role-input" value={title} placeholder="e.g. Senior Public Relation" updateTitle={e => updateTitle(e)} />
                    </div>
                    <div className="role-filter">
                        <DateInput date={date} updateDate={updateDate} />
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

function MatchedProjects({ projects, serverUrl, user, router }) {
    return (
        <div className="matched-projects">
            {projects.map(project => (
                <ProjectItem key={'project' + project.id} project={project} serverUrl={serverUrl} user={user} router={router} />
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