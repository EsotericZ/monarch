import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import getAllSensors from "../../services/scales/getAllSensors";
import './scales.css'

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import PuffLoader from "react-spinners/PuffLoader";

import { Sidebar } from '../sidebar/Sidebar';

export const ScalesAdmin = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');

    const [allSensors, setAllSensors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [scaleName, setScaleName] = useState('');
    const [scaleType, setScaleType] = useState('Quantity');
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

    const fetchData = async () => {
        try {
            const sensors = await getAllSensors();
            setAllSensors(sensors)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }
    
    const handleCheckboxChange = (channelId) => {
        const isChecked = selectedCheckboxes.includes(channelId);
        if (isChecked) {
            setSelectedCheckboxes(selectedCheckboxes.filter(id => id !== channelId));
        } else {
            setSelectedCheckboxes([...selectedCheckboxes, channelId]);
        }
    };
    
        const handleSubmit = () => {
            console.log(scaleName, scaleType, selectedCheckboxes)
        };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Create Scale</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Create Scale</h1>
                    <div className='mx-3 centered-container'>
                        <Form>
                            <Form.Label>Scale Name</Form.Label>
                            <Form.Control 
                                type='text'
                                value={scaleName}
                                onChange={(e) => setScaleName(e.target.value)}
                            />
                            <Form.Label className='mt-3'>Scale Type</Form.Label>
                            <Form.Select 
                                aria-label="Scale Type"
                                value={scaleType}
                                onChange={(e) => setScaleType(e.target.value)}
                            >
                                <option value="Quantity">Quantity</option>
                                <option value="Percentage">Percentage</option>
                            </Form.Select>
                            <div className="form-check-columns">
                                {allSensors
                                    .filter(sensor => sensor.ScaleName == 'Unused')
                                    .map((sensor, index) => (
                                        <div key={index} className="form-check-column">
                                            <Form.Check
                                                type='checkbox'
                                                id={sensor.ChannelId}
                                                label={`Hub: ${sensor.HubSerialNumber} || Port: ${sensor.PortNumber} || Channel: ${sensor.ChannelNumber}`}
                                                onChange={() => handleCheckboxChange(sensor.ChannelId)}
                                                checked={selectedCheckboxes.includes(sensor.ChannelId)}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </Form>
                    </div>
                    <div className="d-flex justify-content-end mt-3 buttonMove">
                        <Button type='submit' className="custom-button" onClick={handleSubmit}>
                            Create
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}