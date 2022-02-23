import React, {useState} from "react";


export const BASE_URL = "http://localhost:8000/";

// export const Request = ({url,method,body,action}) =>{
//
//
// };

export const IsOwner = async (article_id, user_id) => {
    let response = await fetch(`${BASE_URL}api/users/${user_id}`);
    if (!response.ok) {
        throw new Error(`An error occured: ${response.status} ${response.statusText}`);
    }
    ;

    let result = await response.json();

    return result.todos.filter(id => id === article_id).length > 0 ? true : false

};