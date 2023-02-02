import { useEffect, useState } from 'react';

import getAllJobs from '../../services/engineering/getJobs';

const Engineering = () => {
    const [searchedEng, setSearchedEng] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const find = () => {
            try {
                let data = getAllJobs();
                data.then((res) => {
                    setSearchedEng(res.recordsets[0]);
                    setLoading(false)
                })
            } catch (err) {
                console.log(err)
            }
        };
        find();
    }, []);

    return loading ?
        <>
            <h1>Welcome</h1>
            <h2>Loading</h2>
        </>
        :
        <>
            <h1>Welcome</h1>
            <table>
                <tbody>
                {searchedEng.map((job, index) => {
                    return (
                        <tr key={index}>
                            <td>{job.JobNo}</td>
                            <td>{job.PartNo}</td>
                            <td>{job.Revision}</td>
                            <td>{job.EstimQty}</td>
                            <td>{job.DueDate}</td>
                            <td>{job.CustCode}</td>
                            <td>{job.User_Text3}</td>
                            <td>{job.User_Text2}</td>
                            <td>{job.User_Number3}</td>
                            <td>{job.OrderNo}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
}

export default Engineering;