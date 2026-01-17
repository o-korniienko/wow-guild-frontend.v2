import {showError} from './error-handler.jsx';

export const resolveCSRFToken = () => {
    return fetch("/csrf")
         .then(response => response.status != 200 ? showError(response) :
             response.json())
         .then(data => {
             return data.token
         })
}