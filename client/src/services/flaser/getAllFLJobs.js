import api from '../../api/api';

const getAllFLJobs = async () => {
    const res = await api.get('/flaser/getAllJobs');
    return res.data
};

export default getAllFLJobs;