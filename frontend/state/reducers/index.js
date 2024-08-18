import {combineReducers} from "redux";
import filterReducer from "./filterReducer";

const reducers = combineReducers({
    
    filters: filterReducer
})

export default reducers;