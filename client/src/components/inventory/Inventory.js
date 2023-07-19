import { useEffect, useState } from "react";
import getAllScales from "../../services/scales/getAllScales";

export const Inventory = () => {
    const [allScales, setAllScales] = useState([]);

    async function fetchData() {
        try {
            getAllScales()
                .then((res) => {
                    console.log(res)
                })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <h1>Inventory</h1>
    )
}