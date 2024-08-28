export const updatePageSize = (pageSize) => {
    return (dispatch) => {
        dispatch({
            type: "SET_PAGE_SIZE",
            payload: pageSize
        })
    }
}

export const updatePage = (page) => {
    return (dispatch) => {
        dispatch({
            type: "SET_PAGE",
            payload: page
        })
    }
}

export const updateLocation = (location) => {
    return (dispatch) => {
        dispatch({
            type: "SET_LOCATION",
            payload: location
        })
    }
}
export const updateIndustry = (industry) => {
    return (dispatch) => {
        dispatch({
            type: "SET_INDUSTRY",
            payload: industry
        })
    }
}
export const updateTitle = (title) => {
    return (dispatch) => {
        dispatch({
            type: "SET_TITLE",
            payload: title
        })
    }
}
export const updateEmployAmount = (value) => {
    return (dispatch) => {
        dispatch({
            type: "SET_EMPLOYAMOUNT",
            payload: value
        })
    }
}
export const updateDate = (value) => {
    return (dispatch) => {
        dispatch({
            type: "SET_DATE",
            payload: value
        })
    }
}
export const reset = (res) => {
    return (dispatch) => {
        dispatch({
            type: "RESET_FILTERS",
        })
    }
}