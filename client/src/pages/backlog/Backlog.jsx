import { useEffect, useState } from 'react';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import getAllJobs from '../../services/engineering/getAllJobs';
import { Sidebar } from '../sidebar/Sidebar';

export const Backlog = () => {
    const cookies = new Cookies();
    let cookieData;
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
        };
    }

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [allJobs] = await Promise.all([
                getAllJobs(),
            ]);

            console.log(allJobs)
            console.log(allJobs.filter(row => typeof row.JobNo !== 'undefined'))
    
            // setEngTotal(engRes.filter(row => typeof row.JobNo !== 'undefined').length);
            // setExpedite(engRes.filter(row => typeof row.JobNo !== 'undefined' && row.WorkCode == 'HOT').length);
            // setEngTbr(tbrRes.filter(row => typeof row.JobNo !== 'undefined').length);
            // setEngFuture(futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length);
            // setEngRepeat(repeatRes.length);
            // setEngOutsource(outsourceRes.length);

            // setFormTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            // setFormFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length));
            // setTestBD(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.formStatus == 'BD TEST'))).length));
            
            // setTLTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length));
            // setTLFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length));

            // setQCTbr(((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            // setQCFuture(((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length));
            // setProto(((engRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'PROTO'))).length));

            // setUnconfirmedJobs(unconfirmedRes);
            // setUnconfirmedTotal(unconfirmedRes.length);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Backlog</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                (cookieData.backlog ?
                    <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <h1 className='text-center m-3'>Backlog</h1>
                    </div>
                :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', width: '100%' }}>
                        <h1>You don't have access to this page</h1>
                    </div>
                )
            }
        </div>
    )
}