/* eslint eqeqeq: 0 */
/* eslint no-console: 0 */
import { FILTER_TYPE } from './const';
import { LIKE, EQ, NE, GT, GE, LT, LE, FT } from './comparison';
import filter from '..';
import {useState} from 'react';
import { refreshQueryString } from '../../../components/studentslist/StudentsTable';

export const filterByText = _ => (
  data,
  dataField,
  { filterVal: userInput = '', comparator = LIKE, caseSensitive },
  customFilterValue
) => {
  // make sure filter value to be a string
  const filterVal = userInput.toString();

  return (
    data.filter((row) => {
      let cell = _.get(row, dataField);
      if (customFilterValue) {
        cell = customFilterValue(cell, row);
      }
      const cellStr = _.isDefined(cell) ? cell.toString() : '';
      if (comparator === EQ) {
        return cellStr === filterVal;
      }
      if (caseSensitive) {
        return cellStr.includes(filterVal);
      }

      return cellStr.toLocaleUpperCase().indexOf(filterVal.toLocaleUpperCase()) !== -1;
    })
  );
};

export const filterByTime = _ => (
  data,
  dataField,
  { filterVal: { comparator, date } },
  customFilterValue
) => {
  if (!date || !comparator) return data;
  return data.filter((row) => {
    let valid = true;
    let cell = _.get(row, dataField);
    if (customFilterValue) {
      cell = customFilterValue(cell, row);
    }

    if (typeof cell !== 'object') {
      cell = new Date(cell);
    }

    const targetHour = cell.getHours();
    const targetMin = cell.getMinutes();
    const targetSec = cell.getSeconds();
    
    switch (comparator) {
      case EQ: {
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (
          filterHour !== targetHour ||
          filterMin !== targetMin ||
          filterSec !== targetSec
        ) {
          valid = false;
        }
        break;
      }
      case NE:{
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (
          filterHour === targetHour &&
          filterMin === targetMin &&
          filterSec === targetSec
        ) {
          valid = false;
        }
        break;
      }
      case GT:{
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (filterHour > targetHour){
          valid = false;
        } 
        if (filterHour === targetHour){
          if (filterMin > targetMin){
            valid = false;
          }
          if (filterMin === targetMin){
            if (filterSec >= targetSec){
              valid = false;
            } 

          }
        }
        break;
      }
      case GE:{
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (filterHour > targetHour){
          valid = false;
        } 
        if (filterHour === targetHour){
          if (filterMin > targetMin){
            valid = false;
          }
          if (filterMin === targetMin){
            if (filterSec > targetSec){
              valid = false;
            } 

          }
        }
        break;
      }case LT:{
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (filterHour < targetHour){
          valid = false;
        } 
        if (filterHour === targetHour){
          if (filterMin < targetMin){
            valid = false;
          }
          if (filterMin === targetMin){
            if (filterSec <= targetSec){
              valid = false;
            } 

          }
        }
        break;
      }
      case LE:{
        date = date === '' ? null : new Date(date);
        const filterHour = date.getHours();
        const filterMin = date.getMinutes();
        const filterSec = date.getSeconds();
        if (filterHour < targetHour){
          valid = false;
        } 
        if (filterHour === targetHour){
          if (filterMin < targetMin){
            valid = false;
          }
          if (filterMin === targetMin){
            if (filterSec < targetSec){
              valid = false;
            } 

          }
        }
        break;
      }
      case FT:{
        console.log(date);
        let startDate = new Date();
        let endDate = new Date();
        if(date[0]){
          startDate = date[0]._d === '' ? null : new Date( date[0]._d);
          endDate = date[1]._d === '' ? null : new Date(date[1]._d);
        }else{
          startDate = date.startTime === '' ? null : new Date(date.startTime);
          endDate = date.endTime === '' ? null : new Date(date.endTime);
        }

        const x1 = startDate.getHours();
        const y1 = startDate.getMinutes();
        const z1 = startDate.getSeconds();
        const x2 = endDate.getHours();
        const y2 = endDate.getMinutes();
        const z2 = endDate.getSeconds();
        const x = targetHour;
        const y = targetMin;
        const z = targetSec;
        
        //console.log("Year",x1, x, x2);
        //console.log("Month",y1, y, y2);
        //console.log("date", z1, z, z2);
        if (x1 === x && x === x2){
          if (y1 === y && y === y2){
            if (z1 <= z && z <= z2){
            } else{
              valid = false;
            }
          } else{
            if (y1 === y && y < y2){
              if (z1 > z){
                valid = false;
              } 
            } else{
              if (y1 < y && y === y2){
                if (z > z2){
                  valid = false;
                } 
              } else {
                if (y1 < y && y < y2){
                  
                } else{
                  if (y1 > y || y > y2){
                    
                    valid = false;
                  }
                }
              }
            }
          }
        } else{
          if (x1 === x && x < x2){
            if (y1 > y){
              valid = false;
            } else{
              if (y1 === y){
                if (z1 > z){
                  valid = false;
                }
              }
            }
          } else{
            if (x1 < x && x === x2){
              if (y > y2){
                valid = false;
              } else{
                if (y2 === y){
                  if (z > z2){
                    valid = false;
                  }
                }
              }
            } else {
              if (x1 < x && x < x2){
                
              } else{
                if (x1 > x || x > x2){
                  
                  valid = false;
                }
              }
            }
          }
        }

              
        break;
      }
      default: {
        console.error('Date comparator provided is not supported');
        break;
      }
    }
        return valid;
  })
};


