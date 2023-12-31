import TextFilter from './src/components/text';
import SelectFilter from './src/components/select';
import MultiSelectFilter from './src/components/multiselect';
import NumberFilter from './src/components/number';
import DateFilter from './src/components/date';
import TimeFilter from './src/components/time'
import createContext from './src/context';
import * as Comparison from './src/comparison';
import { FILTER_TYPE } from './src/const';

export default (options = {}) => ({
  createContext,
  options
});

export const FILTER_TYPES = FILTER_TYPE;

export const Comparator = Comparison;

export const textFilter = (props = {}) => ({
  Filter: TextFilter,
  props
});

export const selectFilter = (props = {}) => ({
  Filter: SelectFilter,
  props
});

export const multiSelectFilter = (props = {}) => ({
  Filter: MultiSelectFilter,
  props
});

export const numberFilter = (props = {}) => ({
  Filter: NumberFilter,
  props
});

export const dateFilter = (props = {}) => ({
  Filter: DateFilter,
  props
});

export const customFilter = (props = {}) => ({
  props
});

export const timeFilter = (props = {}) => ({
  Filter: TimeFilter,
  props
});
