import {message} from 'antd';

export const showError = (response) => {
    response.text().then(errorMessage => {
        message.error("Oooops, something goes wrong. \n error: " + response.status
            + "\n error description: " + response.statusText
            + ".\n error message: " + errorMessage, 10)
    })
}

export const showErrorAndSetFalse = (response, setSending) => {
    if (setSending !== null && setSending !== undefined) {
        setSending(false);
    }
    response.text().then(errorMessage => {
        message.error("Oooops, something goes wrong. \n error: " + response.status
            + "\n error description: " + response.statusText
            + ".\n error message: " + errorMessage, 10)
    })
}