import api from '../../api/api';

const getAllLaserJobs = async () => {
    const res = await api.get('/laser/getAllJobs');
    return res.data
};

export default getAllLaserJobs;