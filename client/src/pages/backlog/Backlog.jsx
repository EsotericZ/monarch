import { useEffect, useState, Fragment, Component } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/entypo/plus';

import getAllJobs from '../../services/backlog/getAllJobs';
import getNextMonthJobs from '../../services/backlog/getNextMonthJobs';
import getFutureJobs from '../../services/backlog/getFutureJobs';
import getAllSubJobs from '../../services/backlog/getAllSubJobs';
import getSingleJob from '../../services/backlog/getSingleJob';
import updateJob from '../../services/backlog/updateJob';
import updateEmail from '../../services/backlog/updateEmail';
import updateHold from '../../services/backlog/updateHold';
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

    const [searchedValueOrderNo, setSearchedValueOrderNo] = useState('');
    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueOSV, setSearchedValueOSV] = useState('');

    const [jobNo, setJobNo] = useState('');
    const [jobType, setJobType] = useState('');
    const [partNo, setPartNo] = useState('');
    const [partRev, setPartRev] = useState('');
    const [custCode, setCustCode] = useState('');
    const [routing, setRouting] = useState([]);
    const [id, setId] = useState('');
    const [blNotes, setBlNotes] = useState('');
    const [osvNotes, setOsvNotes] = useState('');
    const [ariba, setAriba] = useState('');
    const [email, setEmail] = useState(0);
    const [hold, setHold] = useState(0);
    const [update, setUpdate] = useState('');

    const [jobs, setJobs] = useState([]);
    const [nextMonthJobs, setNextMonthJobs] = useState([]);
    const [allFutureJobs, setAllFutueJobs] = useState([]);
    const [subJobs, setSubJobs] = useState([]);
    const [futureJobs, setFutureJobs] = useState([]);
    const [pastJobs, setPastJobs] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [showRoute, setShowRoute] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [current, setCurrent] = useState('C');
    const [nextMonth, setNextMonth] = useState('N');
    const [futureMonths, setFutureMonths] = useState('F');
    const [overview, setOverview] = useState('Overview');

    const formatDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day.split('T')[0]);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allJobs, nextJobs, moreJobs] = await Promise.all([
                getAllJobs(),
                getNextMonthJobs(),
                getFutureJobs(),
            ]);
            // setJobs(allJobs);
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
            
            nextJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setNextMonthJobs(nextJobs);
            
            moreJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setAllFutueJobs(moreJobs);
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const sortedJobs = allJobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
            const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
            const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);

            const thisMonthNo = today.getMonth();
            const nextMonthNo = today.getMonth() + 1;
            const futureMonthNo = today.getMonth() + 2;
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ]

            setCurrent(months[thisMonthNo]);
            setNextMonth(months[nextMonthNo]);
            setFutureMonths(`${months[futureMonthNo]} +`);
            setPastJobs(pastJobs);
            setFutureJobs(futureJobs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    async function toggleEmail(id) {
        updateEmail(id);
        setUpdate('Email');
    }

    async function toggleHold(id) {
        updateHold(id);
        setUpdate('Hold');
    }

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
        setRouting(routing);
        setShowRoute(true);
    };

    const handleOpenJob = (job) => {
        setId(job.dataValues.id);
        setBlNotes(job.dataValues.blnotes);
        setOsvNotes(job.dataValues.osvnotes);
        setAriba(job.dataValues.ariba);
        setEmail(job.dataValues.email);
        setHold(job.dataValues.hold);
        setShowEdit(true)
    };
    
    const handleCancel = () => {
        setId('');
        setBlNotes('');
        setOsvNotes('');
        setAriba('');
        setEmail(0);
        setHold(0);
        setShowEdit(false);
    };

    const handleUpdate = async () => {
        try {
            await updateJob(id, blNotes, osvNotes, ariba);
            setId(0);
            setBlNotes('');
            setOsvNotes('');
            setAriba('');
            setShowEdit(false);
        } catch (err) {
            console.error(err);
        } finally {
            fetchData();
        }
    };

    useEffect(() => {
        fetchData();
        setUpdate('');
    }, [update]);

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
                                                    {step.WorkCntr ?
                                                        <td className='text-center'>{step.WorkCntr}</td>
                                                    :
                                                        <td className='text-center'>{step.VendCode}</td>
                                                    }
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

                        <Modal show={showEdit}>
                            <Modal.Header>
                                <Modal.Title>Backlog Status</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FloatingLabel label="Backlog Notes" className="mb-3">
                                    <Form.Control 
                                        style={{ height: '125px' }}
                                        as="textarea"
                                        defaultValue={blNotes} 
                                        onChange={(e) => setBlNotes(e.target.value)} 
                                        className="large-input" 
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="OSV Status" className="mb-3">
                                    <Form.Control defaultValue={osvNotes} onChange={(e) => setOsvNotes(e.target.value)} />
                                </FloatingLabel>
                                <FloatingLabel label="Ariba" className="mb-3">
                                    <Form.Control defaultValue={ariba} onChange={(e) => setAriba(e.target.value)} />
                                </FloatingLabel>
                                <Form.Group className="d-flex flex-wrap justify-content-center m-3 gap-5">
                                    <div className="d-flex align-items-center mx-2">
                                        <Form.Label style={{ fontWeight: 'normal', fontSize: '16px' }} className="me-2 mb-0">Email/Expedite</Form.Label>
                                        <Form.Check 
                                            type="checkbox" 
                                            onChange={(e) => {setEmail(e.target.checked); toggleEmail(id)}}
                                            checked={email}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center mx-2">
                                        <Form.Label style={{ fontWeight: 'normal', fontSize: '16px' }} className="me-2 mb-0">Hold</Form.Label>
                                        <Form.Check 
                                            type="checkbox" 
                                            onChange={(e) => {setHold(e.target.checked); toggleHold(id)}}
                                            checked={hold}
                                        />
                                    </div>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-center">
                                <Button className='modalBtnCancel' variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button className='modalBtnVerify' variant="primary" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Tabs
                            defaultActiveKey="current"
                            id="justify-tab-example"
                            className='mb-3'
                            justify
                        >
                            <Tab eventKey="current" title={current}>

                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='5%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                {/* <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th> */}
                                                <th className='text-center' width='10%'>Current Area</th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='13%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                                {/* <th className='text-center'>Total</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pastJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                // .filter((row) => 
                                                //     !searchedValueArea || row.WorkCntr || row.User_Text2
                                                //         .toString()
                                                //         .toLowerCase()
                                                //         .includes(searchedValueArea.toString().toLowerCase())
                                                // )
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.EstimQty}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.ariba}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                    {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
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
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.ariba}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
                                                                    </tr>
                                                                ))}
                                                            </Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                            <tr className='empty-row late-row'><td colSpan="11">-</td></tr>
                                            {futureJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                // .filter((row) => 
                                                //     !searchedValueArea || row.WorkCntr || row.User_Text2
                                                //         .toString()
                                                //         .toLowerCase()
                                                //         .includes(searchedValueArea.toString().toLowerCase())
                                                // )
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    // const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    // const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                {/* <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass}`}> */}
                                                                <tr job={job} className={`${profitClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.EstimQty}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                    :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.ariba}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                    {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
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
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.ariba}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
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
                            </Tab>

                            <Tab eventKey="nextMonth" title={nextMonth}>
                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='5%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                {/* <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th> */}
                                                <th className='text-center' width='10%'>Current Area</th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='13%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                                {/* <th className='text-center'>Total</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nextMonthJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                // .filter((row) => 
                                                //     !searchedValueArea || row.WorkCntr || row.User_Text2
                                                //         .toString()
                                                //         .toLowerCase()
                                                //         .includes(searchedValueArea.toString().toLowerCase())
                                                // )
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.EstimQty}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.ariba}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                    {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
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
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.ariba}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
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
                            </Tab>

                            <Tab eventKey="futureMonths" title={futureMonths}>
                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='5%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                {/* <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th> */}
                                                <th className='text-center' width='10%'>Current Area</th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='13%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                                {/* <th className='text-center'>Total</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allFutureJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                // .filter((row) => 
                                                //     !searchedValueArea || row.WorkCntr || row.User_Text2
                                                //         .toString()
                                                //         .toLowerCase()
                                                //         .includes(searchedValueArea.toString().toLowerCase())
                                                // )
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.EstimQty}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.ariba}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                    {/* <td className='text-center'>{job.OrderTotal}</td> */}
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
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
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.ariba}</td>
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
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
                            </Tab>

                            <Tab eventKey="overview" title={overview}>
                                <div className='mx-3'>
                                    Details
                                </div>
                            </Tab>
                        </Tabs>
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