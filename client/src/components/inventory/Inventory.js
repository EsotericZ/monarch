import { useEffect, useState } from "react";
// import getAllScales from "../../services/scales/getAllScales";
import getAllChannels from "../../services/scales/getAllChannels";
import getAllPorts from "../../services/scales/getAllPorts";

export const Inventory = () => {
    // const [allScales, setAllScales] = useState();
    const [allChannels, setAllChannels] = useState();
    const [loadingChannels, setLoadingChannles] = useState(true);
    let activeChannels = []

    const fetchData = async () => {
        try {
            // const scales = await getAllScales();
            // setAllScales(scales)
            
            const channels = await getAllChannels();
            let channelArray = channels.split("\n")
            let newChannelArray = [...new Set(channelArray.map((channel) => channel.slice(0,6)))]

            await getAllPorts()
            .then((res) => {
                const channels = res.data
                channels.forEach(channel => {
                    if (newChannelArray.includes(channel.portNo)) {
                        activeChannels.push({'channel': channel.portNo, 'rack': channel.rack, 'active': 'true'})
                    } else {
                        activeChannels.push({'channel': channel.portNo, 'rack': channel.rack, 'active': 'false'})
                    }
                })
            })
                    
            setAllChannels(activeChannels);
            setLoadingChannles(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* <h1>Scales</h1>
            {allScales?.length
                ? (
                    <ul>
                        {allScales.map((scale, i) => <li key={i}>{scale.Name}</li>)}
                    </ul>
                ) : <p>No Scales</p>
            } */}
            <h1>Channels</h1>
            {loadingChannels 
                ?<p>Loading</p>
                :
                allChannels?.length
                    ? (
                        <ul>
                            {allChannels.map((channel, i) => <li key={i}>{channel.channel} || {channel.rack} || {channel.active}</li>)}
                        </ul>
                    ) : <p>No Channels</p>
                
            }
        </>
        
    )
}