export const clickHandler = (form, event) => {
    if (event.key === 'Enter' && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
        form.submit();
    }
}