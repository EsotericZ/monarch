import api from '../../api/api';

const updateEngineer = async (jobNo, engineer) => {
    const res = await api.post('/engineering/updateEngineer', {
        jobNo: jobNo, 
        engineer: engineer,
    });
    return res.data;
}

export default updateEngineer;