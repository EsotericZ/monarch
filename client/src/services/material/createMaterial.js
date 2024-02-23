import api from '../../api/api';

const createMaterial = async (programNo, materialType, jobNo, area) => {
    console.log(programNo, materialType, jobNo, area)
    const res = await api.post('/material/createMaterial', {
        programNo, 
        materialType, 
        jobNo, 
        area
    });
    return res.data;
}

export default createMaterial;