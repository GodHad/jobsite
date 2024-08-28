const filterReducerState = {
    title: "",
    location: "",
    industry: "", 
    pageSize: 10, 
    page: 1,
    employAmount: 0,
    date: null
}

const reducer = (state = filterReducerState, action) => {

    switch (action.type) {
        case "SET_LOCATION":
            return {...state, location: action.payload};
        case "SET_TITLE":
            return {...state, title: action.payload};
        case "SET_PAGE":
            return {...state, page: action.payload};
        case "SET_PAGE_SIZE":
            return {...state, pageSize: action.payload};
        case "SET_INDUSTRY":
            return {...state, industry: action.payload};
        case "SET_EMPLOYAMOUNT": 
            return {...state, employAmount: action.payload};
        case "SET_DATE":
            return {...state, date: action.payload}
        case "RESET_FILTERS":
            return filterReducerState;
        default:
            return state;
    }
}

export default reducer;