
import config from "../config/default.js"
import Router from "next/router"
const serverUrl = config.domain.server
import * as React from "react";
import {NotifyComponent} from "./shared/Notify";



export class App extends React.Component {

    constructor() {
        super();
        const initialState = {
            user:null,
        }
        this.state = initialState

    }
    componentDidMount() {
        this.getUser()
    }
    componentWillUnmount(){
    }
    static getInitialProps({query}) {
        return {query}
    }
    async wait(s){
        return new Promise(res => setTimeout(res, s*1000))
    }
    async getUser(){
        const userData = Cookie.get('userDetails');
        console.log(userData)
        // const baseServerUrl = serverUrl;
        // const [json, res] = await this.getRequestAuthenticated(`${baseServerUrl}/user`)
        // if (res.status < 300 && res.status >= 200){
        //     this.setState({user: json}, () => {
        //         return true;
        //     })
        // } else {
        //     // NotifyComponent('info', json.message)
        //     await this.wait(1);
        //     Router.push('/login')
        // }
    }

    async logOut(){
        const baseServerUrl = serverUrl;
        const [json, res] = await this.postRequestAuthenticated(`${baseServerUrl}/auth/logout`)
        if (res.status < 300 && res.status >= 200){
            window.location.href = "/login"
        } else {
            NotifyComponent('info', json.message)

        }
    }

    async processRequest(type="get", url, headers={}, body={}){
        let response, originalResponse;
        if ( type==='get' ){
            [response, originalResponse] = await this.getRequestAuthenticated(url, headers)
        } else  if ( type==='post' ){
            [response, originalResponse] = await this.postRequestAuthenticated(url, body)
        }  else  if ( type==='delete' ){
            [response, originalResponse] = await this.deleteRequestAuthenticated(url, body)
        } else  if ( type==='put' ){
            [response, originalResponse] = await this.putRequestAuthenticated(url, body)
        }

        if (originalResponse.status >= 200 && originalResponse.status < 300){
            return response;
        } else {
            if (response.responseMessage){
                throw new Error(response.responseMessage)
            } else if (response.originalErrorMessage) {
                throw new Error(response.originalErrorMessage)
            } else {
                throw new Error(response.message)
            }
        }
    }



    async getRequest(url, headers={}){
        const response =  await fetch(url, {headers: {...headers, credentials:"include"}})
        return [await response.json(), response]
    }
    async getRequestAuthenticated(url){
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        const response = await fetch(url, {headers: {...headers}, credentials:"include"})
        try {
            return [await response.json(), response]
        } catch (error){
            return [null, response]
        }
    }
    async postRequest(url, headers, body={}){

        const response = await fetch(url, {
            method: "POST",
            headers: {...headers, ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }},
            credentials: "include",
            body: JSON.stringify(body)
        })
        try {
            return [await response.json(), response]
        } catch (error){
            return [null, response]
        }

    }
    async putRequest(url, headers, body={}){

        const response = await fetch(url, {
            method: "PUT",
            headers: {...headers, ...{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }},
            credentials: "include",
            body: JSON.stringify(body)
        })
        try {
            return [await response.json(), response]
        } catch (error){
            return [null, response]
        }

    }

    async postRequestAuthenticated(url, body){
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(body)
        })
        try {
            return [await response.json(), response]
        } catch (error){
            return [null, response]
        }
    }

    async putRequestAuthenticated(url, body){
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(body)
        })
        try {
            return [await response.json(), response]
        } catch (error){
            return [null, response]
        }
    }

    async deleteRequestAuthenticated(url){
        console.log(url)
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
        })
        try {
            return [await response.json(), response]
        } catch (error){
            console.log(error)
            return [null, response]
        }
    }

    logout(){
        cookie.remove('authToken') // localStorage.removeItem("authToken")
        window.location.href = "/login"
    }

}