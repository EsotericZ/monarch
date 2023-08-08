import { useEffect, useState } from "react";
import getAllScales from "../../services/scales/getAllScales";
import getAllChannels from "../../services/scales/getAllChannels";

const liveChannels = [
    '664579',
    '667886',
    '688388',
    '668290',
    '666426',
    '666644',
    '666620',
]

export const Inventory = () => {
    const [allScales, setAllScales] = useState();
    const [allChannels, setAllChannels] = useState();
    const [loadingChannels, setLoadingChannles] = useState(true);
    let activeChannels = []

    const fetchData = async () => {
        try {
            const scales = await getAllScales();
            setAllScales(scales)

            const channels = await getAllChannels();
            let channelArray = channels.split("\n")
            let newChannelArray = [...new Set(channelArray.map((channel) => channel.slice(0,6)))]
            
            console.log(newChannelArray)
            
            liveChannels.forEach(e => { 
                if (newChannelArray.includes(e)) {
                    console.log(e, 'true')
                    activeChannels.push({'channel': e, 'active': 'true'})
                } else {
                    console.log(e, 'false')
                    activeChannels.push({'channel': e, 'active': 'false'})
                }
            });
            setAllChannels(activeChannels);
            setLoadingChannles(false)
            console.log(activeChannels)
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
                            {allChannels.map((channel, i) => <li key={i}>{channel.channel} // {channel.active}</li>)}
                        </ul>
                    ) : <p>No Channels</p>
                
            }
        </>
        
    )
}