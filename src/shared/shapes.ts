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
  | 'TAG_NULL'
  | 'RANGE'
  | 'DATE_RANGE'
  | 'OR';

export type AllTypes = BaseTypes | 'INITIAL';

export interface ParsedResult {
  search: string;
  parsedSearch: ParsedPart[];
}

export interface ParsedOptions {
  search: string;
  parsedOptions: FilterOptions;
}

export interface ParsedRange extends ParsedPart {
  range: RangePayload | DateRangePayload;
}

export interface ParsedTag extends ParsedPart {
  tag: string;
  aliases?: TagAliases;
}

export type RangePayload = [number, number];
export type DateRangePayload = [Date, Date];

/**
 * The Optional Parameter are used to specify
 * the default behaviors that should be used.
 *
 * @remarks
 * Should be used, specially to define instantiation only options.
 */
export interface OptionalParameters {
  /**
   * The default modifiers that will change the return of EasyFilter.
   * @param dateFormat - a string that represents how the date is represented in your source array. If not provided, will use the default parsing of Javascript.
   * @param normalize - if diacritics, if present, should be ignored or not. Defaults to false.
   * @param limit - how many items should be returned. Defaults to the length of the source.
   * @param indexing - if an indexing key should be added to the returned objects. Defaults to false.
   *
   * @remarks
   * If `indexing` is `false`, the returned objects will be a reference to the original source.
   *
   * If `indexing` is `true`, the returned objects will be a copy from the original source with a new attribute `_EasyFilterIndex`
   */
  filterOptions?: SetupOptions;
  /**
   * A dictionary of key/value pairs.
   *
   * @remarks
   * This option can't be later overriden or passed.
   *
   * @param {string} key - string that will be used in tags
   * @param {string[]} value - string array that represents the actual source tags
   *
   * @remarks
   * This is used to give consumers of search a easier access to object names that might not be user friendly names.
   *
   * @example
   * ```js
   * {
   *  example: ["dataExample", "ex_data", "E000012"],
   *  easy: ["complicated.nested.tag"],
   * }
   * ```
   * @remarks
   * You may use this to have multiple tags pointing to the same tags.
   * @example
   * ```js
   * {
   *  same: ["same", "repeated", "duplicated"],
   *  repeated: ["same", "repeated", "duplicated"],
   *  duplicated: ["same", "repeated", "duplicated"],
   * }
   * ```
   */
  tagAliases?: TagAliases;
}

/**
 * Optional options that can be passed in the instantiation.
 */
export interface SetupOptions {
  /**
   * The date format used in the source.
   * @remarks
   * This option can't be later overriden or passed.
   * @type DateFormat - "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY"
   */
  dateFormat?: DateFormat;
  /**
   * Whether to ignore or not diacritics from source and query.
   *
   * Diacritics examples: áèïõç
   * @type Boolean
   */
  normalize?: boolean;
  /**
   * How many results should be returned.
   * @type Number
   */
  limit?: number;
  /**
   * If the returned object should have a indexing key added to it.
   *
   * @defaultValue False - and the returned object is a reference to the original source
   * @remarks
   * In case of indexing, the returned object is a copy of the source object
   * with a new number key `_EasyFilterIndex` that can be used to sort the returned objects.
   * @type Boolean
   */
  indexing?: boolean;
}

export interface FilterOptions extends SetupOptions {
  /**
   * The date format used to parse the date in the query.
   * @remarks
   * If not provided, will try to use the `dateFormat` if that is available.
   * @type DateFormat - "YYYY-MM-DD" | "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY-DD-MM"
   */
  dateFormatSearch?: DateFormat;
}

export type DateFormat = 'YYYY-MM-DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY';

export type NOT_Exclusion = 'NOT_Exclusion';

export interface TagAliases {
  [key: string]: string[];
}
