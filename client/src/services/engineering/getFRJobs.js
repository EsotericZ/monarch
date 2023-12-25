import api from '../../api/api';

const getFRJobs = async () => {
    const res = await api.get('/engineering/getFRJobs');
    return res.data
};

export default getFRJobs;