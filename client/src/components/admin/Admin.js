import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { primitiveDotStroke } from 'react-icons-kit/oct/primitiveDotStroke';

import getAllUsers from '../../services/users/getAllUsers';
import updateEngineering from '../../services/users/updateEngineering';
import updateShipping from '../../services/users/updateShipping';
import updateMaintenance from '../../services/users/updateMaintenance';
import createUser from '../../services/users/createUser';
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
    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        number: '',
        password: '',
        role: 'employee',
        maintenance: '',
        shipping: '',
        engineering: ''
    });

    async function fetchData() {
        try {
            getAllUsers()
            .then((res) => {
                setAllUsers(res.data)
                setLoading(false)
            });
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

    useEffect(() => {
        fetchData();
        setUpdate('');
    }, [update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'inline', width: '100%' }}>
                    <h1>Loading</h1>
                </div>
            :
                (cookieData.name ?
                    <div style={{ display: 'inline', width: '100%' }}>
                        <h1>Employee Database</h1>
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
                                        <Form.Control name="password" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Enigineering (Write Access)" className="mb-2">
                                        <Form.Control name="enigineering" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Maintenance (Write Access)" className="mb-2">
                                        <Form.Control name="maintenance" onChange={handleChangeAdd} />
                                    </FloatingLabel>
                                    <FloatingLabel label="Shipping (Write Access)">
                                        <Form.Control name="shipping" onChange={handleChangeAdd} />
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

                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'>Name</th>
                                    <th className='text-center'>Username</th>
                                    <th className='text-center'>Number</th>
                                    <th className='text-center'>Password</th>
                                    <th className='text-center'>Role</th>
                                    <th className='text-center'>Maintenance</th>
                                    <th className='text-center'>Shipping</th>
                                    <th className='text-center'>Engineering</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user, index) => {
                                    return (
                                        <tr key={index} user={user}>
                                            <td className='text-center'>{user.name}</td>
                                            <td className='text-center'>{user.username}</td>
                                            <td className='text-center'>{user.number}</td>
                                            <td className='text-center'>
                                                <Icon icon={ primitiveDotStroke }/>
                                                <Icon icon={ primitiveDotStroke }/>
                                                <Icon icon={ primitiveDotStroke }/>
                                                <Icon icon={ primitiveDotStroke }/>
                                            </td>
                                            <td className='text-center'>{user.role}</td>
                                            {user.maintenance ?
                                                <td className='text-center' onClick={() => toggleMaintenance(user)}>On</td>
                                            :
                                                <td className='text-center' onClick={() => toggleMaintenance(user)}>-</td>
                                            }
                                            {user.shipping ?
                                                <td className='text-center' onClick={() => toggleShipping(user)}>On</td>
                                            :
                                                <td className='text-center' onClick={() => toggleShipping(user)}>-</td>
                                            }
                                            {user.engineering ?
                                                <td className='text-center' onClick={() => toggleEngineering(user)}>On</td>
                                            :
                                                <td className='text-center' onClick={() => toggleEngineering(user)}>-</td>
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <button onClick={handleOpenAdd}>Add User</button>
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