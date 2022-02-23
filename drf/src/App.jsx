import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Header} from './components/Header';
import {Articles} from './components/Articles'
import {Login} from './components/Login'
import {Form} from "./components/Form";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

const App = () => {
    const[cookies, setCookies] = useCookies();

    return (<>
            <BrowserRouter>
                <Header isLoggedIn={cookies.auth_token && cookies.isAuthorized ? true: false}/>

                <Routes>
                    <Route path={"/"}element={<Articles/>}></Route>
                    <Route path={"/login"} element={<Login/>}></Route>,
                    <Route path={"/signup"} element={<Login/>}></Route>

                    <Route path={"/task"} element={<Form props=""/>}></Route>


                </Routes>
            </BrowserRouter>

        </>

    )
        ;
};

export default App;
