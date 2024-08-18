export function getFormInputValues(event){
    const body = {}
    const inputs = event.target.querySelectorAll("input")

    for (const input of inputs){
        body[input.getAttribute("name")] = input.value;
    }
    const selects = event.target.querySelectorAll("select")
    for (const select of selects){
        body[select.getAttribute("name")] = select.value;
    }

    const textareas = event.target.querySelectorAll("textarea")
    for (const textarea of textareas){
        body[textarea.getAttribute("name")] = textarea.value;
    }
    return body;
}