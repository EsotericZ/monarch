import api from '../../api/api';

const updateJob = async (jobNo, formProgrammer, formStatus) => {
    console.log(jobNo, formProgrammer, formStatus)
    const res = await api.post('/forming/updateJob', {
        jobNo: jobNo, 
        formProgrammer: formProgrammer,
        formStatus: formStatus,
    });
    return res.data;
}

export default updateJob;