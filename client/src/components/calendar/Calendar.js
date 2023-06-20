import { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';

import './calendar.css';

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

export const Calendar = () => {
    const [config, setConfig] = useState({
        viewType: 'WorkWeek',
        headerDateFormat: 'dddd MMMM dd',
        durationBarVisible: false,
        businessBeginsHour: 5,
        businessEndsHour: 16,
        // timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: async (args) => {
            const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
            const dp = args.control;
            dp.clearSelection();
            if (modal.canceled) { return; }
            dp.events.add({
                start: args.start,
                end: args.end,
                id: DayPilot.guid(),
                text: modal.result
            });
        },
        eventMoveHandling: "Update",
        onEventMoved: (args) => {
            console.log("Event moved: " + args.e.text());
        },
        eventResizeHandling: "Update",
        onEventResized: (args) => {
            console.log("Event resized: " + args.e.text());
        },
        eventClickHandling: "Disabled",
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

    useEffect(() => {
        calendarRef.current.control.update({
            events: [
                {
                    id: 1,
                    text: "Event 1",
                    start: "2023-06-20T10:30:00",
                    end: "2023-06-20T13:00:00"
                },
                {
                    id: 2,
                    text: "Event 2",
                    start: "2023-06-21T09:30:00",
                    end: "2023-06-21T11:30:00",
                    backColor: "#6aa84f"
                },
                {
                    id: 3,
                    text: "Event 3",
                    start: "2023-06-19T12:00:00",
                    end: "2023-06-19T15:00:00",
                    backColor: "#f1c232"
                },
                {
                    id: 4,
                    text: "Event 4",
                    start: "2023-06-21T11:30:00",
                    end: "2023-06-21T14:30:00",
                    backColor: "#cc4125"
                },
            ]
        });
    }, []);

    return (
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
    )
}