import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, FloatingLabel, Form, Modal, Table } from 'react-bootstrap';
import getAllChannels from "../../../services/scales/getAllChannels";
import getAllPorts from "../../../services/scales/getAllPorts";
import createPort from "../../../services/scales/createPort";

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../../sidebar/Sidebar';

export const HubHealth = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [newPort, setNewPort] = useState({
        portNo: '',
        rack: 0,
    })
    const [showAdd, setShowAdd] = useState(false);
    const [allChannels, setAllChannels] = useState();
    const [loadingChannels, setLoadingChannles] = useState(true);
    let activeChannels = []

    const [searchedValuePort, setSearchedValuePort] = useState('');
    const [searchedValueRack, setSearchedValueRack] = useState('');
    const [searchedValueActive, setSearchedValueActive] = useState('');
    const [count, setCount] = useState(0);

    const fetchData = async () => {
        try {
            const channels = await getAllChannels();
            let channelArray = channels.split("\n")
            let newChannelArray = [...new Set(channelArray.map((channel) => channel.slice(0,6)))]

            await getAllPorts()
            .then((res) => {
                const channels = res.data
                channels.forEach(channel => {
                    if (newChannelArray.includes(channel.portNo)) {
                        activeChannels.push({'channel': channel.portNo, 'rack': channel.rack, 'active': 'true'})
                    } else {
                        activeChannels.push({'channel': channel.portNo, 'rack': channel.rack, 'active': 'false'})
                    }
                })
            })
                    
            setAllChannels(activeChannels);
            setLoadingChannles(false)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePortAdd = (e) => {
        const { name, value } = e.target;
        setNewPort((prev) => {
            return {...prev, [name]: value}
        })
    }
    const handleOpenAdd = () => setShowAdd(true)
    const handleCloseAdd = () => setShowAdd(false)
    const handleSave = () => {
        createPort(newPort)
        .then(fetchData())
        .then(setShowAdd(false))
    }

    useEffect(() => {
        fetchData();
        try {
            setCookieData(jwt_decode(cookies.get('jwt')));
            fetchData()
            setLoggedIn(true)
        } catch {
            setCookieData('');
        }
    }, [loggedIn, showAdd]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count + 1);
            fetchData();
        }, 60000);

        return () => clearInterval(interval);
    }, [count])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loadingChannels ? 
                <p>Loading</p>
                :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className="text-center m-3">Hub Health and Managment</h1>
                    <Modal show={showAdd}>
                        <Modal.Header>
                            <Modal.Title>Add Hub</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Hub Number" className="mb-2">
                                    <Form.Control name="portNo" onChange={handlePortAdd} />
                                </FloatingLabel>
                                <FloatingLabel label="Rack Number" className="mb-2">
                                    <Form.Control name="rack" onChange={handlePortAdd} />
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

                    <div className="mx-3">
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className="text-center">Hub Number<input onChange={(e) => setSearchedValuePort(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                    <th className="text-center">Rack Location<input onChange={(e) => setSearchedValueRack(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                    <th className="text-center">Active<input onChange={(e) => setSearchedValueActive(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allChannels
                                    .filter((row) => 
                                        !searchedValuePort || row.channel
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValuePort.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueRack || row.rack
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueRack.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueActive || row.active
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueActive.toString().toLowerCase())
                                    )
                                    .map((record, index) => {
                                        return (
                                            <tr key={index} record={record}>
                                                <td className="text-center">{record.channel}</td>
                                                <td className="text-center">{record.rack}</td>
                                                <td className="text-center">{record.active}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    <button className='mmBtn mt-2' onClick={handleOpenAdd}>Add Hub</button>
                    <Link to='/scales'>
                        <button className='invBtn'>Scales</button>
                    </Link>
                    </div>
                </div>
            }
        </div>
    )
}