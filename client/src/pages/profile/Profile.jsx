import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import PuffLoader from "react-spinners/PuffLoader";

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

export const Profile = () => {
    const cookies = new Cookies();
    
    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        cookies.remove('jwt', { path: '/', domain:'' });
        setLoggedIn(false);
    }

    useEffect(() => {
        try {
            setCookieData(jwt_decode(cookies.get('jwt')));
            setLoggedIn(true)
        } catch {
            setCookieData('');
        }
    }, [loggedIn])

    useEffect(() => {
        {cookieData.engineering && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Engineering',
                    link: '/engineering',
                    image: 'engineering',
                    areaType: 'programming',
                },
            ])
        }
        {cookieData.machining && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Machining',
                    link: '/machining',
                    image: 'machining',
                    areaType: 'programming',
                },
            ])
        }
        {cookieData.quality && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Quality',
                    link: '/quality',
                    image: 'quality',
                    areaType: 'programming',
                },
            ])
        }
        {cookieData.tlaser && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Tube Laser',
                    link: '/tubelaserprog',
                    image: 'tlaser',
                    areaType: 'programming',
                },
            ])
        }
        {cookieData.forming && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Forming',
                    link: '/formingprog',
                    image: 'forming',
                    areaType: 'programming',
                },
            ])
        }
        {cookieData.laser && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Fixture Laser',
                    link: '/fixturelaser',
                    image: 'flaser',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.forming && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Forming',
                    link: '/forming',
                    image: 'forming',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.laser && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Laser',
                    link: '/laser',
                    image: 'laser',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.punch && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Punch',
                    link: '/punch',
                    image: 'punch',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.forming && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Saw',
                    link: '/saw',
                    image: 'saw',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.shear && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Shear',
                    link: '/shear',
                    image: 'shear',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.laser && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Static Laser',
                    link: '/staticlaser',
                    image: 'slaser',
                    areaType: 'production',
                },
            ])
        }
        {cookieData.tlaser && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Tube Laser',
                    link: '/tubelaser',
                    image: 'tlaser',
                    areaType: 'production',
                },
            ])
        }
        {(cookieData.engineering || cookieData.quality) && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'QC Info',
                    link: '/qualityinfo',
                    image: 'qcInfo',
                    areaType: 'tooling',
                },
            ])
        }
        {(cookieData.engineering || cookieData.quality || cookieData.machining) && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Tap Chart',
                    link: '/tapchart',
                    image: 'tap',
                    areaType: 'tooling',
                },
                {
                    area: 'Hardware',
                    link: '/hardware',
                    image: 'hardware',
                    areaType: 'tooling',
                },
            ])
        }
        {(cookieData.engineering || cookieData.forming) && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Bend Deduction',
                    link: '/benddeduction',
                    image: 'bd',
                    areaType: 'tooling',
                },
            ]);
        }
        setLoading(false);
    }, [loggedIn]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loggedIn ?
                <>
                    {loading ?
                        <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                            <h1 className='text-center m-3'>Monarch Metal</h1>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                                <PuffLoader color="red" />
                            </div>
                        </div>
                    :
                        <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                            <h2 className='text-center m-3'>{cookieData.name}</h2>
                            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                {areas.map((area, index) => {
                                    return (
                                        <DepartmentCard key={index} area={area} />
                                    )
                                })}
                            </div>
                            <NavLink exact to='/'>
                                <div className='text-center'>
                                    <button onClick={handleLogout} className='text-center m-3 mmBtn'>Logout</button>
                                </div>
                            </NavLink>
                        </div>
                    }
                </>
            :
                <>
                    <NavLink exact to='/login'>
                        <div className='text-center'>
                            <button className='m-5 mmBtn'>Log In</button>
                        </div>
                    </NavLink>
                </>
            }
        </div>
    )
}