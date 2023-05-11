import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { checkCircleO } from 'react-icons-kit/fa/checkCircleO';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';

import getAllOrders from '../../services/shipping/getAllOrders';
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
            'maintenance': false,
        };
    }

    const [searchedShip, setSearchedShip] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);

    async function fetchData() {
        try {
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
        console.log(e)
    }

    const handleOpenAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleSave = () => {
        console.log('add')
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1>Loading</h1>
                :
                // <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                <div style={{ display: 'block', width: '100%' }}>
                    <h1>Shipping</h1>
                    <Modal show={showAdd}>
                        <Modal.Header>
                            <Modal.Title>Add Request</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Requested By" className="mb-2">
                                    <Form.Control defaultValue={cookieData.name} name="requestedBy" onChange={handleChangeAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="Area" className="mb-2">
                                    <Form.Control name="area" onChange={handleChangeAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="Equipment" className="mb-2">
                                    <Form.Control as="select" name="equipment" onChange={handleChangeAdd}>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Request Type" className="mb-2">
                                    <Form.Control as="select" name="requestType" onChange={handleChangeAdd}>
                                        <option>Routine</option>
                                        <option>Emergency</option>
                                        <option>Safety</option>
                                        <option>Planned</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel label="Description" className="mb-2">
                                    <Form.Control name="description" onChange={handleChangeAdd} />
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
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>Record</th>
                                        <th>Customer</th>
                                        <th>Location</th>
                                        <th>Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedShip
                                        .map((record, index) => {
                                            return (
                                                <tr key={index} record={record}>
                                                    <td>{record.record}</td>
                                                    <td>{record.customer}</td>
                                                    <td>{record.location}</td>
                                                    <td>{record.priority}</td>
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
                </div>
            }
        </div>
    )
}