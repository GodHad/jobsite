const filterReducerState = {
    title: "",
    location: "",
    industry: "", pageSize: 10, page: 1
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
        case "RESET_FILTERS":
            return filterReducerState;
        default:
            return state;
    }
}

export default reducer;