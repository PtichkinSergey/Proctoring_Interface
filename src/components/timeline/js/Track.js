import React from 'react';

const getTrackConfig = ({source, target}) => {
    const basicStyle = {
        left: `${source.percent}%`,
        width: `calc(${target.percent - source.percent}% - 1px)`,
    };

    const coloredTrackStyle = {
        backgroundColor: 'rgba(98, 203, 102, 0.5)',
        borderLeft: '1px solid #62CB66',
        borderRight: '1px solid #62CB66',
    };

    return {...basicStyle, ...coloredTrackStyle};
};

const Track = ({source, target, getTrackProps}) => (
    <div
        className={`react_time_range__track`}
        style={getTrackConfig({source, target})}
        {...getTrackProps()}
    />
);

export default Track;
