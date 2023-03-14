import api from '../api';

const approveRequest = async (record, approvedBy) => {
    console.log("now we here")
    console.log(record, approvedBy)
    const res = await api.post('/maintenance/approveRequest', {
        approvedBy: approvedBy,
        record: record
    });
    return res.data;
}

export default approveRequest;