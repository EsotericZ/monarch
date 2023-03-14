import api from '../api';

const denyRequest = async (record, done, comments) => {
    console.log("now we here")
    console.log(record, done, comments)
    const res = await api.post('/maintenance/denyRequest', {
        record: record,
        done: done,
        comments: comments,
    });
    return res.data;
}

export default denyRequest;