export const filterByNumber = _ => (
  data,
  dataField,
  { filterVal: { comparator, number } },
  customFilterValue
) => (
  data.filter((row) => {
    if (number === '' || !comparator) return true;
    let cell = _.get(row, dataField);

    if (customFilterValue) {
      cell = customFilterValue(cell, row);
    }

    switch (comparator) {
      case EQ: {
        return cell == number;
      }
      case GT: {
        return cell > number;
      }
      case GE: {
        return cell >= number;
      }
      case LT: {
        return cell < number;
      }
      case LE: {
        return cell <= number;
      }
      case NE: {
        return cell != number;
      }
      default: {
        console.error('Number comparator provided is not supported');
        return true;
      }
    }
  })
);

export const filterByDate = _ => (
  data,
  dataField,
  { filterVal: { comparator, date } },
  customFilterValue
) => {
  {
  if (!date || !comparator) return data;
  

  return data.filter((row) => {
    let valid = true;
    let cell = _.get(row, dataField);

    if (customFilterValue) {
      cell = customFilterValue(cell, row);
    }

    if (typeof cell !== 'object') {
      cell = new Date(cell);
    }

    const targetDate = cell.getUTCDate();
    const targetMonth = cell.getUTCMonth();
    const targetYear = cell.getUTCFullYear();


    switch (comparator) {
      case EQ: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (
          filterDate !== targetDate ||
          filterMonth !== targetMonth ||
          filterYear !== targetYear
        ) {
          valid = false;
        }
        break;
      }
      case GT: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (cell < date) {
          valid = false;
        }
        if (
          filterDate === targetDate &&
          filterMonth === targetMonth &&
          filterYear === targetYear
        ) {
          valid = false;
        }
        break;
      }
      case GE: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (targetYear < filterYear) {
          valid = false;
        } else if (targetYear === filterYear &&
          targetMonth < filterMonth) {
          valid = false;
        } else if (targetYear === filterYear &&
          targetMonth === filterMonth &&
          targetDate < filterDate) {
          valid = false;
        }
        break;
      }
      case LT: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (cell >= date) {
          valid = false;
        }
        break;
      }
      case LE: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (targetYear > filterYear) {
          valid = false;
        } else if (targetYear === filterYear &&
          targetMonth > filterMonth) {
          valid = false;
        } else if (targetYear === filterYear &&
          targetMonth === filterMonth &&
          targetDate > filterDate) {
          valid = false;
        }
        break;
      }
      case NE: {
        date = date === '' ? null : new Date(date);
        const filterDate = date.getUTCDate();
        const filterMonth = date.getUTCMonth();
        const filterYear = date.getUTCFullYear();
        if (
          filterDate === targetDate &&
          filterMonth === targetMonth &&
          filterYear === targetYear
        ) {
          valid = false;
        }
        break;
      }
      case FT: {
        let startDate = new Date();
        let endDate = new Date();
        if(date.startDate._d){
          startDate = date.startDate._d === '' ? null : new Date(date.startDate._d);
          endDate = date.endDate._d === '' ? null : new Date(date.endDate._d);
        }else{
          startDate = date.startDate === '' ? null : new Date(date.startDate);
          endDate = date.endDate === '' ? null : new Date(date.endDate);
        }

        let filterDateStart = startDate.getUTCDate();
        let filterMonthStart = startDate.getUTCMonth();
        const filterYearStart = startDate.getUTCFullYear();
        const filterDateEnd = endDate.getUTCDate();
        const filterMonthEnd = endDate.getUTCMonth();
        const filterYearEnd = endDate.getUTCFullYear();

        if (filterMonthStart === 0 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 1;
        }
         else if (filterMonthStart === 1 && filterDateStart ===28){
          filterDateStart = 1;
          filterMonthStart = 2;
        }
        else if (filterMonthStart === 2 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 3;
        }
        else if (filterMonthStart === 3 && filterDateStart ===30){
          filterDateStart = 1;
          filterMonthStart = 4;
        }
        else if (filterMonthStart === 4 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 5;
        }
        else if (filterMonthStart === 5 && filterDateStart ===30){
          filterDateStart = 1;
          filterMonthStart = 6;
        }
        else if (filterMonthStart === 6 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 7;
        }
        else if (filterMonthStart === 7 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 8;
        }
        else if (filterMonthStart === 8 && filterDateStart ===30){
          filterDateStart = 1;
          filterMonthStart = 9;
        }
        else if (filterMonthStart === 9 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 10;
        }
        else if (filterMonthStart === 10 && filterDateStart ===30){
          filterDateStart = 1;
          filterMonthStart = 11;
        }
        else if (filterMonthStart === 11 && filterDateStart ===31){
          filterDateStart = 1;
          filterMonthStart = 0;
        } else{
          filterDateStart += 1;
        }
        
        const x = targetYear;
        const y = targetMonth;
        const z = targetDate;
        const x1 = filterYearStart;
        const x2 = filterYearEnd;
        const y1 = filterMonthStart;
        const y2 = filterMonthEnd;
        const z1 = filterDateStart;
        const z2 = filterDateEnd;
        console.log("Year",x1, x, x2);
        //console.log("Month",y1, y, y2);
        //console.log("date", z1, z, z2);
        if (x1 === x && x === x2){
          if (y1 === y && y === y2){
            if (z1 <= z && z <= z2){
            } else{
              valid = false;
            }
          } else{
            if (y1 === y && y < y2){
              if (z1 > z){
                valid = false;
              } 
            } else{
              if (y1 < y && y === y2){
                if (z > z2){
                  valid = false;
                } 
              } else {
                if (y1 < y && y < y2){
                  
                } else{
                  if (y1 > y || y > y2){
                    
                    valid = false;
                  }
                }
              }
            }
          }
        } else{
          if (x1 === x && x < x2){
            if (y1 > y){
              valid = false;
            } else{
              if (y1 === y){
                if (z1 > z){
                  valid = false;
                }
              }
            }
          } else{
            if (x1 < x && x === x2){
              if (y > y2){
                valid = false;
              } else{
                if (y2 === y){
                  if (z > z2){
                    valid = false;
                  }
                }
              }
            } else {
              if (x1 < x && x < x2){
                
              } else{
                if (x1 > x || x > x2){
                  
                  valid = false;
                }
              }
            }
          }
        }
              
        break;
      }
      default: {
        console.error('Date comparator provided is not supported');
        break;
      }
    }
    return valid;
  }); }
};

