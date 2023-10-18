import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/engineering/getAllJobs';
import updateJob from '../../services/engineering/updateJob';
import { Sidebar } from '../sidebar/Sidebar';

export const Engineering = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'maintenance': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setParNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();
    const [jobStatus, setJobStatus] = useState(' ');

    const [home, setHome] = useState('Home');
    const [tbr, setTbr] = useState('TBR');
    const [future, setFuture] = useState('Future');
    const [repeat, setRepeat] = useState('Repeat');
    const [add, setAdd] = useState('Add');
    const [outsource, setOutsource] = useState('Outsource');
    const [qc, setQc] = useState('QC');
    const [hold, setHold] = useState('Hold');
    const [all, setAll] = useState('All');

    const find = () => {
        try {
            let data = getAllJobs();
            data.then((res) => {
                setSearchedEng(res);
                setLoading(false);
            })
        } catch (err) {
            console.log(err)
        }
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        updateJob(jobNoInfo, engineerInfo, jobStatus);
        setShow(false);
        find();
    };

    const handleShow = (job) => {
        setShow(true);
        setJobNoInfo(job.JobNo);
        setCustInfo(job.CustCode);
        setParNoInfo(job.PartNo);
        setEngineerInfo(job.dataValues.engineer);
        setJobStatus(job.dataValues.jobStatus);
    } ;
    
    useEffect(() => {
        find();
    }, [loading]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1>Loading</h1>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1>Welcome</h1>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{jobNoInfo}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <FloatingLabel label="Customer Code" className="mb-3">
                                <Form.Control defaultValue={custInfo} disabled />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Engineer" className="mb-3">
                                <Form.Control placeholder="Engineer" defaultValue={engineerInfo} onChange={(e) => {setEngineerInfo(e.target.value)}} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Status" className="mb-3">
                                <Form.Select placeholder="Status" defaultValue={jobStatus} onChange={(e) => {setJobStatus(e.target.value)}} >
                                    <option></option>
                                    <option>WIP</option>
                                    <option>QC</option>
                                    <option>HOLD</option>
                                    <option>DONE</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Tabs
                        defaultActiveKey="home"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="home" title={home}>
                            <div className='mx-3'>
                            </div>
                        </Tab>

                        <Tab eventKey="tbr" title={tbr}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Step No<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date<input placeholder='.x.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Engineer<input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Quote<input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Model<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Status<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
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
                                                !searchedValueEngineer || row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueQuote || row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueStatus || row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '2. TBR') {
                                                    return (
                                                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {/* <td>{job.User_Text2}</td> */}
                                                            {/* <td>{job.User_Number3}</td> */}
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center'></td>
                                                            {/* <td>{job.OrderNo}</td> */}
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            {/* <td className='text-center'></td> */}
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Step No<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date<input placeholder='.x.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Engineer<input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Quote<input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Model<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Status<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
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
                                                !searchedValueEngineer || row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueQuote || row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueStatus || row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 == 'NEW' || job.User_Text3 == 'REVISION' || job.User_Text3 == 'REVIEW') {
                                                    return (
                                                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {/* <td>{job.User_Text2}</td> */}
                                                            {/* <td>{job.User_Number3}</td> */}
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center'></td>
                                                            {/* <td>{job.OrderNo}</td> */}
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            {/* <td className='text-center'></td> */}
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="repeat" title={repeat}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Step No<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date<input placeholder='.x.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Engineer<input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Quote<input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Model<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Status<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
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
                                                !searchedValueEngineer || row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueQuote || row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueStatus || row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 == 'REPEAT') {
                                                    return (
                                                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {/* <td>{job.User_Text2}</td> */}
                                                            {/* <td>{job.User_Number3}</td> */}
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center'></td>
                                                            {/* <td>{job.OrderNo}</td> */}
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            {/* <td className='text-center'></td> */}
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            }
        </div>
    )
}