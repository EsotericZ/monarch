import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

import getAllFLJobs from '../../services/flaser/getAllFLJobs';
import getAllFLMaterials from '../../services/material/getAllFLMaterials';
import getAllTLJobs from '../../services/tlaser/getAllTLJobs';
import getAllTLMaterials from '../../services/material/getAllTLMaterials';

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

    // const areas = [
    //     {
    //         area: 'Fixture Laser',
    //         link: '/fixturelaser',
    //         nest: 0,
    //         image: 'flaser',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Forming',
    //         link: '/forming',
    //         nest: 0,
    //         image: 'forming',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Laser',
    //         link: '/laser',
    //         nest: 0,
    //         image: 'laser',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Punch',
    //         link: '/punch',
    //         nest: 0,
    //         image: 'punch',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Saw',
    //         link: '/saw',
    //         nest: 0,
    //         image: 'saw',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Shear',
    //         link: '/shear',
    //         nest: 0,
    //         image: 'shear',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Static Laser',
    //         link: '/staticlaser',
    //         nest: 0,
    //         image: 'slaser',
    //         areaType: 'production',
    //     },
    //     {
    //         area: 'Tube Laser',
    //         link: '/tubelaser',
    //         nest: 0,
    //         image: 'tlaser',
    //         areaType: 'production',
    //     },
    // ];

    const [totalJobsFL, setTotalJobsFL] = useState(0);
    const [needsNestingFL, setNeedsNestingFL] = useState(0);
    
    const [totalJobsTL, setTotalJobsTL] = useState(0);
    const [needsNestingTL, setNeedsNestingTL] = useState(0);
    
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [flJobs, flMaterials, tlJobs, tlMaterials] = await Promise.all([
                getAllFLJobs(),
                getAllFLMaterials(),
                getAllTLJobs(),
                getAllTLMaterials(),
            ]);
    
            setTotalJobsFL(flJobs.length);
            const flUniq = [...new Set(flMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (flUniq.length > 0) {
                let flJobsNeeded = flJobs.filter(job => !flUniq.includes(job.JobNo))
                setNeedsNestingFL(flJobsNeeded.length);
            }

            setTotalJobsTL(tlJobs.length);
            const tlUniq = [...new Set(tlMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (tlUniq.length > 0) {
                let tlJobsNeeded = tlJobs.filter(job => !tlUniq.includes(job.JobNo))
                setNeedsNestingTL(tlJobsNeeded.length);
            }
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        setAreas([
            {
                area: 'Fixture Laser',
                link: '/fixturelaser',
                nest: needsNestingFL,
                jobs: totalJobsFL,
                image: 'flaser',
                areaType: 'production',
            },
            {
                area: 'Forming',
                link: '/forming',
                nest: 0,
                jobs: 0,
                image: 'forming',
                areaType: 'production',
            },
            {
                area: 'Laser',
                link: '/laser',
                nest: 0,
                jobs: 0,
                image: 'laser',
                areaType: 'production',
            },
            {
                area: 'Punch',
                link: '/punch',
                nest: 0,
                jobs: 0,
                image: 'punch',
                areaType: 'production',
            },
            {
                area: 'Saw',
                link: '/saw',
                nest: 0,
                jobs: 0,
                image: 'saw',
                areaType: 'production',
            },
            {
                area: 'Shear',
                link: '/shear',
                nest: 0,
                jobs: 0,
                image: 'shear',
                areaType: 'production',
            },
            {
                area: 'Static Laser',
                link: '/staticlaser',
                nest: 0,
                jobs: 0,
                image: 'slaser',
                areaType: 'production',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaser',
                nest: needsNestingTL,
                jobs: totalJobsTL,
                image: 'tlaser',
                areaType: 'production',
            },
        ]);
    }, [needsNestingTL]);

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