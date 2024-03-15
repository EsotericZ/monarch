import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

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

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        setAreas([
            {
                area: 'Fixture Laser',
                link: '/fixturelaser',
                image: 'flaser',
                areaType: 'production',
            },
            {
                area: 'Forming',
                link: '/forming',
                image: 'forming',
                areaType: 'production',
            },
            {
                area: 'Laser',
                link: '/laser',
                image: 'laser',
                areaType: 'production',
            },
            {
                area: 'Punch',
                link: '/punch',
                image: 'punch',
                areaType: 'production',
            },
            {
                area: 'Saw',
                link: '/saw',
                image: 'saw',
                areaType: 'production',
            },
            {
                area: 'Shear',
                link: '/shear',
                image: 'shear',
                areaType: 'production',
            },
            {
                area: 'Static Laser',
                link: '/staticlaser',
                image: 'slaser',
                areaType: 'production',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaser',
                image: 'tlaser',
                areaType: 'production',
            },
        ]);
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
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
        </div>
    )
}