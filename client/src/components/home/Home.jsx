import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Modal, Table } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Sidebar } from '../sidebar/Sidebar';

import getAllTodos from '../../services/todo/getAllTodos';
import createTodo from '../../services/todo/createTodo';
import updateTodo from '../../services/todo/updateTodo';

export const Home = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allTodos, setAllTodos] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [newTodo, setNewTodo] = useState({
        description: '',
        requestType: '',
        area: '',
        priority: '',
        status: 'Pending',
    });
    const [updateSingleTodo, setUpdateSingleTodo] = useState({
        description: '',
        requestType: '',
        area: '',
        priority: '',
        status: '',
    });
    const [description, setDescription] = useState('');
    const [requestType, setRequestType] = useState('');
    const [area, setArea] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');

    async function fetchData() {
        try {
            getAllTodos()
            .then((res) => {
                setAllTodos(res.data)
                setLoading(false)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        setNewTodo((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleSave = () => {
        createTodo(newTodo)
        .then(fetchData())
        .then(setShowAdd(false))
    };

    const handleOpenUpdate = (todo) => {
        setUpdateSingleTodo({
            ...updateSingleTodo,
            id: todo.id,
            description: todo.description,
            requestType: todo.requestType,
            area: todo.area,
            priority: todo.priority,
            status: todo.status,
        })
        setDescription(todo.description);
        setRequestType(todo.requestType);
        setArea(todo.area);
        setPriority(todo.priority);
        setStatus(todo.status);
        setShowUpdate(true)
    }
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleUpdate = () => {
        console.log(updateSingleTodo)
        updateTodo(updateSingleTodo)
            .then(fetchData())
            .then(setShowUpdate(false))
    }
    const handleChangeActive = (e) => {
        const { name, value } = e.target;
        setUpdateSingleTodo((prev) => {
            return { ...prev, [name]: value }
        });
    }

    useEffect(() => {
        try {
            setCookieData(jwt_decode(cookies.get('jwt')));
            fetchData()
            setLoggedIn(true)
        } catch {
            setCookieData('');
        }
    }, [loggedIn, showAdd, showUpdate])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                <h1 className='text-center m-3'>Monarch Metal</h1>
                {cookieData ?
                    <>
                        <h5 className='text-center m-3'>User: {cookieData.name}</h5>
                        <br></br>
                        <br></br>
                        <div className='mx-3'>
                            {/* <Table striped hover variant='dark'> */}
                            <h1 className='text-center m-3'>Website Requests</h1>
                            
                            <Modal show={showAdd}>
                                <Modal.Header>
                                    <Modal.Title>Add Request</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <FloatingLabel label="Request Type" className="mb-2">
                                            <Form.Control as="select" name="requestType" onChange={handleChangeAdd}>
                                                <option></option>
                                                <option>Bug Fix</option>
                                                <option>E2 Connection</option>
                                                <option>Feature</option>
                                                <option>Idea</option>
                                                <option>Imporvment</option>
                                                <option>New Page</option>
                                                <option>Other</option>
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel label="Description" className="mb-2">
                                            <Form.Control name="description" onChange={handleChangeAdd} />
                                        </FloatingLabel>
                                        <FloatingLabel label="Area" className="mb-2">
                                            <Form.Control name="area" onChange={handleChangeAdd} />
                                        </FloatingLabel>
                                        <FloatingLabel label="Priority" className="mb-2">
                                            <Form.Control as="select" name="priority" onChange={handleChangeAdd}>
                                                <option></option>
                                                <option>1 - Low</option>
                                                <option>2 - Medium</option>
                                                <option>3 - High</option>
                                                <option>4 - Urgent</option>
                                            </Form.Control>
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
                                    <Modal.Title>Update Request</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <FloatingLabel label="Request Type" className="mb-2">
                                            <Form.Control defaultValue={requestType} as="select" name="requestType" onChange={handleChangeActive}>
                                                <option></option>
                                                <option>Bug Fix</option>
                                                <option>E2 Connection</option>
                                                <option>Feature</option>
                                                <option>Idea</option>
                                                <option>Imporvment</option>
                                                <option>New Page</option>
                                                <option>Other</option>
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel label="Description" className="mb-2">
                                            <Form.Control defaultValue={description} name="description" onChange={handleChangeActive} />
                                        </FloatingLabel>
                                        <FloatingLabel label="Area" className="mb-2">
                                            <Form.Control defaultValue={area} name="area" onChange={handleChangeActive} />
                                        </FloatingLabel>
                                        <FloatingLabel label="Priority" className="mb-2">
                                            <Form.Control defaultValue={priority} as="select" name="priority" onChange={handleChangeActive}>
                                                <option></option>
                                                <option>1 - Low</option>
                                                <option>2 - Medium</option>
                                                <option>3 - High</option>
                                                <option>4 - Urgent</option>
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel label="Status" className="mb-2">
                                            <Form.Control defaultValue={status} as="select" name="status" onChange={handleChangeActive}>
                                                <option></option>
                                                <option>Complete</option>
                                                <option>Future</option>
                                                <option>In Progress</option>
                                                <option>Pending Approval</option>
                                            </Form.Control>
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

                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Request Type</th>
                                        <th className='text-center'>Description</th>
                                        <th className='text-center'>Area</th>
                                        <th className='text-center'>Priority</th>
                                        <th className='text-center'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTodos.map((todo, index) => {
                                        return (
                                            <tr key={index} todo={todo}>
                                                <td onClick={() => handleOpenUpdate(todo)} className='text-center'>{todo.requestType}</td>
                                                <td onClick={() => handleOpenUpdate(todo)} className='text-center'>{todo.description}</td>
                                                <td onClick={() => handleOpenUpdate(todo)} className='text-center'>{todo.area}</td>
                                                <td onClick={() => handleOpenUpdate(todo)} className='text-center'>{todo.priority}</td>
                                                <td onClick={() => handleOpenUpdate(todo)} className='text-center'>{todo.status}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <button className='mmBtn' onClick={handleOpenAdd}>Add</button>
                        </div>
                    </>

                :
                    <div className='text-center m-3'>
                        <NavLink exact to='/login'>
                            <button className='m-3 mmBtn'>Log In</button>
                        </NavLink>
                    </div>
                }
            </div>
        </div>
    )
}