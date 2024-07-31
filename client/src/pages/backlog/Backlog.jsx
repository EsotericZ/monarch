import { useEffect, useState, Fragment } from 'react';
import { Table } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/entypo/plus';

import getAllJobs from '../../services/backlog/getAllJobs';
import getAllSubJobs from '../../services/backlog/getAllSubJobs';
import { Sidebar } from '../sidebar/Sidebar';
import './backlog.css';

export const Backlog = () => {
    const cookies = new Cookies();
    let cookieData;
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
        };
    }

    const [jobs, setJobs] = useState([]);
    const [subJobs, setSubJobs] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [allJobs] = await Promise.all([
                getAllJobs(),
            ]);
            setJobs(allJobs);
            let masters = allJobs.filter(row => row.MasterJobNo != null);
            let masterJobs = []
            masters.forEach((e) => {
                masterJobs.push(e.MasterJobNo)
            })
            let nonEmptyJobs = masterJobs.filter(row => row != '')

            allJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })

            console.log(allJobs)
    
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSub = async (JobNo) => {
        if (expandedRows.includes(JobNo)) {
            setExpandedRows(expandedRows.filter(row => row !== JobNo));
        } else {
            try {
                const subs = await getAllSubJobs(JobNo);
                setSubJobs({
                    ...subJobs,
                    [JobNo]: subs
                });
                setExpandedRows([...expandedRows, JobNo]);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Backlog</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                (cookieData.backlog ?
                    <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <h1 className='text-center m-3'>Backlog</h1>
                        <div className='mx-3'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Master</th>
                                        <th className='text-center'>Order No</th>
                                        <th className='text-center'>Job No</th>
                                        <th className='text-center'>Due Date</th>
                                        <th className='text-center'>Customer</th>
                                        <th className='text-center'>Quantity</th>
                                        <th className='text-center'>Current Area</th>
                                    </tr>
                                </thead>
                                {/* <tbody>
                                    {jobs
                                        .map((job, index) => {
                                            // const rowClass = job.MasterJobNo  ? 'hide-row' : '';
                                            if (!job.MasterJobNo) {
                                                return (
                                                    <tr key={index} job={job}>
                                                        {job.HasSubs ?
                                                            <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                <Icon icon={plus}/>
                                                            </td>
                                                        :
                                                            <td className='text-center'></td>
                                                        }
                                                        <td className='text-center'>{job.OrderNo}</td>
                                                        <td className='text-center'>{job.JobNo}</td>
                                                        <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        {job.WorkCntr && job.User_Text2!='4. DONE' ?
                                                            <td className='text-center'>{(job.WorkCntr).split(' ')[1]}</td>
                                                        :
                                                            <td className='text-center'>{(job.User_Text2).split(' ')[1]}</td>
                                                        }
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody> */}


                                <tbody>
                                    {jobs
                                        .map((job, index) => {
                                            if (!job.MasterJobNo) {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr job={job}>
                                                            {job.HasSubs ?
                                                                <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                    <Icon icon={plus}/>
                                                                </td>
                                                                :
                                                                <td className='text-center'></td>
                                                            }
                                                            <td className='text-center'>{job.OrderNo}</td>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                <td className='text-center'>{(job.WorkCntr).split(' ')[1]}</td>
                                                                :
                                                                <td className='text-center'>{(job.User_Text2).split(' ')[1]}</td>
                                                            }
                                                        </tr>
                                                        {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                            <tr key={subIndex} className='subjob-row'>
                                                                <td className='text-center'>{subJob.MasterJobNo}</td>
                                                                <td className='text-center'>{subJob.OrderNo}</td>
                                                                <td className='text-center'>{subJob.JobNo}</td>
                                                                <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                <td className='text-center'>{subJob.CustCode}</td>
                                                                <td className='text-center'>{subJob.EstimQty}</td>
                                                                {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                    <td className='text-center'>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                    :
                                                                    <td className='text-center'>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                }
                                                            </tr>
                                                        ))}
                                                    </Fragment>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', width: '100%' }}>
                        <h1>You don't have access to this page</h1>
                    </div>
                )
            }
        </div>
    )
}