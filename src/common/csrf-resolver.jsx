import {showError} from './error-handler.jsx';
import {API_BASE_URL} from "../constants/apiConstants";
import Cookies from "universal-cookie";

/*export const resolveCSRFToken = () => {
    return fetch(API_BASE_URL +'/csrf')
         .then(response => response.status != 200 ? showError(response) :
             response.json())
         .then(data => {
             return data.token
         })
}

export const resolveCSRFTokenAsync = async () => {
    const response = await fetch(API_BASE_URL + '/csrf', {
        credentials: 'include'
    });

    if (!response.ok) {
        showError(response)
    }

    const data = await response.json();
    return data.token;
}*/

export const getCSRFToken = () => {
    const cookies = new Cookies();
    return cookies.get('XSRF-TOKEN');
};