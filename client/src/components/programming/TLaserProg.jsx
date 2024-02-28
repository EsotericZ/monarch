import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import updateTLStatus from '../../services/tlaser/updateTLStatus';
import updateTLProgrammer from '../../services/tlaser/updateTLProgrammer';
import { Sidebar } from '../sidebar/Sidebar';
import '../engineering/engineering.css';

export const TLaserProg = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'tlaser': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueProgrammer, setSearchedValueProgrammer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFuture, setSearchedFuture] = useState([]);
    const [tlaserUsers, setTlaserUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tbr, setTbr] = useState('');
    const [future, setFuture] = useState('');

    const fetchData = () => {
        try {
            Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getAllUsers()
            ]).then(([res1, res2, res3, res4]) => {
                setSearchedEng(res1);
                setSearchedTBR(res2);
                setSearchedFuture(res3);
    
                let tbrCount = ((res2.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
                (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');
    
                let futureCount = ((res3.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
                (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');

                setTlaserUsers(res4.data.filter(user => user.tlaser).map(user => user.name.split(' ')[0]));

                setLoading(false);
            });
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleTBRTLProgrammer = async (job, tlProgrammer) => {
        try {
            await updateTLProgrammer(job.dataValues.jobNo, tlProgrammer);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleTBRJobStatus = async (job, tlStatus) => {
        try {
            await updateTLStatus(job.dataValues.jobNo, tlStatus);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleFutureTLProgrammer = async (job, tlProgrammer) => {
        try {
            await updateTLProgrammer(job.dataValues.jobNo, tlProgrammer);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err);
        }
    };
        
    const handleFutureJobStatus = async (job, tlStatus) => {
        try {
            await updateTLStatus(job.dataValues.jobNo, tlStatus);
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
                    <h1 className='text-center'>Tube Laser</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Tube Laser</h1>

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
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' width='8%' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueProgrammer(e.target.value)} placeholder='&#xf002;  Programmer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueProgrammer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }
                                                
                                                return row.dataValues.formProgrammer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueProgrammer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }
                                                
                                                return row.dataValues.formStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.dataValues.jobStatus == 'TLASER') {
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
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {cookieData.tlaser ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.tlProgrammer} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {tlaserUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleTBRTLProgrammer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRTLProgrammer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.tlProgrammer}</td>
                                                            }
                                                            {cookieData.tlaser ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.tlStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.tlStatus}</td>
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

                        <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueProgrammer(e.target.value)} placeholder='&#xf002;  Programmer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueProgrammer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }
                                                
                                                return row.dataValues.formProgrammer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueProgrammer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }
                                                
                                                return row.dataValues.formStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'TLASER') {
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
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {cookieData.tlaser ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.tlProgrammer} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {tlaserUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleFutureTLProgrammer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureTLProgrammer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.tlProgrammer}</td>
                                                            }
                                                            {cookieData.tlaser ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.tlStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.tlStatus}</td>
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

                    </Tabs>
                </div>
            }
        </div>
    )
}