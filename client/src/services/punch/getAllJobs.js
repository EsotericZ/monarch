import api from '../../api/api';

const getAllJobs = async () => {
    const res = await api.get('/punch/getAllJobs');
    return res.data
};

export default getAllJobs;