import {useEffect, useState} from "react";


import {InputAutocomplete} from "./InputAutocomplete";
import {JobSearchSelectFilter} from "./pages/JobSearchSelectFilter";
import {useSelector, useDispatch} from "react-redux";
import {bindActionCreators} from "redux";


import {actionCreators} from "../state/index"

export function JobSearch({
                              // companySize,
                              companyIndustry,
                              jobLocations,
                              jobTitles,
                              // jobFilters,
                              // setJobFilters,
                              _getJobs,
                              _applyFilters,
                              // resetFiltersRand,
                              // searchSelectFieldValues,
                              // firstRenderFilters
                          }) {

    const state = useSelector((state) => state)
    const {location, industry, title} = state.filters;
    const dispatch = useDispatch()
    const {
        updateIndustry, updateLocation, updateTitle, reset
    } = bindActionCreators(actionCreators, dispatch)
    const [openedAutoComplete, setOpenedAutocomplete] = useState(null)
    // const [industrySelectValue, setIndustrySelectValue] = useState(firstRenderFilters && firstRenderFilters.companyIndustry || "ALL")
    // useEffect(() => {
    //     document.querySelector("#company-industry-select").value = "ALL"
    // }, [resetFiltersRand])

    return (
        <form className="row " onSubmit={(event) => {
            event.preventDefault();
            _applyFilters();
        }}>
            <input type="submit" className={"d-none"}/>
            <div className="col-12 ">
                <div className="row m-1 job-search  p-1 justify-content-center bg-white rounded-xl align-items-center">
                    <div className=" col-md-3">


                        <InputAutocomplete
                            // resetFiltersRand={resetFiltersRand}
                            Icon={() => <i className={"fas fa-search"}></i>}
                            options={jobTitles}
                            onSelect={(selectedValue) => updateTitle(selectedValue)}
                            placeholder={"Search title..."}
                            _setOpenedAutoComplete={setOpenedAutocomplete}
                            openedAutoComplete={openedAutoComplete}
                            initialValue={title}
                            id={"jobTitle"}
                            updateValue={updateTitle}
                        />
                    </div>
                    <div className=" col-md-3">
                        <InputAutocomplete
                            // resetFiltersRand={resetFiltersRand}
                            Icon={() => <i className="fas fa-map-marker-alt"></i>}
                            options={jobLocations}
                            onSelect={(selectedValue) => updateLocation(selectedValue)}
                            placeholder={"Search location..."}
                            _setOpenedAutoComplete={setOpenedAutocomplete}
                            openedAutoComplete={openedAutoComplete}
                            initialValue={location}
                            id={"jobLocation"}
                            updateValue={updateLocation}
                        />

                        {/*<div className="input-icon">*/}
                        {/*    <input name={"jobLocation"} type="text" className="form-control"*/}
                        {/*           placeholder="Search location..."/>*/}
                        {/*    <span><i className="fas fa-map-marker-alt"></i></span>*/}
                        {/*</div>*/}
                    </div>
                    <div className="col-md-3">
                        <select
                            id={"company-industry-select"}
                            className={"form-control"}
                            onChange={event => updateIndustry(event.target.value !== "ALL" ? event.target.value : null)}

                        >
                            <option value={"ALL"}>Select industry...</option>


                            {companyIndustry.map((item, index) => {
                               
                                if (item === industry)
                                    return (
                                        <option key={item} value={item} selected>
                                            {item}
                                        </option>
                                    )
                                else
                                    return (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    )
                            })}
                        </select>
                    </div>

                    <div className={"col-md-3"}>
                        <a href={"#"} className={"btn btn-dark btn-block"} onClick={_applyFilters}>Search</a>
                    </div>


                </div>


            </div>
        </form>
    )
}