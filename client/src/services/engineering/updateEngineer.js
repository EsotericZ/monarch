import api from '../../api/api';

const updateEngineer = async (jobNo, engineer) => {
    console.log('API Response:');
    const res = await api.post('/engineering/updateEngineer', {
        jobNo: jobNo, 
        engineer: engineer,
    });
    console.log('API Response:', res);
    return res;
}

export default updateEngineer;