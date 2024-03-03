import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';

import getMachTBRJobs from '../../services/machining/getMachTBRJobs';
import getMachFutureJobs from '../../services/machining/getMachFutureJobs';

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

export const Profile = () => {
    const cookies = new Cookies();
    
    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    
    const [engTBR, setEngTBR] = useState(0);
    const [engFuture, setEngFuture] = useState(0);

    const [machTBR, setMachTBR] = useState(0);
    const [machFuture, setMachFuture] = useState(0);

    const [qualityTBR, setQualityTBR] = useState(0);
    const [qualityFuture, setQualityFuture] = useState(0);

    const [tlaserTBR, setTLaserTBR] = useState(0);
    const [tlaserFuture, setTLaserFuture] = useState(0);

    const [formTBR, setFormTBR] = useState(0);
    const [formFuture, setFormFuture] = useState(0);

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

    const fetchData = async () => {
        try {
            const [
                tbrRes, 
                futureRes,
                tbrMachRes, 
                futureMachRes,
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
                getTBRJobs(),
                getFutureJobs(),
                getMachTBRJobs(),
                getMachFutureJobs(),
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

            let tbrEngCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setEngTBR(tbrEngCount);
            let futureEngCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setEngFuture(futureEngCount);

            let tbrMachCount = tbrMachRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setMachTBR(tbrMachCount);
            let futureMachCount = futureMachRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setMachFuture(futureMachCount);

            let tbrQualityCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
            setQualityTBR(tbrQualityCount);
            let futureQualityCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
            setQualityFuture(futureQualityCount);

            let tbrTLCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
            setTLaserTBR(tbrTLCount);
            let futureTLCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
            setTLaserFuture(futureTLCount);

            let tbrFormCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
            setFormTBR(tbrFormCount);
            let futureFormCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
            setFormFuture(futureFormCount);

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
        {cookieData.engineering && 
            setAreas(prevAreas => [
                ...prevAreas,
                {
                    area: 'Engineering',
                    link: '/engineering',
                    tbr: engTBR,
                    future: engFuture,
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
                    tbr: machTBR,
                    future: machFuture,
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
                    tbr: qualityTBR,
                    future: qualityFuture,
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
                    tbr: tlaserTBR,
                    future: tlaserFuture,
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
                    tbr: formTBR,
                    future: formFuture,
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
                    nest: needsNestingFL-1,
                    jobs: totalJobsFL-1,
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
                    // nest: needsNestingForm,
                    // jobs: totalJobsForm-1,
                    nest: '-',
                    jobs: '-',
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
                    nest: needsNestingLaser-1,
                    jobs: totalJobsLaser-1,
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
                    nest: needsNestingPunch-1,
                    jobs: totalJobsPunch-1,
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
                    nest: needsNestingSaw-1,
                    jobs: totalJobsSaw-1,
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
                    nest: needsNestingShear-1,
                    jobs: totalJobsShear-1,
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
                    nest: needsNestingSL-1,
                    jobs: totalJobsSL-1,
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
                    nest: needsNestingTL-1,
                    jobs: totalJobsTL-1,
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
    }, [needsNestingTL]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                {loggedIn ?
                    <>
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
        </div>
    )
}