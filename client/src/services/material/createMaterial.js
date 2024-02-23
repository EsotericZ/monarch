import api from '../../api/api';

const createMaterial = async (programNo, material, jobNo, area) => {
    console.log(programNo, material, jobNo, area)
    const res = await api.post('/material/createMaterial', {
        programNo, 
        material, 
        jobNo, 
        area
    });
    return res.data;
}

export default createMaterial;