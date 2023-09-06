import React, {Component, createRef} from 'react';

export const CAMERA_SOUND_VIOLATION = "CAMERA_SOUND_VIOLATION";
export const CHEATING_VIOLATION = "CHEATING_VIOLATION";
export const OTHER_VIOLATION = "OTHER_VIOLATION";

class Marker extends Component {
    constructor(props) {
        super(props);
        this.ref = createRef();
        this.state = {
            isSmall: false,
            source: props.source,
            target: props.target,
            violation: props.violation,
            style: {
                left: `${this.props.source.percent}%`,
                width: `calc(${this.props.target.percent - this.props.source.percent}% - 1px)`,
                backgroundColor: this.getBGColor(this.props.violation),
            }
        };
    }

    invokeParentMethod = (event) => {
        this.props.context.componentParent.mouseClickMarkerHandler(this.state, event);
    };

    componentDidMount() {
        if (this.ref.current.offsetWidth <= 12) {
            this.setState({isSmall: true});
        } else {
            this.setState({isSmall: false});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({
                source: this.props.source,
                target: this.props.target,
                style: {
                    left: `${this.props.source.percent}%`,
                    width: `calc(${this.props.target.percent - this.props.source.percent}%)`,
                    backgroundColor: this.getBGColor(this.props.violation),
                }
            }, () => {
                if (this.ref.current.offsetWidth <= 12) {
                    this.setState({isSmall: true});
                } else {
                    this.setState({isSmall: false});
                }
            });
        }
    }

    getBGColor(violation) {
        switch (violation) {
            case CAMERA_SOUND_VIOLATION:
                return 'rgba(255, 0, 0, 0.6)';
            case CHEATING_VIOLATION:
                return 'rgba(0, 64, 255, 0.6)';
            case OTHER_VIOLATION:
                return 'rgba(255, 213, 0, 0.6)';
            default:
                return 'rgba(0, 0, 0, 0)';
        }
    }

    render() {
        return (
            <div
                className={`react_time_range__marker${this.state.isSmall ? '__small' : ''}`}
                style={this.state.style}
                ref={this.ref}
                onClick={this.invokeParentMethod}
            />
        );
    }
}

export default Marker;
