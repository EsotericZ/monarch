import api from '../api';

const deleteRequest = async (record) => {
    const res = await api.post('/maintenance/deleteRequest', {
        record: record,
    });
    return res.data;
}

export default deleteRequest;