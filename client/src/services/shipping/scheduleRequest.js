import api from '../../api/api';

const scheduleRequest = async (record) => {
    const res = await api.post('/shipping/scheduleRequest', record)
    return res.data;
}

export default scheduleRequest;