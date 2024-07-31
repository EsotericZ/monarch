import { useEffect, useState, Fragment } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/entypo/plus';

import getAllJobs from '../../services/backlog/getAllJobs';
import getAllSubJobs from '../../services/backlog/getAllSubJobs';
import getSingleJob from '../../services/backlog/getSingleJob';
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

    const [jobNo, setJobNo] = useState('');
    const [jobType, setJobType] = useState('');
    const [partNo, setPartNo] = useState('');
    const [partRev, setPartRev] = useState('');
    const [custCode, setCustCode] = useState('');
    const [masterJobNo, setMasterJobNo] = useState('');
    const [routing, setRouting] = useState([]);

    const [jobs, setJobs] = useState([]);
    const [subJobs, setSubJobs] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [showRoute, setShowRoute] = useState(false);
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

    const toggleRoute = async (job) => {
        try {
            const routing = await getSingleJob(job.JobNo);
            handleOpenRoute(job, routing);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCloseRoute = () => setShowRoute(false);
    const handleOpenRoute = (job, routing) => {
        setJobNo(job.JobNo);
        setJobType(job.User_Text3);
        setPartNo(job.PartNo);
        setPartRev(job.Revision);
        setCustCode(job.CustCode);
        setMasterJobNo(job.MasterJobNo);
        setRouting(routing);
        setShowRoute(true);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day.split('T')[0]);
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sortedJobs = jobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
    const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
    const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);

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

                        <Modal show={showRoute} onHide={handleCloseRoute}>
                            <Modal.Header>
                                <Modal.Title  className="modal-title-custom">
                                    <div>JOB {jobNo}</div>
                                    <div>{jobType}</div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <div>Part Number: {partNo}</div>
                                <div>Revision: {partRev}</div>
                                <div>Customer: {custCode}</div>
                            </Modal.Body>
                            <Modal.Footer className="modal-footer-custom justify-content-center">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Step</th>
                                            <th className='text-center'>Operation</th>
                                            <th className='text-center'>Status</th>
                                            <th className='text-center'>Employee</th>
                                            <th className='text-center'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routing.map((step, index) => {
                                            return (
                                                <tr step={step} key={index}>
                                                    <td className='text-center'>{step.StepNo}</td>
                                                    <td className='text-center'>{step.WorkCntr}</td>
                                                    <td className='text-center'>{step.Status}</td>
                                                    <td className='text-center'>{step.EmplCode}</td>
                                                    {step.ActualEndDate ? 
                                                        <td className='text-center'>{(step.ActualEndDate).split('-')[1] + '/' + ((step.ActualEndDate).split('-')[2]).split('T')[0] + '/' + ((step.ActualEndDate).split('-')[0]).slice(-2)}</td>
                                                    :
                                                        <td className='text-center'></td>
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </Modal.Footer>
                        </Modal>

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
                                        {/* <th className='text-center'>Total</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastJobs
                                        .map((job, index) => {
                                            const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                            if (!job.MasterJobNo) {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr job={job} className={`${profitClass}`}>
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
                                                                <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                            :
                                                                <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                            }
                                                            {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                        </tr>
                                                        {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                            <tr key={subIndex} className='subjob-row'>
                                                                <td className='text-center'>{subJob.MasterJobNo}</td>
                                                                <td className='text-center'>{subJob.OrderNo}</td>
                                                                <td className='text-center'>{subJob.JobNo}</td>
                                                                <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                <td className='text-center'>{subJob.CustCode}</td>
                                                                <td className='text-center'>{subJob.EstimQty}</td>
                                                                {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                    <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                :
                                                                    <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                }
                                                            </tr>
                                                        ))}
                                                    </Fragment>
                                                )
                                            }
                                        })
                                    }
                                    <tr className='empty-row late-row'><td colSpan="7">-</td></tr>
                                    {futureJobs
                                        .map((job, index) => {
                                            const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                            if (!job.MasterJobNo) {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr job={job} className={`${profitClass}`}>
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
                                                                <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                            :
                                                                <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                            }
                                                            {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                        </tr>
                                                        {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                            <tr key={subIndex} className='subjob-row'>
                                                                <td className='text-center'>{subJob.MasterJobNo}</td>
                                                                <td className='text-center'>{subJob.OrderNo}</td>
                                                                <td className='text-center'>{subJob.JobNo}</td>
                                                                <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                <td className='text-center'>{subJob.CustCode}</td>
                                                                <td className='text-center'>{subJob.EstimQty}</td>
                                                                {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                    <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                :
                                                                    <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
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