import api from '../api';

const updateRequest = async (updateRequest, record) => {
    console.log("now we here")
    console.log(updateRequest, record)
    const res = await api.post('/maintenance/updateRequest', {
        updateRequest: updateRequest,
        record: record
    });
    return res.data;
}

export default updateRequest;