import { useEffect, useState } from 'react';
import getAllScales from "../../services/scales/getAllScales";

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import PuffLoader from "react-spinners/PuffLoader";

import { Sidebar } from '../sidebar/Sidebar';

export const Scales = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            console.log('hit')
            const scales = await getAllScales();
            console.log(scales)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Scales</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Scales</h1>
                        <>
                            <div className='text-center m-3'>
                                Website Requests
                            </div>
                        </>
                </div>
            }
        </div>
    )
}