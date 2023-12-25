import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, Dropdown, FloatingLabel, Form, ListGroup, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';
// import getAllScales from "../../services/scales/getAllScales";
import getAllChannels from "../../services/scales/getAllChannels";
import getAllPorts from "../../services/scales/getAllPorts";

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import {warning} from 'react-icons-kit/fa/warning'

import { Sidebar } from '../sidebar/Sidebar';
import './inventory.css';

export const Inventory = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const [totalHubs, setTotalHubs] =useState(0);
    const [activeHubs, setActiveHubs] =useState(0);
    const [inactiveHubs, setInactiveHubs] =useState(0);
    const [percentActive, setPercentActive] = useState(0);
    const [percentInactive, setPercentInactive] = useState(0);
    const [loadingChannels, setLoadingChannles] = useState(true);
    const [count, setCount] = useState(0);

    const fetchData = async () => {
        try {
            console.log('hit')
            const channels = await getAllChannels();
            console.log(channels)
            let channelArray = channels.split("\n")
            let newChannelArray = [...new Set(channelArray.map((channel) => channel.slice(0,6)))]
            setActiveHubs(newChannelArray.length);

            console.log('hit2')
            const ports = await getAllPorts();
            console.log(ports)
            console.log(ports.data)
            setTotalHubs(ports.data.length)
            setInactiveHubs(ports.data.length - newChannelArray.length);

            setPercentActive((newChannelArray.length/ports.data.length)*100);
            setPercentInactive(100 - (newChannelArray.length/ports.data.length)*100);
                    
            setLoadingChannles(false)
        } catch (err) {
            console.log(err)
        }
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
    }, [loggedIn]);

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
                    <h1 className="text-center m-3">Inventory Managment</h1>

                    <div>
                        <Card style={{ width: '30%' }} className="cards">
                            <Card.Body>
                                <Card.Title className="text-center">Hub Health</Card.Title>
                                <Card.Text className="text-center">Total Hubs: {totalHubs}</Card.Text>
                                <ProgressBar className="mb-3">
                                    <ProgressBar variant='success' now={percentActive} />
                                    <ProgressBar variant='danger' now={percentInactive} />
                                </ProgressBar>
                                <ListGroup>
                                    <ListGroup.Item>{activeHubs} Active</ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="inactive">
                                            {inactiveHubs} Down
                                        </div>
                                        <div className="inactive inicon">
                                            {inactiveHubs ? <Icon align={'right'} icon={warning} size={18} style={{ color: 'red' }} /> : ''}
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                                <Link to='/hubHealth'>
                                    <button className='invBtn'>Manage</button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            }
        </div>
    )
}