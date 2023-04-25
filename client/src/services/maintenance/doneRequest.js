import api from '../api';

const doneRequest = async (record, comments, done) => {
    const res = await api.post('/maintenance/doneRequest', {
        record: record,
        comments: comments,
        done: done,
    });
    return res.data;
}

export default doneRequest;