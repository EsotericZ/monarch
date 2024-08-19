import api from '../../api/api';

const getSingleJob = async (JobNo) => {
    console.log(JobNo)
    const res = await api.post('/efficiency/getSingleJob', {
        JobNo
    });
    return res.data
};

export default getSingleJob;