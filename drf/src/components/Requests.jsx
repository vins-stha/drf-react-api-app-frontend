
export const BASE_URL = "http://localhost:8000/";

export const Request = async (params) =>{

    const {url,method,body,action} = params

    let message

    let response = await fetch(`${BASE_URL}${url}`, {
        'method': method,
        headers: {
            'Content-Type': action === "LOGIN" ? 'application/json' :  'application/x-www-form-urlencoded',
        },
        body: action === "LOGIN" || action === "SIGNUP" ? action === "LOGIN" ?
           JSON.stringify({username:body.username, password:body.password}):body
            :
            JSON.stringify({title:body.title, description:body.description})
    });

    if (!response.ok || response.status >= 400) {
        // throw new Error(`An error occured: ${response.status} ${response.statusText}`);
        message = {status: response.status, message: response.statusText};
    } else {
        let result = await response.json();
        message = {status: 200, result: result};
    }
    return message

};

export const IsOwner = async (article_id, user_id) => {
    let response = await fetch(`${BASE_URL}api/users/${user_id}`);
    if (!response.ok) {
        throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }
    ;

    let result = await response.json();

    return result.todos.filter(id => id === article_id).length > 0 ? true : false

};