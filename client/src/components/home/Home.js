import { useEffect, useState } from 'react';

import getJobs from '../../services/engineering/getJobs';

const Home = () => {

    const [searchEng, setSearchEng] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const find = () => {
            let data = getJobs();
            data.then((res) => {
                console.log(res.data)
            })
            // try {
            //     sql.connect(config, function(err,) {
            //         if (err) console.error(err);
            //         let request = new sql.Request();
                
            //         request.query("SELECT * FROM OrderRouting WHERE WorkCntr='211 TLASER'", function(err, recordset) {
            //             if (err) console.error(err);
            
            //             res.send(recordset)
            //         })
            //     })
            // } catch (err) {
            //     console.log(err)
            // }
            console.log('ug')
        };
        find();
    }, []);

    return (
        <>
            <h1>Welcome</h1>
        </>
    )
}

export default Home;