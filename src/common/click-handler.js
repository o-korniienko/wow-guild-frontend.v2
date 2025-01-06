export const clickHandler = (form, event) => {
    console.log("here")
    if (event.key === 'Enter' && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
        form.submit();
    }
}