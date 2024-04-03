import apiScales from "../../api/apiScales";

const deleteItem = async (data) => {
    try {
        const res = await apiScales.post(`/scale_api/Scale/DeleteItem/${data}`)

        return res.data;
    } catch (err) {
        console.error(err)
    }
}

export default deleteItem;