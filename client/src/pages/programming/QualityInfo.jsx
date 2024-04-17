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
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const results = await getAllQCNotes();
            setSearchedQC(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

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
                    <h2 className='text-center'>This Page is Under Construction</h2>
                </div>
            }
        </div>
    )
}