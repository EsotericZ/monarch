import api from '../api';

const holdRequest = async (record, requestHold) => {
    console.log("now we here")
    console.log(record, requestHold)
    const res = await api.post('/maintenance/holdRequest', {
        requestHold: requestHold,
        record: record
    });
    return res.data;
}

export default holdRequest;