export const filterByArray = _ => (
  data,
  dataField,
  { filterVal, comparator }
) => {
  if (filterVal.length === 0) return data;
  const refinedFilterVal = filterVal
    .filter(x => _.isDefined(x))
    .map(x => x.toString());
  return data.filter((row) => {
    const cell = _.get(row, dataField);
    let cellStr = _.isDefined(cell) ? cell.toString() : '';
    if (comparator === EQ) {
      return refinedFilterVal.indexOf(cellStr) !== -1;
    }
    cellStr = cellStr.toLocaleUpperCase();
    return refinedFilterVal.some(item => cellStr.indexOf(item.toLocaleUpperCase()) !== -1);
  });
};

export const filterFactory = _ => (filterType) => {
  switch (filterType) {
    case FILTER_TYPE.MULTISELECT:
      return filterByArray(_);
    case FILTER_TYPE.TIME:
      return filterByTime(_);
    case FILTER_TYPE.NUMBER:
      return filterByNumber(_);
    case FILTER_TYPE.DATE:
      return filterByDate(_);
    case FILTER_TYPE.TEXT:
    case FILTER_TYPE.SELECT:
    default:
      // Use `text` filter as default filter
      return filterByText(_);
  }
};

export const filters = (data, columns, _) => (currFilters, clearFilters = {}) => {
  const factory = filterFactory(_);
  const filterState = { ...clearFilters, ...currFilters };
  let result = data;
  let filterFn;
  Object.keys(filterState).forEach((dataField) => {
    let currentResult;
    let filterValue;
    let customFilter;
    for (let i = 0; i < columns.length; i += 1) {
      if (columns[i].dataField === dataField) {
        filterValue = columns[i].filterValue;
        if (columns[i].filter) {
          customFilter = columns[i].filter.props.onFilter;
        }
        break;
      }
    }

    if (clearFilters[dataField] && customFilter) {
      currentResult = customFilter(clearFilters[dataField].filterVal, result);
      if (typeof currentResult !== 'undefined') {
        result = currentResult;
      }
    } else {
      const filterObj = filterState[dataField];
      filterFn = factory(filterObj.filterType);
      if (customFilter) {
        currentResult = customFilter(filterObj.filterVal, result);
      }
      if (typeof currentResult === 'undefined') {
        result = filterFn(result, dataField, filterObj, filterValue);
      } else {
        result = currentResult;
      }
    }
  });

  //after new filter update query string
  refreshQueryString(currFilters);
  return result;
};
