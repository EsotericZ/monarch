import api from '../api';

const getJobs = async () => {
    const res = await api.get("/engineering/getJobs");
    return res.data
};

export default getJobs;