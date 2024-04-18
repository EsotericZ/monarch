import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';

import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import createQCNote from '../../services/qcinfo/createQCNote';
import updateQCInfo from '../../services/qcinfo/updateQCInfo';

import { Sidebar } from '../sidebar/Sidebar';

export const QualityInfo = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'engineering': false,
        };
    }
    
    const [searchedQC, setSearchedQC] = useState([]);
    const [searchedValueCustCode, setSearchedValueCustCode] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const results = await getAllQCNotes();
            console.log(results.data)
            setSearchedQC(results.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenItem = (item) => {
        console.log(item)
    }

    useEffect(() => {
        fetchData();
    }, [loading]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Quality Info</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Quality Info</h1>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th className='text-center'><input onChange={(e) => setSearchedValueCustCode(e.target.value)} placeholder='&#xf002;  Customer Code' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                <th className='text-center'>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchedQC
                                .filter((row) => 
                                    !searchedValueCustCode || row.custCode
                                        .toString()
                                        .toLowerCase()
                                        .includes(searchedValueCustCode.toString().toLowerCase())
                                )
                                .map((item, index) => {
                                    return (
                                        <tr key={index} item={item}>
                                            <td onClick={() => handleOpenItem(item)} className='text-center jobBold'>{item.custCode}</td>
                                            <td className='text-center'>{item.notes}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    )
}