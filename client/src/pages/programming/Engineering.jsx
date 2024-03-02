import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import getNextStep from '../../services/engineering/getNextStep';
import getPrints from '../../services/engineering/getPrints';
import getOutsourcePrints from '../../services/engineering/getOutsourcePrints';
import getAllUsers from '../../services/users/getAllUsers';
import updateModel from '../../services/engineering/updateModel';
import updateExpedite from '../../services/engineering/updateExpedite';
import updateEngineer from '../../services/engineering/updateEngineer';
import updateJobStatus from '../../services/engineering/updateJobStatus';
import { Sidebar } from '../sidebar/Sidebar';
import './engineering.css';

export const Engineering = () => {
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

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueStep, setSearchedValueStep] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFuture, setSearchedFuture] = useState([]);
    const [searchedRepeat, setSearchedRepeat] = useState([]);
    const [searchedOutsource, setSearchedOutsource] = useState([]);
    const [searchedNextStep, setSearchedNextStep] = useState([]);
    const [searchedPrints, setSearchedPrints] = useState([]);
    const [searchedOutsourcePrints, setSearchedOutsourcePrints] = useState([]);
    const [fullRepeats, setFullRepeats] = useState([]);
    const [fullOutsource, setFullOutsource] = useState([]);
    const [engineeringUsers, setEngineeringUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tbr, setTbr] = useState('');
    const [future, setFuture] = useState('');
    const [repeat, setRepeat] = useState('');
    const [outsource, setOutsource] = useState('');
    const [active, setActive] = useState('Active');

    const fetchData = async () => {
        try {
            const [engRes, tbrRes, futureRes, nextStepRes, printsRes, repeatRes, outsourcePrintsRes, outsourceRes, userRes] = await Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getNextStep(),
                getPrints(),
                getRepeatJobs(),
                getOutsourcePrints(),
                getOutsourceJobs(),
                getAllUsers(),
            ]);
    
            setSearchedEng(engRes);
    
            setSearchedTBR(tbrRes);
            let tbrCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setTbr(tbrCount > 0 ? `TBR (${tbrCount})` : 'TBR');
    
            setSearchedFuture(futureRes);
            let futureCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setFuture(futureCount > 0 ? `Future (${futureCount})` : 'Future');
    
            setSearchedNextStep(nextStepRes);
    
            setSearchedPrints(printsRes);
    
            setSearchedRepeat(repeatRes);
            let repeatCount = repeatRes.length;
            setRepeat(repeatCount > 0 ? `Repeat (${repeatCount})` : 'Repeat');
        
            setFullRepeats(
                repeatRes.map(v => {
                    let obj1 = nextStepRes.find(o => o.JobNo === v.JobNo);
                    if (obj1) {
                    v.WorkCntr = obj1.WorkCntr;
                    }

                    let obj = printsRes.find(x => x.PartNo === v.PartNo);
                    v.DocNumber = obj ? obj.DocNumber : '';

                    return v;
                })
            );
        
            setSearchedOutsourcePrints(outsourcePrintsRes);
    
            setSearchedOutsource(outsourceRes);
            let outsourceCount = outsourceRes.length;
            setOutsource(outsourceCount > 0 ? `Outsource (${outsourceCount})` : 'Outsource');
        
            setFullOutsource(
                outsourceRes.map(v => {
                    let obj = outsourcePrintsRes.find(x => x.PartNo === v.PartNo);
                    v.DocNumber = obj ? obj.DocNumber : '';

                    return v;
                })
            );

            setEngineeringUsers(userRes.data.filter(user => user.engineering).map(user => user.name.split(' ')[0]));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleModel = async (job) => {
        updateModel(job.dataValues.id);
        setUpdate(`Model ${job.dataValues.jobNo}`)
    }

    const toggleExpedite = async (job) => {
        updateExpedite(job.dataValues.id);
        setUpdate(`Expedite ${job.dataValues.jobNo}`)
    }

    const handleTBREngineer = async (job, engineer) => {
        try {
            await updateEngineer(job.dataValues.jobNo, engineer);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };

    const handleTBRJobStatus = async (job, jobStatus) => {
        try {
            await updateJobStatus(job.dataValues.jobNo, jobStatus);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleFutureEngineer = async (job, engineer) => {
        try {
            await updateEngineer(job.dataValues.jobNo, engineer);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err)
        }
    }
    
    const handleFutureJobStatus = async (job, jobStatus) => {
        try {
            await updateJobStatus(job.dataValues.jobNo, jobStatus);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [loading, update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Engineering</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Engineering</h1>

                    <Tabs
                        defaultActiveKey="tbr"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="tbr" title={tbr}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' width='8%' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Model</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedTBR
                                            .filter(row => typeof row.JobNo !== 'undefined')
                                            .filter((row) => 
                                                !searchedValueJobNo || row.JobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePartNo || row.PartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueCustomer || row.CustCode
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => {
                                                if (!searchedValueEngineer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                                                
                                                return row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                                                
                                                return row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                return (
                                                    <tr key={index} job={job} className={rowClass}>
                                                        <td className='text-center jobBold'>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        {cookieData.engineering ?
                                                            <td className='text-center'>
                                                                <DropdownButton title={job.dataValues.engineer} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                    {engineeringUsers.map((user, n) => (
                                                                        <Dropdown.Item key={n} onClick={() => handleTBREngineer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                    ))}
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item onClick={() => handleTBREngineer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                </DropdownButton>
                                                            </td>
                                                        :
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                        }
                                                        <td className='text-center'>{job.QuoteNo}</td>
                                                        {cookieData.engineering ?
                                                            <td className='text-center' onClick={() => toggleModel(job)}>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                        :
                                                            <td className='text-center'>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                        }
                                                        {cookieData.engineering ?
                                                            <td className='text-center'>
                                                                <DropdownButton title={job.dataValues.jobStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'FORMING')} className='dropDownItem'>FORMING</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'FINALIZE')} className='dropDownItem'>FINALIZE</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'TLASER')} className='dropDownItem'>TLASER</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'QC')} className='dropDownItem'>QC</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'REWORK')} className='dropDownItem'>REWORK</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'HOLD')} className='dropDownItem'>HOLD</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'PROTO')} className='dropDownItem'>PROTO</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                    <Dropdown.Divider />
                                                                    <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'CLOCK')} className='dropDownItem'>CLOCK</Dropdown.Item>
                                                                </DropdownButton>
                                                            </td>
                                                        :
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Model</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedFuture
                                            .filter(row => typeof row.JobNo !== 'undefined')
                                            .filter((row) => 
                                                !searchedValueJobNo || row.JobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePartNo || row.PartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueCustomer || row.CustCode
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => {
                                                if (!searchedValueEngineer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                                                
                                                return row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                                                
                                                return row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} job={job} className={rowClass}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            {cookieData.engineering ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.engineer} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {engineeringUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleFutureEngineer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureEngineer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.engineer}</td>
                                                            }
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            {cookieData.engineering ?
                                                                <td className='text-center' onClick={() => toggleModel(job)}>
                                                                    {job.dataValues.model &&
                                                                        <Icon icon={check}/>
                                                                    }
                                                                </td>
                                                            :
                                                                <td className='text-center'>
                                                                    {job.dataValues.model &&
                                                                        <Icon icon={check}/>
                                                                    }
                                                                </td>
                                                            }
                                                            {cookieData.engineering ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.jobStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'FORMING')} className='dropDownItem'>FORMING</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'FINALIZE')} className='dropDownItem'>FINALIZE</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'TLASER')} className='dropDownItem'>TLASER</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'QC')} className='dropDownItem'>QC</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'REWORK')} className='dropDownItem'>REWORK</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'HOLD')} className='dropDownItem'>HOLD</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'PROTO')} className='dropDownItem'>PROTO</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'CLOCK')} className='dropDownItem'>CLOCK</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            }
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="repeat" title={repeat}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Revision</th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Type</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStep(e.target.value)} placeholder='&#xf002;  Next Step' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fullRepeats
                                            .filter(row => typeof row.JobNo !== 'undefined')
                                            .filter((row) => 
                                                !searchedValueJobNo || row.JobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePartNo || row.PartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueCustomer || row.CustCode
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => {
                                                if (!searchedValueStep) { return true; }
                                                if (!row || !row.WorkCntr) { return false; }
                                                
                                                return row.WorkCntr
                                                    .toString() 
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStep.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold'>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        <td className='text-center'>{job.WorkCntr}</td>
                                                        <td className='text-center'>{job.DocNumber && <Icon icon={check}/> }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="outsource" title={outsource}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Revision</th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fullOutsource
                                            .filter(row => typeof row.JobNo !== 'undefined')
                                            .filter((row) => 
                                                !searchedValueJobNo || row.JobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePartNo || row.PartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueCustomer || row.CustCode
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold'>{job.JobNo}</td>
                                                        <td className='text-center jobBold'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.QuoteNo}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        <td className='text-center'>{job.DocNumber && <Icon icon={check}/> }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="active" title={active}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'>Revision</th>
                                            <th className='text-center' width='11%'>Qty</th>
                                            <th className='text-center' width='11%'>Due Date</th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedEng
                                            .filter(row => typeof row.JobNo !== 'undefined')
                                            .filter((row) => 
                                                !searchedValueJobNo || row.JobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePartNo || row.PartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueCustomer || row.CustCode
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueArea || row.User_Text2
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueArea.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} job={job} className={rowClass}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.User_Text2}</td>
                                                        </tr>
                                                    )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    )
}