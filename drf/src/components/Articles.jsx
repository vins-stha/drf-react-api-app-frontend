import React, {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom'
import {IsOwner} from "./Requests";

export const Articles = () => {

    const [articles, setArticles] = useState([]);
    const [enableEdit, setEnableEdit] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const [deleteAction, setDeleteAction] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(cookies.auth_token && cookies.isAuthorized ? true : false)

    let navigate = useNavigate();

    useEffect(() => {

        fetch('http://localhost:8000/api/todo/')
            .then(res => res.json())
            .then(resp => {
                setArticles(resp.results)
            })
            .catch(error => console.log(error))

    }, [enableEdit, deleteAction, isAuthorized]);

    const handleDelete = async (article) => {
       let isOwner = await IsOwner(article.id,cookies.user_id);

       if (window.confirm("Are you sure ?") == true) {
           if (isOwner)
           {
               fetch(`http://localhost:8000/api/todo/${article.id}`, {
                   'method': 'DELETE',
                   headers: {
                       'Authorization': 'Token ' + cookies.auth_token
                   },
               })
                   .then(res => {
                       res.json();
                       res.status === 401 ? alert('Your are not authorized to perform this action!') :
                           setDeleteAction(true)
                   })

                   .catch(error => console.log('Something went wrong!', error));
           }
           else {
               alert('Please login with appropriate credentials!');
           }
        }
    };

    return (<>
        <h1>REST API powered by Django Rest Framework</h1>

        {articles.map((article) =>

            <div className="article-card">
                <div className="title">

                    <h3 key={article.id}> {article.title}</h3>

                </div>
                <div className="description">
                    <p> {article.description}</p>
                </div>
                <div className="extra-info">
                    <div className="author">{article.owner}</div>
                    <div className="date">{article.created}</div>
                </div>

                <div className="btn-container">
                    <button className="btn btn-primary"
                            onClick={e => {
                                e.preventDefault();
                                navigate("/task", {state: article});
                            }}
                    >Update
                    </button>
                    <button className="btn btn-danger" onClick={e => {
                        e.preventDefault();
                        handleDelete(article)
                    }}>Delete
                    </button>
                </div>
            </div>
        )
        }
    </>)

};