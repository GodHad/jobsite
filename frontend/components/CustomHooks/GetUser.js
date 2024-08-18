
import Cookie from "js-cookie"
import config from "../../config/default.js"
import {Requests} from "./Requests";

const serverUrl = config.domain.server
export async function GetUser(page= null){

    try {

        // const userData = Cookie.get('userDetails')

        // if (userData){
        //     userData = JSON.parse(userData);
        // }

        // if (!userData && page !== "/") window.location.href = "/sign-in"
        //
        // else return userData;
        const url = `${serverUrl}/user`
        const userData = await Requests('get', url )
        return userData
    } catch (error){
        if (page !== "/") window.location.href = "/sign-in"
            // window.location.href = serverUrl+"/auth/linkedin"
        else return null;
    }

}