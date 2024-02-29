import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { plus } from 'react-icons-kit/fa/plus'
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllSupplies from '../../services/supplies/getAllSupplies';
import createSupplies from '../../services/supplies/createSupplies';

import { Sidebar } from '../sidebar/Sidebar';

export const Supplies = () => {
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

    const [searchedValueSupplies, setSearchedValueSupplies] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueEmployee, setSearchedValueEmployee] = useState('');
    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');

    const [supplies, setSupplies] = useState('');
    const [department, setDepartment] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [notes, setNotes] = useState('');
    const [productLink, setProductLink] = useState('');
    const [jobNo, setJobNo] = useState('');
    
    const [searchedSupplies, setSearchedSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const fetchData = async () => {
        try {
            const [allSupplies] = await Promise.all([
                getAllSupplies()
            ]);
    
            setSearchedSupplies(allSupplies.data);
          
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        try {
            await createSupplies(supplies, department, requestedBy, notes, productLink, jobNo)
            setSupplies('');
            setDepartment('');
            setRequestedBy('');
            setNotes('');
            setProductLink('');
            setJobNo('');
            setShow(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShow = () => {
        setShow(true);
    } ;

    useEffect(() => {
        fetchData();
    }, [loading, show]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Supplies</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Supplies</h1>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Add Program</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel label="Supplies Requested" className="mb-3">
                                    <Form.Control onChange={(e) => {setSupplies(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel label="Requested By" className="mb-3">
                                    <Form.Control onChange={(e) => {setRequestedBy(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel label="Department" className="mb-3">
                                    <Form.Control as="select" name="machine" onChange={(e) => {setDepartment(e.target.value)}}>
                                        <option> </option>
                                        <option>Welding</option>
                                        <option>Paint</option>
                                        <option>Shop</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Description / Notes" className="mb-3">
                                    <Form.Control onChange={(e) => {setNotes(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Product Link" className="mb-3">
                                    <Form.Control onChange={(e) => {setProductLink(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel label="Job No" className="mb-3">
                                    <Form.Control onChange={(e) => {setJobNo(e.target.value)}} />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className='mx-3'>
                    <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueSupplies(e.target.value)} placeholder='&#xf002;  Supplies' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueEmployee(e.target.value)} placeholder='&#xf002;  Requested By' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'>Description</th>
                                    <th className='text-center'>Link</th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'>Need</th>
                                    <th className='text-center'>On Order</th>
                                    <th className='text-center'>Expected</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedSupplies
                                    .filter((row) => 
                                        !searchedValueSupplies || row.supplies
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueSupplies.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueArea || row.department
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueArea.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueEmployee || row.requestedBy
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueEmployee.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueJobNo || row.jobNo
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueJobNo.toString().toLowerCase())
                                    )
                                    .map((item, index) => {
                                        return (
                                            <tr key={index} item={item}>
                                                <td className='text-center'>{item.supplies}</td>
                                                <td className='text-center'>{item.department}</td>
                                                <td className='text-center'>{item.requestedBy}</td>
                                                <td className='text-center'>{item.notes}</td>
                                                <td className='text-center'>{item.productLink}</td>
                                                <td className='text-center'>{item.jobNo}</td>
                                                <td className='text-center'>
                                                    {item.needSupplies &&
                                                        <Icon icon={check}/>
                                                    }
                                                </td>
                                                <td className='text-center'>
                                                    {item.onOrder &&
                                                        <Icon icon={check}/>
                                                    }
                                                </td>
                                                <td className='text-center'>{item.expected && format(parseISO(item.expected), 'MM/dd')}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Button className='rounded-circle addBtn' onClick={() => handleShow()}>
                            <Icon size={24} icon={plus}/>
                        </Button>
                        <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                            <Icon size={24} icon={refresh} />
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}