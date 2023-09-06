import React from 'react';

export const SliderRail = ({getRailProps}) => (
    <div>
        <div className='react_time_range__rail__outer' {...getRailProps()} />
        <div className='react_time_range__rail__inner'/>
    </div>
);

export default SliderRail;
