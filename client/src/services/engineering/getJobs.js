import api from '../api';

const getAllJobs = async () => {
    const res = await api.get("/engineering/getAllJobs");
    return res.data
};

export default getAllJobs;