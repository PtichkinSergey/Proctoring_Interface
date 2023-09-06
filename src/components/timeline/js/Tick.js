import React from 'react'

const Tick = ({tick, count, format}) => {
    const tickLabelStyle = {
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
    };
    const tickMarkerStyle = {
        left: `${tick.percent}%`,
    };

    return (
        <>
            <div
                className={`react_time_range__tick_marker`}
                style={tickMarkerStyle}
            />
            <div
                className='react_time_range__tick_label'
                style={tickLabelStyle}
            >
                {format(tick.value)}
            </div>
        </>
    );
};

Tick.defaultProps = {format: d => d};

export default Tick;
