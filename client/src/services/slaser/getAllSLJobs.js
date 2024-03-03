import api from '../../api/api';

const getAllSLJobs = async () => {
    const res = await api.get('/slaser/getAllJobs');
    return res.data
};

export default getAllSLJobs;