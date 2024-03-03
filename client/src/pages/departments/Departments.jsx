import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

import getAllFLJobs from '../../services/flaser/getAllFLJobs';
import getAllFLMaterials from '../../services/material/getAllFLMaterials';

import getAllFormJobs from '../../services/forming/getAllFormJobs';

import getAllLaserJobs from '../../services/laser/getAllLaserJobs';
import getAllLaserMaterials from '../../services/material/getAllLaserMaterials';

import getAllPunchJobs from '../../services/punch/getAllPunchJobs';
import getAllPunchMaterials from '../../services/material/getAllPunchMaterials';

import getAllSawJobs from '../../services/saw/getAllSawJobs';
import getAllSawMaterials from '../../services/material/getAllSawMaterials';

import getAllShearJobs from '../../services/shear/getAllShearJobs';
import getAllShearMaterials from '../../services/material/getAllShearMaterials';

import getAllSLJobs from '../../services/slaser/getAllSLJobs';
import getAllSLMaterials from '../../services/material/getAllSLMaterials';

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

    const [totalJobsFL, setTotalJobsFL] = useState(1);
    const [needsNestingFL, setNeedsNestingFL] = useState(1);

    const [totalJobsForm, setTotalJobsForm] = useState(1);
    const [needsNestingForm, setNeedsNestingForm] = useState(0);

    const [totalJobsLaser, setTotalJobsLaser] = useState(1);
    const [needsNestingLaser, setNeedsNestingLaser] = useState(1);

    const [totalJobsPunch, setTotalJobsPunch] = useState(1);
    const [needsNestingPunch, setNeedsNestingPunch] = useState(1);
    
    const [totalJobsSaw, setTotalJobsSaw] = useState(1);
    const [needsNestingSaw, setNeedsNestingSaw] = useState(1);
    
    const [totalJobsShear, setTotalJobsShear] = useState(1);
    const [needsNestingShear, setNeedsNestingShear] = useState(1);
    
    const [totalJobsSL, setTotalJobsSL] = useState(1);
    const [needsNestingSL, setNeedsNestingSL] = useState(1);
    
    const [totalJobsTL, setTotalJobsTL] = useState(1);
    const [needsNestingTL, setNeedsNestingTL] = useState(1);
    
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [
                flJobs,
                flMaterials,
                laserJobs,
                laserMaterials,
                punchJobs,
                punchMaterials,
                sawJobs,
                sawMaterials,
                shearJobs,
                shearMaterials,
                slJobs,
                slMaterials,
                tlJobs,
                tlMaterials
            ] = await Promise.all([
                getAllFLJobs(),
                getAllFLMaterials(),
                getAllLaserJobs(),
                getAllLaserMaterials(),
                getAllPunchJobs(),
                getAllPunchMaterials(),
                getAllSawJobs(),
                getAllSawMaterials(),
                getAllShearJobs(),
                getAllShearMaterials(),
                getAllSLJobs(),
                getAllSLMaterials(),
                getAllTLJobs(),
                getAllTLMaterials(),
            ]);

            setTotalJobsFL(flJobs.length);
            const flUniq = [...new Set(flMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (flUniq.length > 1) {
                let flJobsNeeded = flJobs.filter(job => !flUniq.includes(job.JobNo))
                setNeedsNestingFL(flJobsNeeded.length);
            } else {
                setNeedsNestingFL(flJobs.length);
            }
    
            setTotalJobsLaser(laserJobs.length);
            const laserUniq = [...new Set(laserMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (laserUniq.length > 1) {
                let laserJobsNeeded = laserJobs.filter(job => !laserUniq.includes(job.JobNo))
                setNeedsNestingLaser(laserJobsNeeded.length);
            } else {
                setNeedsNestingLaser(laserJobs.length);
            }
    
            setTotalJobsPunch(punchJobs.length);
            const punchUniq = [...new Set(punchMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (punchUniq.length > 1) {
                let punchJobsNeeded = punchJobs.filter(job => !punchUniq.includes(job.JobNo))
                setNeedsNestingPunch(punchJobsNeeded.length);
            } else {
                setNeedsNestingPunch(punchJobs.length);
            }
    
            setTotalJobsSaw(sawJobs.length);
            const sawUniq = [...new Set(sawMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (sawUniq.length > 1) {
                let sawJobsNeeded = sawJobs.filter(job => !sawUniq.includes(job.JobNo))
                setNeedsNestingSaw(sawJobsNeeded.length);
            } else {
                setNeedsNestingSaw(sawJobs.length);
            }
    
            setTotalJobsShear(shearJobs.length);
            const shearUniq = [...new Set(shearMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (shearUniq.length > 1) {
                let shearJobsNeeded = shearJobs.filter(job => !shearUniq.includes(job.JobNo))
                setNeedsNestingShear(shearJobsNeeded.length);
            } else {
                setNeedsNestingShear(shearJobs.length);
            }

            setTotalJobsSL(slJobs.length);
            const slUniq = [...new Set(slMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (slUniq.length > 1) {
                let slJobsNeeded = slJobs.filter(job => !slUniq.includes(job.JobNo))
                setNeedsNestingSL(slJobsNeeded.length);
            } else {
                setNeedsNestingSL(slJobs.length);
            }

            setTotalJobsTL(tlJobs.length);
            const tlUniq = [...new Set(tlMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];
            if (tlUniq.length > 1) {
                let tlJobsNeeded = tlJobs.filter(job => !tlUniq.includes(job.JobNo))
                setNeedsNestingTL(tlJobsNeeded.length);
            } else {
                setNeedsNestingTL(tlJobs.length);
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
                nest: needsNestingFL-1,
                jobs: totalJobsFL-1,
                image: 'flaser',
                areaType: 'production',
            },
            {
                area: 'Forming',
                link: '/forming',
                // nest: needsNestingForm,
                // jobs: totalJobsForm-1,
                nest: '-',
                jobs: '-',
                image: 'forming',
                areaType: 'production',
            },
            {
                area: 'Laser',
                link: '/laser',
                nest: needsNestingLaser-1,
                jobs: totalJobsLaser-1,
                image: 'laser',
                areaType: 'production',
            },
            {
                area: 'Punch',
                link: '/punch',
                nest: needsNestingPunch-1,
                jobs: totalJobsPunch-1,
                image: 'punch',
                areaType: 'production',
            },
            {
                area: 'Saw',
                link: '/saw',
                nest: needsNestingSaw-1,
                jobs: totalJobsSaw-1,
                image: 'saw',
                areaType: 'production',
            },
            {
                area: 'Shear',
                link: '/shear',
                nest: needsNestingShear-1,
                jobs: totalJobsShear-1,
                image: 'shear',
                areaType: 'production',
            },
            {
                area: 'Static Laser',
                link: '/staticlaser',
                nest: needsNestingSL-1,
                jobs: totalJobsSL-1,
                image: 'slaser',
                areaType: 'production',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaser',
                nest: needsNestingTL-1,
                jobs: totalJobsTL-1,
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