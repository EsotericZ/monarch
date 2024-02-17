import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Modal, Table } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import { Sidebar } from '../sidebar/Sidebar';

export const Home = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const [engTotal, setEngTotal] = useState(0);
    const [engTbr, setEngTbr] = useState(0);
    const [engFuture, setEngFuture] = useState(0);
    const [engRepeat, setEngRepeat] = useState(0);
    const [engOutsource, setEngOutsource] = useState(0);
    const [formTbr, setFormTbr] = useState(0);
    const [formFuture, setFormFuture] = useState(0);
    const [testBD, setTestBD] = useState(0);
    const [qcTbr, setQCTbr] = useState(0);
    const [qcFuture, setQCFuture] = useState(0);
    const [proto, setProto] = useState(0);

    const fetchData = async () => {
        try {
            const [engRes, tbrRes, futureRes, repeatRes, outsourceRes] = await Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getRepeatJobs(),
                getOutsourceJobs(),
            ]);
    
            setEngTotal(engRes.filter(row => typeof row.JobNo !== 'undefined').length);
            setEngTbr(tbrRes.filter(row => typeof row.JobNo !== 'undefined').length);
            setEngFuture(futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length);
            setEngRepeat(repeatRes.length);
            setEngOutsource(outsourceRes.length);

            setFormTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            setFormFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            setTestBD(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.formStatus == 'BD TEST'))).length));

            setQCTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            setQCFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            setProto(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'PROTO'))).length));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        try {
            setCookieData(jwt_decode(cookies.get('jwt')));
            setLoggedIn(true)
        } catch {
            setCookieData('');
        }
    }, [loggedIn])

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1>Loading</h1>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Monarch Metal</h1>
                    {cookieData ?
                        <>
                            <h5 className='text-center m-3'>User: {cookieData.name}</h5>
                            <br></br>
                            <div className='mx-3'>
                                <h1 className='text-center m-3'>Engineering</h1>
                                <h2>Total: {engTotal}</h2>
                                <h2>TBR: {engTbr}</h2>
                                <h2>Future: {engFuture}</h2>
                                <h2>Repeats: {engRepeat}</h2>
                                <h2>Outsource: {engOutsource}</h2>
                                <h2>F TBR: {formTbr}</h2>
                                <h2>F Future: {formFuture}</h2>
                                <h2>BD Test: {testBD}</h2>
                                <h2>QC TBR: {qcTbr}</h2>
                                <h2>QC Future: {qcFuture}</h2>
                                <h2>Prototype: {proto}</h2>
                            </div>
                            <div className='text-center m-3'>
                                <NavLink exact to='/requests'>
                                    Website Requests
                                </NavLink>
                            </div>
                        </>
                    :
                        <div className='text-center m-3'>
                            <NavLink exact to='/login'>
                                <button className='m-3 mmBtn'>Log In</button>
                            </NavLink>
                        </div>
                    }
                </div>
        }
            </div>
    )
}