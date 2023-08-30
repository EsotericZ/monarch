import { useEffect, useState } from "react";
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
// import getAllScales from "../../services/scales/getAllScales";
import getAllChannels from "../../services/scales/getAllChannels";
import getAllPorts from "../../services/scales/getAllPorts";
import createPort from "../../services/scales/createPort";

export const Inventory = () => {
    // const [allScales, setAllScales] = useState();
    const [newPort, setNewPort] = useState({
        portNo: '',
        rack: 0,
    })
    const [showAdd, setShowAdd] = useState(false);
    const [allChannels, setAllChannels] = useState();
    const [loadingChannels, setLoadingChannles] = useState(true);
    let activeChannels = []

    const fetchData = async () => {
        try {
            // const scales = await getAllScales();
            // setAllScales(scales)
            
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
    }, [showAdd]);

    return (
        <>
            {/* <h1>Scales</h1>
            {allScales?.length
                ? (
                    <ul>
                        {allScales.map((scale, i) => <li key={i}>{scale.Name}</li>)}
                    </ul>
                ) : <p>No Scales</p>
            } */}
            <h1>Channels</h1>
            {loadingChannels 
                ? <p>Loading</p>
                :
                <>
                    <Modal show={showAdd}>
                        <Modal.Header>
                            <Modal.Title>Add Port</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FloatingLabel label="Port Number" className="mb-2">
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

                    {allChannels?.length
                        ? (
                            <ul>
                                {allChannels.map((channel, i) => <li key={i}>{channel.channel} || {channel.rack} || {channel.active}</li>)}
                            </ul>
                        ) : <p>No Channels</p>
                    }

                    <button className='mmBtn' onClick={handleOpenAdd}>Add Port</button>
                </>
            }
            
        </>
        
    )
}