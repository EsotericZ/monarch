import api from '../api';

const updateRequest = async (updateRequest, record) => {
    console.log(updateRequest)
    const res = await api.post('/maintenance/updateRequest', {
        updateRequest: updateRequest,
        record: record
    });
    return res.data;
}

export default updateRequest;