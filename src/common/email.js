export const validateEmail = (rule, value) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value !== "" && value !== undefined) {
        if (value.includes(";")) {
            const emails = value.split(";")

            let message = "Invalid emails: "
            let isAllValid = true
            for (let i = 0; i < emails.length; i++) {

                if (!emailRegex.test(emails[i])) {
                    isAllValid = false
                    message = message + emails[i] + "; "
                }

            }
            if (isAllValid) {
                return Promise.resolve();
            } else {
                message = message + "Please enter a valid email addresses"
                return Promise.reject(message)
            }
        } else {
            if (emailRegex.test(value)) {
                return Promise.resolve();
            }
            return Promise.reject('Please enter a valid email addresses');
        }
    }
    return Promise.resolve();
}