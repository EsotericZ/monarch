import { useEffect, useState } from 'react';

import getJobs from '../../services/engineering/getAllJobs';

const Home = () => {
    const [searchedEng, setSearchedEng] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const find = () => {
            try {
                let data = getJobs();
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
            {searchedEng.map((job, index) => {
                return (
                    <ul key={index}>
                        <li>{job.PartNo}</li>
                    </ul>
                )
            })}
        </>
}

export default Home;