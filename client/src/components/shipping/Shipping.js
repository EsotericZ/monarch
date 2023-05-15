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
    const [customerList, setCustomerList] = useState([]);
    const [newRequest, setNewRequest] = useState({
        // requestedBy: '',
        customer: '',
        location: '',
        priority: '',
        jobNo: '',
        poNo: '',
        delivery: '',
        comments: '',
    });

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
        setNewRequest((prev) => {
            return { ...prev, 'priority': 'Low', 'delivery': 'Dropoff' }
        });
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

    const handleSchedule = (record) => {
        console.log(record)
    }

    useEffect(() => {
        fetchData();
    }, [showAdd]);

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
                                {/* <FloatingLabel label="Requested By" className="mb-2">
                                    <Form.Control defaultValue={cookieData.name} name="requestedBy" onChange={handleChangeAdd} />
                                </FloatingLabel> */}
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
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
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
                                        <th className='text-center'>Record</th>
                                        <th className='text-center'>Customer</th>
                                        <th className='text-center'>Location</th>
                                        <th className='text-center'>Priority</th>
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
                                            return (
                                                <tr key={index} record={record}>
                                                    <td className='text-center'>{record.record}</td>
                                                    <td className='text-center'>{record.customer}</td>
                                                    <td className='text-center'>{record.location}</td>
                                                    <td className='text-center'>{record.priority}</td>
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
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey='scheduled' title='Scheduled'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </Table>
                        </Tab>

                        <Tab eventKey='calendar' title='Calendar'>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>
                    <button onClick={handleOpenAdd}>Add</button>
                </div>
            }
        </div>
    )
}