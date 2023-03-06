import api from '../api';

const updateJob = async (jobNo, engineer) => {
    console.log('hit', jobNo, engineer)
    const res = await api.post("/engineering/updateJob", {
        jobNo: jobNo, 
        engineer: engineer
    });
    return res.data;
}

export default updateJob;