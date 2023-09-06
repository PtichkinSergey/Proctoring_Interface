/* eslint react/require-default-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint no-return-assign: 0 */
/* eslint prefer-template: 0 */
import { TimePicker , Form, Button} from "antd";
import React, { Component,  useState} from "react";
import { PropTypes } from "prop-types";
import moment from "moment"
import * as Comparator from "../comparison";
import { FILTER_TYPE } from "../const";
import "antd/dist/antd.css";
import "bootstrap-daterangepicker/daterangepicker.css";

let isLT = false;

const legalComparators = [
  Comparator.EQ,
  Comparator.NE,
  Comparator.GT,
  Comparator.GE,
  Comparator.LT,
  Comparator.LE,
  Comparator.FT
];

function dateParser(d) {
  d = new Date(d);
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

class TimeFilter extends Component {
    
  constructor(props) {
    super(props);
    this.timeout = null;
    this.comparators = props.comparators || legalComparators;
    this.applyFilter = this.applyFilter.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeComparator = this.onChangeComparator.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.timeRangePicker = this.createTimeRange();
  }
  formRef = React.createRef();

  componentDidMount() {
    const { getFilter } = this.props;
    
    const comparator = this.dateFilterComparator.value;
    const date = this.inputDate.value;
    if (comparator && date) {
      this.applyFilter(date, comparator, true);
    }

    // export onFilter function to allow users to access
    if (getFilter) {
      getFilter((filterVal) => {
        const nullableFilterVal = filterVal || { date: '', comparator: '' };
        this.dateFilterComparator.value = nullableFilterVal.comparator;
        this.inputDate.value = nullableFilterVal.date ? dateParser(nullableFilterVal.date) : '';

        this.applyFilter(nullableFilterVal.date, nullableFilterVal.comparator);
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  onChangeDate(e) {
    const comparator = this.dateFilterComparator.value;
    const filterValue = e.target.value;
    this.applyFilter(filterValue, comparator);
  }

  onChangeComparator(e) {
    const {filterState} = this.props;
    let value = '';
    if (filterState && filterState.filterVal && filterState.filterVal.date) {
      value = filterState.filterVal.date;
    }
    const comparator = e.target.value;
    if (comparator === '>= <='){
      isLT = true;
    } else{
      isLT = false;
    }
    this.applyFilter(value, comparator);
  }

  getComparatorOptions() {
    const optionTags = [];
    const { withoutEmptyComparatorOption } = this.props;
    if (!withoutEmptyComparatorOption) {
      optionTags.push(<option key="-1" />);
    }
    for (let i = 0; i < this.comparators.length; i += 1) {
      optionTags.push(
        <option key={ i } value={ this.comparators[i] }>
          { this.comparators[i] }
        </option>
      );
    }
    return optionTags;
  }

  getDefaultComparator() {
    const { defaultValue, filterState } = this.props;
    if (filterState && filterState.filterVal) {
      return filterState.filterVal.comparator;
    }
    if (defaultValue && defaultValue.comparator) {
      return defaultValue.comparator;
    }
    return '';
  }

  getDefaultDate() {
    // Set the appropriate format for the input type=date, i.e. "YYYY-MM-DD"
    const { defaultValue, filterState } = this.props;
    if (filterState && filterState.filterVal && filterState.filterVal.date) {
      if(filterState.filterVal.queryTime){
        this.applyFilter(filterState.filterVal.date, filterState.filterVal.comparator);
      }
      return moment(dateParser(filterState.filterVal.date),"HH:mm:ss");
    }
    if (defaultValue && defaultValue.date) {
      return moment(dateParser(new Date(defaultValue.date), "HH:mm:ss"));
    }
    return '';
  }

  onSelect(time) {
    const comparator = this.dateFilterComparator.value;
    const filterValue = time._d;
    this.applyFilter(filterValue, comparator);
  }

  onChange(time){
    console.log(time);
    const comparator = this.dateFilterComparator.value;
    const filterValue = time;
    this.applyFilter(filterValue, comparator);
  }

  
  
  

  applyFilter(value, comparator, isInitial) {
    // if (!comparator || !value) {
    //  return;
    // }
    const { column, onFilter, delay } = this.props;
    const execute = () => {
      // Incoming value should always be a string, and the defaultDate
      // above is implemented as an empty string, so we can just check for that.
      // instead of parsing an invalid Date. The filter function will interpret
      // null as an empty date field
      const date = value; //=== '' ? null : new Date(value);
      onFilter(column, FILTER_TYPE.TIME, isInitial)({ date, comparator });
    };
    if (delay) {
      this.timeout = setTimeout(() => { execute(); }, delay);
    } else {
      execute();
    }
  }

  applyQueryFilter(){
    const{filterState} = this.props;
    if(filterState && filterState.filterVal && filterState.filterVal.date){

      let queryComplete = {startTime: filterState.filterVal.date.startTime, endTime: filterState.filterVal.date.endTime};
      this.applyFilter(queryComplete, filterState.filterVal.comparator);
    }
  }

  createTimeRange(){
    this.applyQueryFilter();
    return (<TimePicker.RangePicker onChange={this.onChange} ref={ n => this.inputDate = n }/>);
  }

  render() {
    const {
      id,
      placeholder,
      column: { dataField, text },
      style,
      comparatorStyle,
      dateStyle,
      className,
      comparatorClassName,
      dateClassName
    } = this.props;

    const comparatorElmId = `date-filter-comparator-${dataField}${id ? `-${id}` : ''}`;
    const inputElmId = `date-filter-column-${dataField}${id ? `-${id}` : ''}`;
    return (
      <div
        onClick={ e => e.stopPropagation() }
        className={ `filter date-filter ${className}` }
        style={ style }
      >
        <label
          className="filter-label"
          htmlFor={ comparatorElmId }
        >
          <span className="sr-only">Filter comparator</span>
          <select
            ref={ n => this.dateFilterComparator = n }
            id={ comparatorElmId }
            style={ comparatorStyle }
            className={ `date-filter-comparator form-control ${comparatorClassName}` }
            onChange={ this.onChangeComparator }
            defaultValue={ this.getDefaultComparator() }
          >
            { this.getComparatorOptions() }
          </select>
        </label>
        <Form ref={this.formRef}>
        { !isLT &&
          <Form.Item name="time">
            <TimePicker onSelect={this.onSelect} ref={ n => this.inputDate = n } defaultValue={this.getDefaultDate()}/>
          </Form.Item>
        }
        { isLT &&
        <Form.Item name="timeLT">
          {this.timeRangePicker}
        </Form.Item>
        }
        </Form>
      </div>
    );
  }
}

TimeFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
  id: PropTypes.string,
  filterState: PropTypes.object,
  delay: PropTypes.number,
  defaultValue: PropTypes.shape({
    date: PropTypes.oneOfType([PropTypes.object]),
    comparator: PropTypes.oneOf([...legalComparators, ''])
  }),
  /* eslint consistent-return: 0 */
  comparators: (props, propName) => {
    if (!props[propName]) {
      return;
    }
    for (let i = 0; i < props[propName].length; i += 1) {
      let comparatorIsValid = false;
      for (let j = 0; j < legalComparators.length; j += 1) {
        if (legalComparators[j] === props[propName][i] || props[propName][i] === '') {
          comparatorIsValid = true;
          break;
        }
      }
      if (!comparatorIsValid) {
        return new Error(`Date comparator provided is not supported.
          Use only ${legalComparators}`);
      }
    }
  },
  placeholder: PropTypes.string,
  withoutEmptyComparatorOption: PropTypes.bool,
  style: PropTypes.object,
  comparatorStyle: PropTypes.object,
  dateStyle: PropTypes.object,
  className: PropTypes.string,
  comparatorClassName: PropTypes.string,
  dateClassName: PropTypes.string,
  getFilter: PropTypes.func
};

TimeFilter.defaultProps = {
  delay: 0,
  defaultValue: {
    date: undefined,
    comparator: ''
  },
  filterState: {},
  withoutEmptyComparatorOption: false,
  comparators: legalComparators,
  placeholder: undefined,
  style: undefined,
  className: '',
  comparatorStyle: undefined,
  comparatorClassName: '',
  dateStyle: undefined,
  dateClassName: '',
  id: null
};


export default TimeFilter;
