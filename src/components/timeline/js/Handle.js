import React from 'react'
import {format} from "date-fns";

export const Handle = ({domain: [min, max], handle: {id, value, percent = 0}, getHandleProps,}) => {
    const leftPositionStyle = {
        left: `${percent}%`,
    };
    const currentValueStyle = {
        fontSize: 10,
        marginTop: -25,
        marginLeft: -15
    };

    const formatTime = (ms) => {
        const time = new Date(ms);
        if (!time.getHours()) {
            return format(time, 'mm:ss');
        } else if (time.getHours() <= 9) {
            return format(time, 'H:mm:ss');
        }
        return format(time, 'HH:mm:ss');
    };

    return (
        <>
            {value > min + 1000 && value < max - 1000 &&
            <>
                <div
                    className='react_time_range__handle_wrapper'
                    style={leftPositionStyle}
                    {...getHandleProps(id)}
                >
                    <div style={currentValueStyle}>
                        {formatTime(value)}
                    </div>
                </div>
                <div
                    role='slider'
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    className={`react_time_range__handle_container`}
                    style={leftPositionStyle}
                >
                    <div className={`react_time_range__handle_marker`}/>
                </div>
            </>
            }
        </>
    );
};

export default Handle;
