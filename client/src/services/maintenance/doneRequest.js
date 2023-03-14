import api from '../api';

const doneRequest = async (record, done) => {
    const res = await api.post('/maintenance/doneRequest', {
        record: record,
        done: done,
    });
    return res.data;
}

export default doneRequest;