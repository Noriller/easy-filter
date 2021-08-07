export interface ParsedPart {
  payload: string;
  mode: BaseTypes;
  childs?: ParsedPart[];
}

export type BaseTypes =
  | 'NOT'
  | 'OPTION'
  | 'QUOTE'
  | 'TAG'
  | 'RANGE'
  | 'DATE_RANGE'
  | 'OR';

export type AllTypes = BaseTypes | 'INITIAL';

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedRange extends ParsedPart {
  range: RangePayload | DateRangePayload;
}

export interface ParsedTag extends ParsedPart {
  tag: string;
}

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];

export interface FilterOptions {
  dateFormat?: DateFormat;
}

export type DateFormat =
  | 'YYYY-MM-DD'
  | 'DD-MM-YYYY'
  | 'MM-DD-YYYY'
  | 'YYYY-DD-MM';
