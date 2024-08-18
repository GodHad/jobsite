import {useEffect} from "react/cjs/react.production.min";

export const Requests = async (type = "get", url, headers = {}, body = {}) => {
    // useEffect(async () => {
    // }, [])
    let response, originalResponse;
    if (type === 'get') {
        [response, originalResponse] = await getRequestAuthenticated(url, headers)
    } else if (type === 'post') {
        [response, originalResponse] = await postRequestAuthenticated(url, headers, body)
    } else if (type === 'post-form-data') {
        [response, originalResponse] = await postRequestAuthenticatedFormData(url, headers, body)
    } else if (type === 'delete') {
        [response, originalResponse] = await deleteRequestAuthenticated(url)
    } else if (type === 'put') {
        [response, originalResponse] = await putRequestAuthenticated(url, body)
    } else if (type === 'put-form-data') {
        [response, originalResponse] = await putRequestAuthenticatedFormData(url, headers, body)
    }

    if (originalResponse.status >= 200 && originalResponse.status < 300) {
        return response;
    } else {
        if (response.responseMessage) {
            throw new Error(response.responseMessage)
        } else if (response.originalErrorMessage) {
            throw new Error(response.originalErrorMessage)
        } else {
            throw new Error(response.message)
        }
    }

}

async function getRequestAuthenticated(url) {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    const response = await fetch(url, {headers: {...headers}, credentials: "include"})
    try {
        return [await response.json(), response]
    } catch (error) {
        return [null, response]
    }
}

async function deleteRequestAuthenticated(url, body) {
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(body)
    })
    try {
        return [await response.json(), response]
    } catch (error) {
        return [null, response]
    }
}

async function postRequestAuthenticated(url, headers, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers,

        },
        credentials: "include",
        body: JSON.stringify(body)
    })
    try {
        return [await response.json(), response]
    } catch (error) {
        return [null, response]
    }
}

async function putRequestAuthenticated(url, body) {
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
    } catch (error) {
        return [null, response]
    }
}

async function postRequestAuthenticatedFormData(url, headers, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            ...headers,

        },
        credentials: "include",
        body: body
    })
    try {
        return [await response.json(), response]
    } catch (error) {
        return [null, response]
    }
}

async function putRequestAuthenticatedFormData(url, headers, body) {
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            ...headers
        },
        credentials: "include",
        body: body
    })
    try {
        return [await response.json(), response]
    } catch (error) {
        return [null, response]
    }
}


