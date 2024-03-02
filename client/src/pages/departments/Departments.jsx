import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

import flaserIcon from '../../images/flaserIcon.png';
import formingIcon from '../../images/formingIcon.png';


export const Departments = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'engineering': false,
        };
    }
    
    const areas = [
        {
            area: 'Fixture Laser',
            link: '/fixturelaser',
            nest: 0,
            image: 'flaser',
            areaType: 'production',
        },
        {
            area: 'Forming',
            link: '/forming',
            nest: 0,
            image: 'forming',
            areaType: 'production',
        },
        {
            area: 'Laser',
            link: '/laser',
            nest: 0,
            image: 'laser',
            areaType: 'production',
        },
        {
            area: 'Punch',
            link: '/punch',
            nest: 0,
            image: 'punch',
            areaType: 'production',
        },
        {
            area: 'Saw',
            link: '/saw',
            nest: 0,
            image: 'saw',
            areaType: 'production',
        },
        {
            area: 'Shear',
            link: '/shear',
            nest: 0,
            image: 'shear',
            areaType: 'production',
        },
        {
            area: 'Static Laser',
            link: '/staticlaser',
            nest: 0,
            image: 'slaser',
            areaType: 'production',
        },
        {
            area: 'Tube Laser',
            link: '/tubelaser',
            nest: 0,
            image: 'tlaser',
            areaType: 'production',
        },
    ];

    const [loading, setLoading] = useState(false);
    
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Departments</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Departments</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        {areas.map((area, index) => {
                            return (
                                <DepartmentCard key={index} area={area} />
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}