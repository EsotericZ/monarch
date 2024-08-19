import { useState } from 'react';
import { Button } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import getSingleJob from '../../services/efficiency/getSingleJob';
import getJobRange from '../../services/efficiency/getJobRange';
import { Sidebar } from '../sidebar/Sidebar';

const headers = [
    { label: "Job No", key: "JobNo" },
    { label: "Part No", key: "PartNo" },
    { label: "Step No", key: "StepNo" },
    { label: "Work Center", key: "WorkCntr" },
    { label: "Actual Start Date", key: "ActualStartDate" },
    { label: "Estimated Hours", key: "TotEstHrs" },
    { label: "Actual Hours", key: "TotActHrs" },
    { label: "Status", key: "Status" },
];

export const Efficiency = () => {
    const cookies = new Cookies();
    let cookieData;
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'engineering': false,
        };
    }

    const [singleJob, setSingleJob] = useState('');
    const [multiJob, setMultiJob] = useState('');

    const fetchSingleExportCSV = async () => {
        try {
            const res = await getSingleJob(singleJob);
            console.log(res)

            const csvData = res.map(item => {
                const startDate = item.ActualStartDate ? item.ActualStartDate.split('T')[0] : '';

                return {
                    JobNo: item.JobNo,
                    PartNo: item.PartNo,
                    StepNo: item.StepNo,
                    WorkCntr: item.WorkCntr,
                    ActualStartDate: startDate,
                    TotEstHrs: item.TotEstHrs, 
                    TotActHrs: item.TotActHrs, 
                    Status: item.Status, 
                }
            });

            const csvContent = [
                headers.map(header => header.label).join(','),
                ...csvData.map(item => Object.values(item).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${singleJob}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {cookieData.engineering ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginLeft: '80px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <div className='mx-3' style={{ textAlign: 'center', marginTop: '50px' }}>
                                    <h1>Single Job</h1>
                                    <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                        <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                                            <input 
                                                className='input form-control mt-1' 
                                                type='text' 
                                                placeholder='Job No' 
                                                onChange={(e) => {setSingleJob(e.target.value)}}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <Button className='vtiger' onClick={() => fetchSingleExportCSV()}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '75px' }}></div>
                                {/* <div className='mx-3'>
                                    <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                        <Button className='vtiger' onClick={() => fetchAllExportCSV()}>
                                            Get All Customers
                                        </Button>
                                    </div>
                                </div>
                                <div className='mx-3' style={{ textAlign: 'center', marginTop: '100px' }}>
                                    <h1>Contact Info</h1>
                                    <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                        <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                                            <input 
                                                className='input form-control mt-1' 
                                                type='text' 
                                                placeholder='Customer Code' 
                                                onChange={(e) => {setCustCode(e.target.value)}}
                                                style={{ marginRight: '10px' }}
                                            />
                                            <Button className='vtiger' onClick={() => fetchOneContactCSV()}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '75px' }}></div>
                                <div className='mx-3'>
                                    <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                        <Button className='vtiger' onClick={() => fetchAllContactCSV()}>
                                            Get All Customers
                                        </Button>
                                    </div>
                                </div>
                                <div className='mx-3' style={{ textAlign: 'center', marginTop: '100px' }}>
                                    <h1>Quotes</h1>
                                </div>
                                <div style={{ width: '75px' }}></div>
                                <div className='mx-3'>
                                    <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                        <Button className='vtiger' onClick={() => fetchAllQuotesCSV()}>
                                            Get All Quotes
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                </div>
            :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', width: '100%' }}>
                    <h1>You don't have access to this page</h1>
                </div>
            }
        </div>
    )
}