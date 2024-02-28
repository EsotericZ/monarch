import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';
import { Bar, Doughnut } from 'react-chartjs-2';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import getUnconfirmedJobs from '../../services/engineering/getUnconfirmedJobs';
import { Sidebar } from '../sidebar/Sidebar';
import './home.css';

export const Home = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const [engTotal, setEngTotal] = useState(0);
    const [expedite, setExpedite] = useState(0);
    const [engTbr, setEngTbr] = useState(0);
    const [engFuture, setEngFuture] = useState(0);
    const [engRepeat, setEngRepeat] = useState(0);
    const [engOutsource, setEngOutsource] = useState(0);
    const [formTbr, setFormTbr] = useState(0);
    const [formFuture, setFormFuture] = useState(0);
    const [tlTbr, setTLTbr] = useState(0);
    const [tlFuture, setTLFuture] = useState(0);
    const [testBD, setTestBD] = useState(0);
    const [qcTbr, setQCTbr] = useState(0);
    const [qcFuture, setQCFuture] = useState(0);
    const [proto, setProto] = useState(0);
    const [unconfirmedTotal, setUnconfirmedTotal] = useState(0);

    const [unconfirmedJobs, setUnconfirmedJobs] = useState([]);

    const fetchData = async () => {
        try {
            const [engRes, tbrRes, futureRes, repeatRes, outsourceRes, unconfirmedRes] = await Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getRepeatJobs(),
                getOutsourceJobs(),
                getUnconfirmedJobs(),
            ]);
    
            setEngTotal(engRes.filter(row => typeof row.JobNo !== 'undefined').length);
            setExpedite(engRes.filter(row => typeof row.JobNo !== 'undefined' && row.WorkCode == 'HOT').length);
            setEngTbr(tbrRes.filter(row => typeof row.JobNo !== 'undefined').length);
            setEngFuture(futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length);
            setEngRepeat(repeatRes.length);
            setEngOutsource(outsourceRes.length);

            setFormTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            setFormFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            setTestBD(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.formStatus == 'BD TEST'))).length));
            
            setTLTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length));
            setTLFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length));

            setQCTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            setQCFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            setProto(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'PROTO'))).length));

            setUnconfirmedJobs(unconfirmedRes);
            setUnconfirmedTotal(unconfirmedRes.length);

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
        onClick: function(event, element) {
            console.log(element)
            // console.log(event)
            // const chart = element[0]._chart;
            // const elements = chart.getElementAtEvent(event)[0];
            // const dataset = chart.data.datasets[element._datasetIndex];
            // // const xLabel = chart.data.labels[element._index];
            // // const value = dataset.data[element._index];
            // console.log(chart)
        },
    };
    
    const labels = ['Engineering', 'Forming', 'TLaser', 'QC'];
    
    const data = {
        labels,
        datasets: [
            {
                label: 'TBR',
                data: [(engTbr-formTbr-tlTbr-qcTbr), formTbr, tlTbr, qcTbr],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Future',
                data: [(engFuture-formFuture-tlFuture-qcFuture), formFuture, tlFuture, qcFuture],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const donutData = {
        labels: ['Eng', 'Form', 'TL', 'QC'],
        datasets: [
            {
                label: 'Jobs',
                data: [
                    ((engTbr-formTbr-tlTbr-qcTbr)+(engFuture-formFuture-tlFuture-qcFuture)),
                    (formTbr+formFuture),
                    (tlTbr+tlFuture),
                    (qcTbr+qcFuture)
                ],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }

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
                            <div className='mx-3'>
                                <h1 className='text-center m-3'>Front End Jobs</h1>
                                <div className="row homeFlex">
                                    <div className="homeLeft">
                                        <div className="row homeBox">
                                            <div className="row jobTitle">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th className='text-end tableKey'>Total</th>
                                                            <th className='text-start tableValue'>{engTotal}</th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="row">
                                                <div className="jobBox">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th className='text-end tableKey'>TBR</th>
                                                                <th className='text-start tableValue'>{engTbr}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Future</th>
                                                                <th className='text-start tableValue'>{engFuture}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Expedite</th>
                                                                <th className='text-start tableValue'>{expedite}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Repeats</th>
                                                                <th className='text-start tableValue'>{engRepeat}</th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="jobBox">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th className='text-end tableKey'>Outsource</th>
                                                                <th className='text-start tableValue'>{engOutsource}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>BD Test</th>
                                                                <th className='text-start tableValue'>{testBD}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Prototype</th>
                                                                <th className='text-start tableValue'>{proto}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Unconfirmed</th>
                                                                <th className='text-start tableValue'>{unconfirmedTotal}</th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className="row homeBox homeBottom">
                                            <Doughnut data={donutData} />
                                        </div>
                                    </div>
                                    <div className="homeRight homeBox">
                                        <Bar 
                                            options={options} 
                                            data={data} 
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className='text-center m-3'>
                                <NavLink exact to='/requests'>
                                    Website Requests
                                </NavLink>
                            </div>
                            <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                <Icon size={24} icon={refresh}/>
                            </Button>
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