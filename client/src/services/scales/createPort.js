import api from '../../api/api';

const createPort = async (newPort) => {
    console.log(newPort)
    const res = await api.post('/scales/createPort', newPort);
    return res.data;
}

export default createPort;