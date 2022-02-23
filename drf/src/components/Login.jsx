import React, {useState, useEffect} from 'react'
import {useCookies} from 'react-cookie';
import {useNavigate, useLocation} from 'react-router-dom'
import {Request} from "./Requests";

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
        let body = {
            username: username,
            password: password
        };
        try {
            const params = {
                url: 'api/auth/',
                method: 'POST',
                body: body,
                action: 'LOGIN'
            };
            let response = await Request(params);

            setMessage({
                status: response.status,
                message: response.status === 200 ? 'Login Successful!' : response.message
            });

            if (response.status === 200) {
                setToken(response.result.token);
                setCookie('auth_token', response.result.token);
                setCookie('isAuthorized', true);
                setCookie('user_id', response.result.id);
                window.location.href="/";
            }

        } catch (error) {
            console.log('Something went wrong', error)
        }

    };

    const handleSignup = async (e) => {
        e.preventDefault();

           let body = new URLSearchParams({
                username: username,
                password: password
            });
        try {
            const params = {
                url: 'api/users/',
                method: 'POST',
                body: body,
                action: 'SIGNUP'
            };
            let response = await Request(params);
                      setMessage({
                status: response.status,
                message: response.status === 200 ? 'User created Successful!' : response.message
            });

            if (response.status === 200) {
                navigate('/login');
            }

        } catch (error) {
            console.log('Something went wrong', error)
        }
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