import api from '../../api/api';

// const updateJob = async (id, blNotes, osvNotes, ariba) => {
const updateJob = async (id, blNotes, osvNotes, cdate) => {
    const res = await api.post('/backlog/updateJob', {
        id,
        blNotes, 
        osvNotes, 
        // ariba,
        cdate,
    });
    return res.data;
}

export default updateJob;