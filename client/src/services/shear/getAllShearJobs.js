import api from '../../api/api';

const getAllShearJobs = async () => {
    const res = await api.get('/shear/getAllJobs');
    return res.data
};

export default getAllShearJobs;