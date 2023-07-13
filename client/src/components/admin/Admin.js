import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { circle_ok } from 'react-icons-kit/ikons/circle_ok';
import { circle_minus } from 'react-icons-kit/ikons/circle_minus';

import './admin.css';

import getAllUsers from '../../services/users/getAllUsers';
import getUserPassword from '../../services/users/getUserPassword';
import createUser from '../../services/users/createUser';
import deleteUser  from '../../services/users/deleteUser';
import updateUser from '../../services/users/updateUser';
import updateEngineering from '../../services/users/updateEngineering';
import updateShipping from '../../services/users/updateShipping';
import updateMaintenance from '../../services/users/updateMaintenance';
import getAllRFID from '../../services/rfid/getAllRFID';
import { Sidebar } from '../sidebar/Sidebar';

export const Admin = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
        };
    }

    const [allUsers, setAllUsers] = useState('');
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        number: '',
        password: '',
        role: 'employee',
        maintenance: 0,
        shipping: 0,
        engineering: 0,
    });
    const [updateSingleUser, setUpdateSingleUser] = useState({
        id: '',
        name: '',
        username: '',
        number: '',
        password: '',
    });

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');

    async function fetchData() {
        try {
            getAllRFID()
            .then((res) => {
                let dataRFID = res.data;
                getAllUsers()
                .then((res) => {
                    let userData = res.data;
                    userData.map((x) => {
                        x.etch = '-';
                        dataRFID.map((y) => {
                            if (x.number == y.empNo) {
                                x.etch = y.etch;
                            } 
                        });
                    });
                    setAllUsers(userData)
                    setLoading(false)
                });
            })
        } catch (err) {
            console.log(err);
        }
    }

    async function toggleMaintenance(user) {
        updateMaintenance(user.id);
        setUpdate('Maintenace');
    }

    async function toggleShipping(user) {
        updateShipping(user.id);
        setUpdate('Shipping');
    }

    async function toggleEngineering(user) {
        updateEngineering(user.id)
        setUpdate('Engineering')
    }

    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleSave = () => {
        createUser(newUser)
        .then(fetchData())
        .then(setShowAdd(false))
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateSingleUser((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenUpdate = (user) => {
        getUserPassword(user.id)
        .then((res) => {
            setUpdateSingleUser({
                ...updateSingleUser,
                id: user.id,
                name: user.name,
                username: user.username,
                number: user.number,
                password: res.data
            })
            setPassword(res.data)
        }).then(() => {
            setName(user.name);
            setUsername(user.username);
            setNumber(user.number);
            setShowUpdate(true);    
        })
    };
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleUpdate = () => {
        updateUser(updateSingleUser)
        .then(fetchData())
        .then(setShowUpdate(false))
    };

    const handleDelete = () => {
        deleteUser(updateSingleUser)
        .then(fetchData())
        .then(setShowUpdate(false))
    };

    useEffect(() => {
        fetchData();
        setUpdate('');
    }, [showAdd, update, showUpdate]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Employee Database</h1>
                    <h1>Loading</h1>
                </div>
            :
                (cookieData.name ?
                    <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <h1 className='text-center m-3'>Employee Database</h1>
                        <Modal show={showAdd}>
                            <Modal.Header>
                                <Modal.Title>Add User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <FloatingLabel label="Employee Name" className="mb-2">
                                        <Form.Control name="name" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Username" className="mb-2">
                                        <Form.Control name="username" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Employee Number" className="mb-2">
                                        <Form.Control name="number" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Password" className="mb-2">
                                        <Form.Control type="password" name="password" onChange={handleChangeAdd} />
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

                        <Modal show={showUpdate}>
                            <Modal.Header>
                                <Modal.Title>Update Employee {name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <FloatingLabel label="Employee Name" className="mb-2">
                                        <Form.Control defaultValue={name} name="name" onChange={handleChangeUpdate} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Username" className="mb-2">
                                        <Form.Control defaultValue={username} name="username" onChange={handleChangeUpdate} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Employee Number" className="mb-2">
                                        <Form.Control defaultValue={number} name="number" onChange={handleChangeUpdate} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Password" className="mb-2">
                                        <Form.Control defaultValue={password} name="password" onChange={handleChangeUpdate} />
                                    </FloatingLabel>
                                </Form>  
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                                <Button variant="secondary" onClick={handleCloseUpdate}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div className='mx-3'>
                            {/* <Table striped hover variant='dark'> */}
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Name</th>
                                        <th className='text-center'>Username</th>
                                        <th className='text-center'>Number</th>
                                        <th className='text-center'>Role</th>
                                        <th className='text-center'>RFID</th>
                                        <th className='text-center'>Maintenance</th>
                                        <th className='text-center'>Shipping</th>
                                        <th className='text-center'>Engineering</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user, index) => {
                                        return (
                                            <tr key={index} user={user}>
                                                <td onClick={() => handleOpenUpdate(user)} className='text-center'>{user.name}</td>
                                                <td onClick={() => handleOpenUpdate(user)} className='text-center'>{user.username}</td>
                                                <td onClick={() => handleOpenUpdate(user)} className='text-center'>{user.number}</td>
                                                <td className='text-center'>{user.role}</td>
                                                <td className='text-center'><a href='http://10.0.1.45:3000/' target='__blank'>{user.etch}</a></td>
                                                {user.maintenance ?
                                                    <td className='text-center' onClick={() => toggleMaintenance(user)}>
                                                        <Icon icon={circle_ok} style={{ color: '#5BC326' }} />
                                                    </td>
                                                :
                                                    <td className='text-center' onClick={() => toggleMaintenance(user)}>
                                                        <Icon icon={circle_minus} style={{ color: '#CC0202' }} />
                                                    </td>
                                                }
                                                {user.shipping ?
                                                    <td className='text-center' onClick={() => toggleShipping(user)}>
                                                        <Icon icon={circle_ok} style={{ color: '#5BC326' }} />
                                                    </td>
                                                :
                                                    <td className='text-center' onClick={() => toggleShipping(user)}>
                                                        <Icon icon={circle_minus} style={{ color: '#CC0202' }} />
                                                    </td>
                                                }
                                                {user.engineering ?
                                                    <td className='text-center' onClick={() => toggleEngineering(user)}>
                                                        <Icon icon={circle_ok} style={{ color: '#5BC326' }} />
                                                    </td>
                                                :
                                                    <td className='text-center' onClick={() => toggleEngineering(user)}>
                                                        <Icon icon={circle_minus} style={{ color: '#CC0202' }} />
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <button onClick={handleOpenAdd}>Add User</button>
                        </div>
                    </div>
                :
                    <div style={{ display: 'inline', width: '100%' }}>
                        <h1>You don't have access to this page</h1>
                        <h2>Please sign in</h2>
                        <h2>{cookieData.name}</h2>
                    </div>
                )
            }
        </div>
    )
}