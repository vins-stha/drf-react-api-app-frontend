import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {IsOwner} from "./Requests";

export const Form = () => {
    const {state} = useLocation();

    const [title, setTitle] = useState(state ? state.title : '');
    const [description, setDescription] = useState(state ? state.description : '');
    const [status, setStatus] = useState('');
    const isEdit = state ? true : false;
    const [cookies, setCookie, removeCookie] = useCookies([]);

    let navigate = useNavigate();

    const handleButtonClick = async (action) => {
        let isOwner =  await IsOwner(state.id, cookies.user_id);
        console.log('isOWnder',isOwner)
        const url =  `http://localhost:8000/api/todo/`;

            if (action === 'update') {
                if (!isOwner)
                    return alert('Please login with appropriate credential to perform this action');
                fetch(`${url}${state.id}`,{
                    'method': 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':'Token ' + cookies.auth_token
                    },
                    body: JSON.stringify({title,description})
                })
                    .then(res => res.json())
                    .then(resp =>
                       resp.detail === "Invalid token." ? alert('Your are not allowed to perfrom this action!'):navigate('/')
                    )
                    .catch(error => console.log(error))
            }
            else {

                fetch(`${url}`,{
                    'method': 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':'Token ' + cookies.auth_token
                    },
                    body: JSON.stringify({title,description})
                })
                    .then(res => res.json())
                    .then(resp => {
                        console.log('Added successfuly');
                        navigate('/');
                    })
                    .catch(error => console.log(error))
            }

    };
    return (

        (<>
            {isEdit ?<h1>Update </h1>:<h1>Add new task </h1> }
                <div className="article-card edit">
                    <h2 className={'update-title'}>Enter details for your task </h2>
                    <h3>Title</h3>
                    <input type="text" className={'textbox'}
                           name={"title"}
                           value={title}
                           className={'form_input'}
                           onChange={e => {
                               setTitle(e.target.value)
                           }}/>
                    <h3>Description</h3>
                    <textarea type="textarea" className={'textbox'}
                              name={"description"}
                              defaultValue={description}
                              className={'form_input'}
                              onChange={e => setDescription(e.target.value)}
                    />
                    <div className="btn-container">
                        {isEdit ? (<button className="btn btn-primary"
                                           onClick={e => {
                                               e.preventDefault();
                                               handleButtonClick('update');
                                           }}
                        >Update
                        </button>) :
                            (<button className="btn btn-primary"
                                              onClick={e => {
                                                  e.preventDefault();
                                                  handleButtonClick('add');
                                              }}
                        >Add
                        </button>)}

                    </div>

                </div>


            </>

        )

    )
};