import React, {useState, useEffect} from 'react'
import {useCookies} from 'react-cookie';
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios'

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const navigate = useNavigate();
    const {state} = useLocation();
    const [message, setMessage] = useState();

    useEffect(() => {

    }, [message]);
    const handleLogin = async (e) => {

        e.preventDefault();

        try {
            let response = await fetch("http://localhost:8000/api/auth/", {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                throw new Error(`An error occured: ${response.status} ${response.statusText}`);
                setMessage({status: response.status, message: response.statusText});
            };

            let result = await response.json();
            console.log("token=", result, result.token);

            setMessage({status: 200, message: 'Login Successful!'});
            setToken(result.token);
            setCookie('auth_token', result.token);
            setCookie('isAuthorized', true);
            setCookie('user_id', result.id);
            navigate('/');

        } catch (error) {
            console.log('error occured', error)
        }

    };

    const handleSignup = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/api/users/", {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: username,
                password: password
            })

        })
            .then(res => {
                res.json();

                setMessage({message: res.statusText, code: res.status})
                if (res.status !== 400)
                    navigate('/login')
            })
            .catch(error => console.log(error))
    };

    return (
        <>
            <div className="form_container">

                <form method="post">
                    {message && <h4>{message.message} {message.code !== 400 ? 'Please login' : ''}</h4>}
                    <table>
                        <tbody>
                        <tr className={'form_tr'}>
                            <td>Username</td>
                            <td><input type="text"
                                       onChange={e => setUsername(e.target.value)}
                                       className={'form_input'}
                            />
                            </td>

                        </tr>
                        <tr className={'form_tr'}>
                            <td>Password</td>
                            <td><input type="password"
                                       onChange={e => setPassword(e.target.value)}
                                       className={'form_input'}
                            /></td>
                        </tr>
                        </tbody>

                    </table>
                    {state !== null ? (
                            <input className={'btn btn-outline-primary'} type="submit" value="Signup"
                                   onClick={e => handleSignup(e)}/>
                        )
                        :
                        (<input className={'btn_login btn'} type="submit" value="Login"
                                onClick={e => handleLogin(e)}/>)}

                </form>
            </div>
        </>
    )
};