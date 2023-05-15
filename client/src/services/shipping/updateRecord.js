import api from '../api';

const updateRecord = async (updateRecord, record) => {
    const res = await api.post('/shipping/updateRecord', {
        updateRecord: updateRecord,
        record: record
    });
    return res.data;
}

export default updateRecord;