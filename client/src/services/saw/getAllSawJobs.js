import api from '../../api/api';

const getAllSawJobs = async () => {
    const res = await api.get('/saw/getAllJobs');
    return res.data
};

export default getAllSawJobs;