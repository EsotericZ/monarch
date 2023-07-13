import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { checkCircleO } from 'react-icons-kit/fa/checkCircleO';

import getAllOrders from '../../services/shipping/getAllOrders';
import getAllCustomers from '../../services/shipping/getAllCustomers';
import getAllVendors from '../../services/shipping/getAllVendors';
import createRequest from '../../services/shipping/createRequest';
import scheduleRequest from '../../services/shipping/scheduleRequest';
import updateRecord from '../../services/shipping/updateRecord';
import completeRequest from '../../services/shipping/completeRequest';
import { Sidebar } from '../sidebar/Sidebar';
import { Calendar } from '../calendar/Calendar';

export const Shipping = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'shipping': false,
        };
    }

    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueLocation, setSearchedValueLocation] = useState('');
    const [searchedValuePriority, setSearchedValuePriority] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePONo, setSearchedValuePONo] = useState('');
    const [searchedValueComments, setSearchedValueComments] = useState('');
    const [searchedValueDriver, setSearchedValueDriver] = useState('');

    const [searchedShip, setSearchedShip] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showScheduled, setShowScheduled] = useState(false);
    const [shippingRecord, setShippingRecord] = useState();
    const [customerList, setCustomerList] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [newRequest, setNewRequest] = useState({
        customer: '',
        vendor: '',
        location: '',
        priority: '1 - Low',
        jobNo: '',
        poNo: '',
        delivery: 'Dropoff',
        comments: '',
    });
    const [scheduleSingleRequest, setScheduleSingleRequest] = useState({
        record: '',
        driver: '',
        date: '',
    })
    const [updateSingleRequest, setUpdateSingleRequest] = useState({
        customer: '',
        vendor: '',
        location: '',
        priority: '',
        jobNo: '',
        poNo: '',
        delivery: '',
        comments: '',
        driver: '',
        date: '',
        timeFinish: '',
    });

    const [record, setRecord] = useState('');
    const [customer, setCustomer] = useState('');
    const [vendor, setVendor] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState('');
    const [jobNo, setJobNo] = useState('');
    const [poNo, setPoNo] = useState('');
    const [delivery, setDelivery] = useState('');
    const [comments, setComments] = useState('');
    const [driver, setDriver] = useState('');
    const [date, setDate] = useState('');
    const [timeFinish, setTimeFinish] = useState('');

    async function fetchData() {
        try {
            getAllCustomers()
                .then((res) => {
                    setCustomerList(res)
                })
            getAllVendors()
                .then((res) => {
                    setVendorList(res)
                })
            getAllOrders()
            .then((res) => {
                setSearchedShip(res.data)
                setLoading(false)
            })
        } catch (err) {
            console.log(err);
        }
    }

    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        setNewRequest((prev) => {
            return { ...prev, [name]: value }
        });
    }

    const handleOpenAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleSave = () => {
        createRequest(newRequest)
            .then(fetchData())
            .then(setShowAdd(false))
            .then(setNewRequest({
                customer: '',
                vendor: '',
                location: '',
                priority: '',
                jobNo: '',
                poNo: '',
                delivery: '',
                comments: '',
            }))
    }

    const handleOpenActive = (record) => {
        setUpdateSingleRequest({
            ...updateSingleRequest,
            customer: record.customer,
            vendor: record.vendor,
            location: record.location,
            priority: record.priority,
            jobNo: record.jobNo,
            poNo: record.poNo,
            delivery: record.delivery,
            comments: record.comments,
            driver: record.driver,
            date: record.date,
            timeFinish: record.timeFinish,
        })
        setRecord(record.record);
        setCustomer(record.customer);
        setVendor(record.vendor);
        setLocation(record.location);
        setPriority(record.priority);
        setJobNo(record.jobNo);
        setPoNo(record.poNo);
        setDelivery(record.delivery);
        setComments(record.comments);
        setDriver(record.driver);
        setDate(record.date);
        setTimeFinish(record.timeFinish);
        setShowUpdate(true)
    }
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleUpdate = () => {
        console.log(updateSingleRequest)
        updateRecord(updateSingleRequest, record)
            .then(fetchData())
            .then(setShowUpdate(false))
    }

    const handleOpenScheduled = (record) => {
        setUpdateSingleRequest({
            ...updateSingleRequest,
            customer: record.customer,
            vendor: record.vendor,
            location: record.location,
            priority: record.priority,
            jobNo: record.jobNo,
            poNo: record.poNo,
            delivery: record.delivery,
            comments: record.comments,
            driver: record.driver,
            date: record.date,
            timeFinish: record.timeFinish,
        })
        setRecord(record.record);
        setCustomer(record.customer);
        setVendor(record.vendor);
        setLocation(record.location);
        setPriority(record.priority);
        setJobNo(record.jobNo);
        setPoNo(record.poNo);
        setDelivery(record.delivery);
        setComments(record.comments);
        setDriver(record.driver);
        setDate(record.date);
        setTimeFinish(record.timeFinish);
        setShowScheduled(true)
    }
    const handleCloseScheduled = () => setShowScheduled(false);
    const handleScheduled = () => {
        updateRecord(updateSingleRequest, record)
            .then(fetchData())
            .then(setShowScheduled(false))
    }

    const handleChangeActive = (e) => {
        const { name, value } = e.target;
        setUpdateSingleRequest((prev) => {
            return { ...prev, [name]: value }
        });
    }

    const handleChangeSchedule = (e) => {
        setScheduleSingleRequest((prev) => {
            return { ...prev, 'record': shippingRecord }
        });
        const { name, value } = e.target;
        setScheduleSingleRequest((prev) => {
            return { ...prev, [name]: value }
        });
    };

    const handleSchedule = (record) => {
        setShippingRecord(record.record)
        setShowSchedule(true);
    }
    const handleCloseSchedule = () => setShowSchedule(false);
    const handleScheduleSave = () => {
        scheduleRequest(scheduleSingleRequest)
            .then(fetchData())
            .then(setShowSchedule(false))
    }

    const handleComplete = (record) => {
        completeRequest(record)
            .then(fetchData())
    }

    useEffect(() => {
        fetchData();
    }, [showAdd, showSchedule, showUpdate, showScheduled]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1 className="text-center m-3">Loading</h1>
                :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className="text-center m-3">Shipping</h1>
                    <Modal show={showAdd}>
                        <Modal.Header>
                            <Modal.Title>Add Shipment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Customer" className="mb-2">
                                    <Form.Control as="select" name="customer" onChange={handleChangeAdd}>
                                        <option value={''}></option>
                                        {customerList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.CustCode}>{item.CustCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Vendor" className="mb-2">
                                    <Form.Control as="select" name="vendor" onChange={handleChangeAdd}>
                                        <option value={''}></option>
                                        {vendorList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.VendCode}>{item.VendCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Location" className="mb-2">
                                    <Form.Control name="location" onChange={handleChangeAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="Priority" className="mb-2">
                                    <Form.Control as="select" name="priority" onChange={handleChangeAdd}>
                                        <option>1 - Low</option>
                                        <option>2 - Medium</option>
                                        <option>3 - High</option>
                                        <option>4 - Urgent</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Job Number" className="mb-2">
                                    <Form.Control name="jobNo" onChange={handleChangeAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="PO Number" className="mb-2">
                                    <Form.Control name="poNo" onChange={handleChangeAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="Delivery Type" className="mb-2">
                                    <Form.Control as="select" name="delivery" onChange={handleChangeAdd}>
                                        <option>Dropoff</option>
                                        <option>Pickup</option>
                                        <option>Shipping</option>
                                        <option>Will Call</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Comments">
                                    <Form.Control name="comments" onChange={handleChangeAdd} />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAdd}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showSchedule}>
                        <Modal.Header>
                            <Modal.Title>Schedule Shipment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Delivery Date" className="mb-2">
                                    <Form.Control type="date" name="date" onChange={handleChangeSchedule} />
                                </FloatingLabel>    
                            </Form>
                            <Form>
                                <FloatingLabel label="Driver" className="mb-2">
                                    <Form.Control name="driver" onChange={handleChangeSchedule} />
                                </FloatingLabel>    
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseSchedule}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleScheduleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showUpdate}>
                        <Modal.Header>
                            <Modal.Title>Update Shipping Request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Customer" className="mb-2">
                                    <Form.Control defaultValue={customer} as="select" name="customer" onChange={handleChangeActive}>
                                        <option value={''}></option>
                                        {customerList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.CustCode}>{item.CustCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Vendor" className="mb-2">
                                    <Form.Control defaultValue={vendor} as="select" name="vendor" onChange={handleChangeActive}>
                                        <option value={''}></option>
                                        {vendorList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.VendCode}>{item.VendCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Location" className="mb-2">
                                    <Form.Control defaultValue={location} name="location" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="Priority" className="mb-2">
                                    <Form.Control defaultValue={priority} as="select" name="priority" onChange={handleChangeActive}>
                                        <option>1 - Low</option>
                                        <option>2 - Medium</option>
                                        <option>3 - High</option>
                                        <option>4 - Urgent</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Delivery Type" className="mb-2">
                                    <Form.Control defaultValue={delivery} as="select" name="delivery" onChange={handleChangeActive}>
                                        <option>Dropoff</option>
                                        <option>Pickup</option>
                                        <option>Shipping</option>
                                        <option>Will Call</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Job No" className="mb-2">
                                    <Form.Control defaultValue={jobNo} name="jobNo" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="PO No" className="mb-2">
                                    <Form.Control defaultValue={poNo} name="poNo" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="Comments">
                                    <Form.Control defaultValue={comments} name="comments" onChange={handleChangeActive} />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseUpdate}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleUpdate}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showScheduled}>
                        <Modal.Header>
                            <Modal.Title>Update Shipping Request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Customer" className="mb-2">
                                    <Form.Control defaultValue={customer} as="select" name="customer" onChange={handleChangeActive}>
                                        <option value={''}></option>
                                        {customerList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.CustCode}>{item.CustCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Vendor" className="mb-2">
                                    <Form.Control defaultValue={vendor} as="select" name="vendor" onChange={handleChangeActive}>
                                        <option value={''}></option>
                                        {vendorList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.VendCode}>{item.VendCode}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Location" className="mb-2">
                                    <Form.Control defaultValue={location} name="location" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="Priority" className="mb-2">
                                    <Form.Control defaultValue={priority} as="select" name="priority" onChange={handleChangeActive}>
                                        <option>1 - Low</option>
                                        <option>2 - Medium</option>
                                        <option>3 - High</option>
                                        <option>4 - Urgent</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Delivery Type" className="mb-2">
                                    <Form.Control defaultValue={delivery} as="select" name="delivery" onChange={handleChangeActive}>
                                        <option>Dropoff</option>
                                        <option>Pickup</option>
                                        <option>Shipping</option>
                                        <option>Will Call</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Job No" className="mb-2">
                                    <Form.Control defaultValue={jobNo} name="jobNo" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="PO No" className="mb-2">
                                    <Form.Control defaultValue={poNo} name="poNo" onChange={handleChangeActive} />
                                </FloatingLabel>
                                <FloatingLabel label="Driver" className="mb-2">
                                    <Form.Control defaultValue={driver} name="driver" onChange={handleChangeActive} />
                                </FloatingLabel>
                                {/* <FloatingLabel label="Delivery Date" className="mb-2">
                                    <Form.Control defaultValue={date} type="date" name="date" onChange={handleChangeActive} />
                                </FloatingLabel> */}
                                <FloatingLabel label="Comments">
                                    <Form.Control defaultValue={comments} name="comments" onChange={handleChangeActive} />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseScheduled}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleScheduled}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Tabs
                        defaultActiveKey='future'
                        id='justify-tab-example'
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey='future' title='Future'>
                            <div className="mx-3">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Cust/Vend<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Location<input onChange={(e) => setSearchedValueLocation(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Priority<input onChange={(e) => setSearchedValuePriority(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>PO No<input onChange={(e) => setSearchedValuePONo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Comments<input onChange={(e) => setSearchedValueComments(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            {cookieData.shipping &&
                                                <th className='text-center align-middle'>Schedule</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedShip
                                            .filter((row) => 
                                                !searchedValueCustomer || row.customer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueLocation || row.location
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueLocation.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePriority || row.priority
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePriority.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.delivery
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePONo || row.poNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePONo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueComments || row.comments
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueComments.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (!record.scheduled && !record.done) {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {record.customer ?
                                                                <td onClick={() => handleOpenActive(record)} className='text-center'>{record.customer}</td>
                                                            :
                                                                <td onClick={() => handleOpenActive(record)} className='text-center'>{record.vendor}</td>
                                                            }
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.location}</td>
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.priority}</td>
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.delivery}</td>
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.jobNo}</td>
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.poNo}</td>
                                                            <td onClick={() => handleOpenActive(record)} className='text-center'>{record.comments}</td>
                                                            {cookieData.shipping &&
                                                                <td className="text-center">
                                                                    <Icon icon={checkCircleO} size={18} style={{ color: '#5BC236' }} onClick={() => handleSchedule(record)} />
                                                                </td>
                                                            }
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <button onClick={handleOpenAdd}>Add</button>
                            </div>
                        </Tab>

                        <Tab eventKey='scheduled' title='Scheduled'>
                            <div className="mx-3">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Cust/Vend<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Location<input onChange={(e) => setSearchedValueLocation(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Priority<input onChange={(e) => setSearchedValuePriority(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>PO No<input onChange={(e) => setSearchedValuePONo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Driver<input onChange={(e) => setSearchedValueDriver(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center align-middle'>Date</th>
                                            <th className='text-center'>Comments<input onChange={(e) => setSearchedValueComments(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            {cookieData.shipping &&
                                                <th className='text-center align-middle'>Complete</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedShip
                                            .filter((row) => 
                                                !searchedValueCustomer || row.customer
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueLocation || row.location
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueLocation.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePriority || row.priority
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePriority.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.delivery
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePONo || row.poNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePONo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDriver || row.driver
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDriver.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueComments || row.comments
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueComments.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.scheduled && !record.done) {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {record.customer ?
                                                                <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.customer}</td>
                                                            :
                                                                <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.vendor}</td>
                                                            }
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.location}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.priority}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.delivery}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.jobNo}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.poNo}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.driver}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{format(parseISO(record.date), 'MM/dd/Y')}</td>
                                                            <td onClick={() => handleOpenScheduled(record)} className='text-center'>{record.comments}</td>
                                                            {cookieData.shipping &&
                                                                <td className='text-center'>
                                                                    <Icon icon={checkCircleO} size={18} style={{ color: '#5BC236' }} onClick={() => handleComplete(record)} />
                                                                </td>
                                                            }
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <button onClick={handleOpenAdd}>Add</button>
                            </div>
                        </Tab>

                        <Tab eventKey='complete' title='Completed'>
                            <div className="mx-3">
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Cust/Vend<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Location<input onChange={(e) => setSearchedValueLocation(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>PO No<input onChange={(e) => setSearchedValuePONo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Driver<input onChange={(e) => setSearchedValueDriver(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center align-middle'>Date</th>
                                            <th className='text-center'>Comments<input onChange={(e) => setSearchedValueComments(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedShip
                                            .filter((row) => 
                                                !searchedValueCustomer || row.customer
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueLocation || row.location
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueLocation.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueType || row.delivery
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePONo || row.poNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePONo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDriver || row.driver
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDriver.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueComments || row.comments
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueComments.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.done) {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {record.customer ?
                                                                <td className='text-center'>{record.customer}</td>
                                                            :
                                                                <td className='text-center'>{record.vendor}</td>
                                                            }
                                                            <td className='text-center'>{record.customer}</td>
                                                            <td className='text-center'>{record.location}</td>
                                                            <td className='text-center'>{record.delivery}</td>
                                                            <td className='text-center'>{record.jobNo}</td>
                                                            <td className='text-center'>{record.poNo}</td>
                                                            <td className='text-center'>{record.driver}</td>
                                                            <td className='text-center'>{format(parseISO(record.date), 'MM/dd/Y')}</td>
                                                            <td className='text-center'>{record.comments}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey='calendar' title='Calendar'>
                            <Calendar />
                        </Tab>
                    </Tabs>
                </div>
            }
        </div>
    )
}