import { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';

import './calendar.css';
import getAllOrders from '../../services/shipping/getAllOrders';
import updateTimes from '../../services/shipping/updateTimes';

const styles = {
    wrap: {
        display: 'flex'
    },
    left: {
        marginRight: '10px',
    },
    main: {
        flexGrow: '1'
    }
};

let eventData = [];

export const Calendar = () => {
    const [loading, setLoading] = useState(true);
    const [searchedShip, setSearchedShip] = useState([]);
    const [events, setEvents] = useState([]);

    const [config, setConfig] = useState({
        viewType: 'WorkWeek',
        headerDateFormat: 'dddd MMMM dd',
        durationBarVisible: false,
        businessBeginsHour: 5,
        businessEndsHour: 16,
        // timeRangeSelectedHandling: "Enabled",
        // onTimeRangeSelected: async (args) => {
        //     const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        //     const dp = args.control;
        //     dp.clearSelection();
        //     if (modal.canceled) { return; }
        //     dp.events.add({
        //         start: args.start,
        //         end: args.end,
        //         id: DayPilot.guid(),
        //         text: modal.result
        //     });
        // },
        eventMoveHandling: "Update",
        onEventMoved: (args) => {
            console.log("Event moved: " + args.e.text());
            handleUpdateTimes(args)
        },
        eventResizeHandling: "Update",
        onEventResized: (args) => {
            console.log("Event resized: " + args.e.text());
            handleUpdateTimes(args)
        },
        // eventClickHandling: "Disabled",
        // eventClickHandling: "ContextMenu",
        // contextMenu: new DayPilot.Menu({
        //     items: [
        //         { 
        //             text: "Delete", 
        //             onClick: (args) => { 
        //                 const dp = args.source.calendar; 
        //                 dp.events.remove(args.source); 
        //             } 
        //         }
        //     ]
        //   }),
    });

    const calendarRef = useRef();

    const handleTimeRangeSelected = args => {
        calendarRef.current.control.update({
            startDate: args.day
        });
    }

    const handleUpdateTimes = (args) => {
        updateTimes(args.e.data.id, args.newStart.value, args.newEnd.value);
    }

    const fetchData = () => {
        try {
            getAllOrders()
            .then((res) => {
                let shipData = res.data;
                let color;
                let endTime;
                
                for (let i=0; i < shipData.length; i++) {
                    if (shipData[i].date) {
                        if (shipData[i].done) {
                            color = '#808080'
                        } else {
                            if (shipData[i].priority == '4 - Urgent') {
                                color = '#cc4125'
                            } else if (shipData[i].priority == '3 - High') {
                                color = '#ff5f15'
                            } else if (shipData[i].priority == '2 - Medium') {
                                color = '#f1c232'
                            } else {
                                color = '#0000ff'
                            }
                        }

                        if (shipData[i].timeFinish) {
                            endTime = shipData[i].timeFinish;
                        } else {
                            endTime = shipData[i].date;
                        }

                        eventData.push({
                            id: shipData[i].id,
                            text: `${shipData[i].customer} (${shipData[i].location})`,
                            start: shipData[i].date,
                            end: endTime,
                            backColor: color,
                        })
                    }
                }
                setEvents(eventData);
                setLoading(false)
                hitMe(eventData)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const hitMe = (events) => {
        calendarRef.current.control.update({
            events
        });
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        loading ? 
            <h2>Loading</h2>
        :
        <div className="m-3">
            <div style={styles.wrap}>
                <div style={styles.left}>
                    <DayPilotNavigator 
                        selectMode={'Week'}
                        showMonths={2}
                        skipMonths={2}
                        onTimeRangeSelected={handleTimeRangeSelected}
                    />
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar 
                        {...config} 
                        ref={calendarRef} 
                    />
                </div>
            </div>
            {searchedShip.map((item, index) => {
                return (
                    <h3 key={index}>{item.jobNo}</h3>
                )
            })}
        </div>
    )
}