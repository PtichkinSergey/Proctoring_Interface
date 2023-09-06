import React, {Component, createRef} from 'react';
import {scaleTime} from 'd3-scale';
import {Handles, Rail, Slider, Ticks, Tracks} from 'react-compound-slider';
import {endOfToday, format, startOfToday} from 'date-fns';
import SliderRail from './js/SliderRail';
import Track from './js/Track';
import Tick from './js/Tick';
import Handle from './js/Handle';
import './styles/index.scss';
import Marker from "./js/Marker";
import {Overlay, Button, Popover} from "react-bootstrap";
import {HomeIcon, XIcon} from "@primer/octicons-react";
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';

class Timeline extends Component {
    static defaultProps = {
        containerClassName: 'react_time_range__time_range_container',
        selectedInterval: [startOfToday()],
        timelineInterval: [startOfToday(), endOfToday()],
        formatTick: (ms) => {
            let time = new Date(ms);
            if (!time.getHours()) {
                return format(time, 'mm:ss');
            } else if (time.getHours() <= 9) {
                return format(time, 'H:mm:ss');
            }
            return format(time, 'HH:mm:ss');
        },
        step: 1000,
        ticksNumber: 60,
        dispersion: 0.01,
        markers: [],
    };

    constructor(props) {
        super(props);
        this.containerRef = createRef();
        this.sliderRef = createRef();
        this.state = {
            dispersion: props.dispersion,
            activeMarkers: [],
            tooltipRef: null,
            isShowTooltip: false,
            markers: [],
            ticksNumber: props.ticksNumber,
            timelineInterval: props.timelineInterval,
            selectedInterval: props.selectedInterval,
            setViolation: props.setViolation,
            context: {
                componentParent: this
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                selectedInterval: [this.props.value]
            });
        }
    }

    componentDidMount() {
        this.setState({
            ticksNumber: Math.round(this.containerRef.current.offsetWidth / 65),
            markers: this.getMarkers(this.props.markers)
            
        });
        
        console.log(this.props.markers);
        window.addEventListener('resize', () => {
            this.setState({ticksNumber: Math.round(this.containerRef.current.offsetWidth / 65)});
        });
    }

    getDateTicks = () => {
        return scaleTime()
            .domain(this.state.timelineInterval)
            .ticks(this.state.ticksNumber)
            .map(t => +t);
    };

    getPercentOfInterval = (value) => {
        const begin = this.state.timelineInterval[0].getTime();
        const end = this.state.timelineInterval[1].getTime();

        let newValue = (value - begin) * 100 / (end - begin);
        if (newValue > 100) {
            return 100;
        } else if (newValue < 0) {
            return 0;
        }
        return newValue
    };

    getMarkers = (markers) => {
        for (let marker of markers) {
            marker.ref = (marker.ref ? marker.ref : createRef());
            marker.source.percent = this.getPercentOfInterval(marker.source.value.getTime());
            marker.target.percent = this.getPercentOfInterval(marker.target.value.getTime());
        }

        return markers;
    };

    hideHandler = () => {
        this.setState({isShowTooltip: false});
    };

    getPopoverMessage = (violation) => {
        return violation;
    };

    goToTime = (time) => {
        this.setState({selectedInterval: [new Date(time)]});
        this.props.setViolation((time - this.props.timelineInterval[0].getTime()) / 1000);
    };

    mouseClickMarkerHandler = (marker, event) => {
        const begin = this.state.timelineInterval[0].getTime();
        const end = this.state.timelineInterval[1].getTime();

        const dispersion = (end - begin) * this.state.dispersion;
        const currValue = this.sliderRef.getEventData(event).value - begin;
        let activeMarkers = [];
        for (let item of this.state.markers) {
            if ((item.source.value.getTime() - begin - dispersion <= currValue &&
                item.target.value.getTime() - begin + dispersion >= currValue) ||
                (item.target.value.getTime() <= begin && currValue - dispersion <= 0) ||
                (item.source.value.getTime() > end && currValue + dispersion >= end - begin)) {
                this.setState({
                    isShowTooltip: true,
                    tooltipRef: item.ref.current.ref
                });
                activeMarkers.push(item);
            }
        }
        this.setState({activeMarkers});
    };

    setDefaultTimeline = () => {
        this.setState({
            timelineInterval: this.props.timelineInterval
        }, () => {
            this.setState({markers: this.getMarkers(this.state.markers)});
        });
    };

    onWheel = (event) => {
        const begin = this.state.timelineInterval[0].getTime();
        const end = this.state.timelineInterval[1].getTime();
        const currValue = this.sliderRef.getEventData(event).value - begin;
        const scaleFactor = currValue / (end - begin);
        const STEP = 1000;
        const MIN_VALUE = 30 * 1000;

        let newBegin = new Date(begin - event.deltaY * STEP * scaleFactor);
        let newEnd = new Date(end + event.deltaY * STEP * (1 - scaleFactor));
        if (newEnd.getTime() - newBegin.getTime() >= MIN_VALUE) {
            if (newEnd.getTime() >= this.props.timelineInterval[1].getTime()) {
                newEnd = this.props.timelineInterval[1];
            }
            if (newBegin.getTime() <= this.props.timelineInterval[0].getTime()) {
                newBegin = this.props.timelineInterval[0];
            }

            this.setState({
                timelineInterval: [newBegin, newEnd]
            }, () => {
                this.setState({markers: this.getMarkers(this.state.markers)});
            });
        }
    };

    onMouseEnter = () => {
        disableBodyScroll(this, {reserveScrollBarGap: true});
    };

    onMouseLeave = () => {
        enableBodyScroll(this, {reserveScrollBarGap: true});
    };

    componentWillUnmount() {
        clearAllBodyScrollLocks();
    }

    render() {
        return (
            <>
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    onWheel={this.onWheel}
                    ref={this.containerRef}
                    className={this.props.containerClassName}
                >
                    <Slider
                        ref={input => this.sliderRef = input}
                        mode={current => current}
                        step={this.props.step}
                        domain={this.state.timelineInterval.map(t => Number(t))}
                        values={this.state.selectedInterval.map(t => +t)}
                        className={'react_time_range_root'}
                    >
                        <Rail>
                            {({getRailProps}) =>
                                <SliderRail
                                    className={'react_time_range__rail'}
                                    getRailProps={getRailProps}
                                />}
                        </Rail>
                        <Handles>
                            {({handles, getHandleProps}) => (
                                <>
                                    {handles.map(handle => (
                                        <Handle
                                            key={handle.id}
                                            handle={handle}
                                            domain={this.state.timelineInterval.map(t => Number(t))}
                                            getHandleProps={getHandleProps}
                                        />
                                    ))}
                                </>
                            )}
                        </Handles>
                        <Tracks right={false}>
                            {({tracks, getTrackProps}) => (
                                <>
                                    {tracks?.map(({id, source, target}) =>
                                        <Track
                                            key={id}
                                            source={source}
                                            target={target}
                                            getTrackProps={getTrackProps}
                                        />
                                    )}
                                </>
                            )}
                        </Tracks>
                        <Ticks values={this.getDateTicks()}>
                            {({ticks}) => (
                                <>
                                    {ticks.map(tick => (
                                        <Tick
                                            key={tick.id}
                                            tick={tick}
                                            count={ticks.length}
                                            format={this.props.formatTick}
                                        />
                                    ))}
                                </>
                            )}
                        </Ticks>
                        <>
                            {this.state.markers.map(({ref, source, target, violation}) =>
                                <Marker
                                    ref={ref}
                                    source={source}
                                    target={target}
                                    violation={violation}
                                    context={this.state.context}
                                />
                            )}
                        </>
                    </Slider>
                    <Button
                        onClick={this.setDefaultTimeline}
                        variant="outline-dark"
                        className="btn-sm react_time_range__button"
                    >
                        <HomeIcon size={16}/>
                    </Button>
                </div>
                <Overlay
                    target={this.state.tooltipRef ? this.state.tooltipRef.current : null}
                    show={this.state.isShowTooltip}
                    placement={'top'}
                >
                    <Popover
                        id={'main-tooltip'}
                        className={'react_time_range__overlay_container'}
                    >
                        <div className={'react_time_range__overlay'}>
                            <Button
                                onClick={this.hideHandler}
                                variant="outline-dark"
                                className="btn-sm react_time_range__button mr-2"
                            >
                                <XIcon size={16}/>
                            </Button>
                            {this.state.activeMarkers.map(({source, target, violation,currentViolation}) =>
                                <>
                                    <Popover.Title as="h3">
                                        Нарушение
                                    </Popover.Title>
                                    <Popover.Content>
                                        <div>
                                            Время:
                                            <Button
                                                onClick={() => this.goToTime(source.value)}
                                                variant={"link"}
                                                size={"sm"}
                                            >
                                                {format(source.value, "HH:mm:ss")}
                                            </Button>
                                            -
                                            <Button
                                                onClick={() => this.goToTime(target.value)}
                                                variant={"link"}
                                                size={"sm"}
                                            >
                                                {format(target.value, "HH:mm:ss")}
                                            </Button>
                                        </div>
                                        Студент нарушил правила:
                                        <strong>"{this.getPopoverMessage(currentViolation)}"</strong>!
                                    </Popover.Content>
                                </>
                            )}
                        </div>
                    </Popover>
                </Overlay>
            </>
        );
    }
}

export default Timeline;
