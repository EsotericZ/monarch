import api from '../../api/api';

const updateComplete = async (id) => {
    console.log(id)
    const res = await api.post('/material/updateComplete', {
        id: id
    });
    return res.data;
}

export default updateComplete;