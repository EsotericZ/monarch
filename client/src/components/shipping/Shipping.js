import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { checkCircleO } from 'react-icons-kit/fa/checkCircleO';
// import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';

import getAllOrders from '../../services/shipping/getAllOrders';
import getAllCustomers from '../../services/shipping/getAllCustomers';
import createRequest from '../../services/shipping/createRequest';
import scheduleRequest from '../../services/shipping/scheduleRequest';
import completeRequest from '../../services/shipping/completeRequest';
import { Sidebar } from '../sidebar/Sidebar';

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

    const [searchedShip, setSearchedShip] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [shippingRecord, setShippingRecord] = useState();
    const [customerList, setCustomerList] = useState([]);
    const [newRequest, setNewRequest] = useState({
        customer: '',
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

    async function fetchData() {
        try {
            getAllCustomers()
                .then((res) => {
                    setCustomerList(res)
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
                location: '',
                priority: '',
                jobNo: '',
                poNo: '',
                delivery: '',
                comments: '',
            }))
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
    }, [showAdd, showSchedule]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1>Loading</h1>
                :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1>Shipping</h1>
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

                    <Tabs
                        defaultActiveKey='future'
                        id='justify-tab-example'
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey='future' title='Future'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Customer</th>
                                        <th className='text-center'>Location</th>
                                        <th className='text-center'>Priority</th>
                                        <th className='text-center'>Type</th>
                                        <th className='text-center'>Job No</th>
                                        <th className='text-center'>PO No</th>
                                        <th className='text-center'>Comments</th>
                                        {cookieData.shipping &&
                                            <th className='text-center align-middle'>Schedule</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedShip
                                        .map((record, index) => {
                                            if (!record.scheduled && !record.done) {
                                                return (
                                                    <tr key={index} record={record}>
                                                        <td className='text-center'>{record.customer}</td>
                                                        <td className='text-center'>{record.location}</td>
                                                        <td className='text-center'>{record.priority}</td>
                                                        <td className='text-center'>{record.delivery}</td>
                                                        <td className='text-center'>{record.jobNo}</td>
                                                        <td className='text-center'>{record.poNo}</td>
                                                        <td className='text-center'>{record.comments}</td>
                                                        {cookieData.shipping &&
                                                                <td style={{display: 'flex', justifyContent: 'center'}}>
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
                        </Tab>

                        <Tab eventKey='scheduled' title='Scheduled'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Customer</th>
                                        <th className='text-center'>Location</th>
                                        <th className='text-center'>Priority</th>
                                        <th className='text-center'>Type</th>
                                        <th className='text-center'>Job No</th>
                                        <th className='text-center'>PO No</th>
                                        <th className='text-center'>Driver</th>
                                        <th className='text-center'>Date</th>
                                        <th className='text-center'>Comments</th>
                                        {cookieData.shipping &&
                                            <th className='text-center align-middle'>Complete</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedShip
                                        .map((record, index) => {
                                            if (record.scheduled && !record.done) {
                                                return (
                                                    <tr key={index} record={record}>
                                                        <td className='text-center'>{record.customer}</td>
                                                        <td className='text-center'>{record.location}</td>
                                                        <td className='text-center'>{record.priority}</td>
                                                        <td className='text-center'>{record.delivery}</td>
                                                        <td className='text-center'>{record.jobNo}</td>
                                                        <td className='text-center'>{record.poNo}</td>
                                                        <td className='text-center'>{record.driver}</td>
                                                        <td className='text-center'>{format(parseISO(record.date), 'MM/dd/Y')}</td>
                                                        <td className='text-center'>{record.comments}</td>
                                                        {cookieData.shipping &&
                                                                <td style={{display: 'flex', justifyContent: 'center'}}>
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
                        </Tab>

                        <Tab eventKey='complete' title='Completed'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Customer</th>
                                        <th className='text-center'>Location</th>
                                        <th className='text-center'>Type</th>
                                        <th className='text-center'>Job No</th>
                                        <th className='text-center'>PO No</th>
                                        <th className='text-center'>Driver</th>
                                        <th className='text-center'>Date</th>
                                        <th className='text-center'>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedShip
                                        .map((record, index) => {
                                            if (record.done) {
                                                return (
                                                    <tr key={index} record={record}>
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
                        </Tab>

                        <Tab eventKey='calendar' title='Calendar'>
                            <h4>Coming Soon</h4>
                        </Tab>
                    </Tabs>
                    <button onClick={handleOpenAdd}>Add</button>
                </div>
            }
        </div>
    )
}