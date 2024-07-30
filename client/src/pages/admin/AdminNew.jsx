import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';

import './admin.css';

import getAllUsers from '../../services/users/getAllUsers';
import getUserPassword from '../../services/users/getUserPassword';
import createUser from '../../services/users/createUser';
import deleteUser  from '../../services/users/deleteUser';
import updateUser from '../../services/users/updateUser';
import updateEngineering from '../../services/users/updateEngineering';
import updateForming from '../../services/users/updateForming';
import updateLaser from '../../services/users/updateLaser';
import updateMachining from '../../services/users/updateMachining';
import updateMaintenance from '../../services/users/updateMaintenance';
import updatePunch from '../../services/users/updatePunch';
import updateQuality from '../../services/users/updateQuality';
import updateSaw from '../../services/users/updateSaw';
import updateShear from '../../services/users/updateShear';
import updateShipping from '../../services/users/updateShipping';
import updateTLaser from '../../services/users/updateTLaser';
import updatePurchasing from '../../services/users/updatePurchasing';

import getAllRFID from '../../services/rfid/getAllRFID';
import { Sidebar } from '../sidebar/Sidebar';
import { EmployeeCard } from '../../components/EmployeeCard';

export const AdminNew = () => {
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
        tlaser: 0,
        quality: 0,
        forming: 0,
        machining: 0,
        laser: 0,
        saw: 0,
        punch: 0,
        shear: 0,
    });
    const [updateSingleUser, setUpdateSingleUser] = useState({
        id: '',
        name: '',
        username: '',
        number: '',
        password: '',
    });

    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');

    const [engineering, setEngineering] = useState(0);
    const [machining, setMachining] = useState(0);
    const [quality, setQuality] = useState(0);
    const [laser, setLaser] = useState(0);
    const [forming, setForming] = useState(0);
    const [tlaser, setTLaser] = useState(0);
    const [saw, setSaw] = useState(0);
    const [punch, setPunch] = useState(0);
    const [shear, setShear] = useState(0);
    const [maintenance, setMaintenance] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [purchasing, setPurchasing] = useState(0);

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
        updateMaintenance(user);
        setUpdate('Maintenace');
    }

    async function toggleShipping(user) {
        updateShipping(user);
        setUpdate('Shipping');
    }

    async function togglePurchasing(user) {
        updatePurchasing(user);
        setUpdate('Purchasing');
    }

    async function toggleEngineering(user) {
        updateEngineering(user)
        setUpdate('Engineering')
    }

    async function toggleTLaser(user) {
        updateTLaser(user)
        setUpdate('Tube Laser')
    }

    async function toggleQuality(user) {
        updateQuality(user)
        setUpdate('Quality')
    }

    async function toggleForming(user) {
        updateForming(user)
        setUpdate('Forming')
    }

    async function toggleMachining(user) {
        updateMachining(user)
        setUpdate('Machining')
    }

    async function toggleLaser(user) {
        updateLaser(user)
        setUpdate('Laser')
    }

    async function toggleSaw(user) {
        updateSaw(user)
        setUpdate('Saw')
    }

    async function togglePunch(user) {
        updatePunch(user)
        setUpdate('Punch')
    }

    async function toggleShear(user) {
        updateShear(user)
        setUpdate('Shear')
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
            setUserID(user.id);
            setName(user.name);
            setUsername(user.username);
            setNumber(user.number);
            setEngineering(user.engineering);
            setMachining(user.machining);
            setQuality(user.quality);
            setLaser(user.laser);
            setForming(user.forming);
            setTLaser(user.tlaser);
            setSaw(user.saw);
            setPunch(user.punch);
            setShear(user.shear);
            setMaintenance(user.maintenance);
            setShipping(user.shipping);
            setPurchasing(user.purchasing);
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                (cookieData.name ?
                    <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <h1 className='text-center m-3'>Employee Database</h1>
                        <Modal show={showAdd} onHide={handleCloseAdd}>
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
                            <Modal.Footer className="justify-content-center">
                                <Button className='modalBtnCancel' variant="secondary" onClick={handleCloseAdd}>
                                    Cancel
                                </Button>
                                <Button className='modalBtnVerify' variant="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showUpdate} onHide={handleCloseUpdate}>
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

                                    <Form.Group className="d-flex flex-wrap justify-content-center m-3">
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Engineering</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setEngineering(e.target.checked); toggleEngineering(userID)}}
                                                checked={engineering}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Machining</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setMachining(e.target.checked); toggleMachining(userID)}}
                                                checked={machining}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Quality</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setQuality(e.target.checked); toggleQuality(userID)}}
                                                checked={quality}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Laser</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setLaser(e.target.checked); toggleLaser(userID)}}
                                                checked={laser}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Forming</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setForming(e.target.checked); toggleForming(userID)}}
                                                checked={forming}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">TLaser</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setTLaser(e.target.checked); toggleTLaser(userID)}}
                                                checked={tlaser}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Saw</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setSaw(e.target.checked); toggleSaw(userID)}}
                                                checked={saw}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Punch</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setPunch(e.target.checked); togglePunch(userID)}}
                                                checked={punch}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Shear</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setShear(e.target.checked); toggleShear(userID)}}
                                                checked={shear}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Maintenance</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setMaintenance(e.target.checked); toggleMaintenance(userID)}}
                                                checked={maintenance}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Shipping</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setShipping(e.target.checked); toggleShipping(userID)}}
                                                checked={shipping}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center mb-2 mx-2">
                                            <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Purchasing</Form.Label>
                                            <Form.Check 
                                                type="checkbox" 
                                                onChange={(e) => {setPurchasing(e.target.checked); togglePurchasing(userID)}}
                                                checked={purchasing}
                                            />
                                        </div>
                                    </Form.Group>

                                </Form>  
                            </Modal.Body>
                            <Modal.Footer className="justify-content-center">
                                {/* <Button className='modalBtnCancel' variant="secondary" onClick={handleDelete}>
                                    Delete
                                </Button> */}
                                <Button className='modalBtnCancel' variant="secondary" onClick={handleCloseUpdate}>
                                    Cancel
                                </Button>
                                <Button className='modalBtnVerify' variant="primary" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                            {allUsers.map((user, index) => {
                                return (
                                    <EmployeeCard key={index} user={user} handleOpenUpdate={handleOpenUpdate}/>
                                )
                            })}
                        </div>
                        <Button className='rounded-circle refreshBtn' onClick={() => handleOpenAdd()}>
                            <Icon size={24} icon={plus}/>
                        </Button>
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