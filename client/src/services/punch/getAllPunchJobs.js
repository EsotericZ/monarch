import api from '../../api/api';

const getAllPunchJobs = async () => {
    const res = await api.get('/punch/getAllJobs');
    return res.data
};

export default getAllPunchJobs;