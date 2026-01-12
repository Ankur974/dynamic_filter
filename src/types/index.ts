// Employee data model - represents a single employee record
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string; // ISO date string
  isActive: boolean;
  skills: string[]; // Array of skill names
  address: {
    city: string;
    state: string;
    country: string;
  };
  projects: number;
  lastReview: string; // ISO date string
  performanceRating: number; // Typically 1-5 scale
}

// Supported field types for filtering
export type FieldType = 
  | 'text'           // Free-form text fields
  | 'number'         // Numeric fields
  | 'date'           // Date fields (range-based)
  | 'amount'         // Currency/numeric ranges
  | 'singleSelect'   // Single choice from predefined options
  | 'multiSelect'    // Multiple choices from predefined options
  | 'boolean';       // True/false fields

// Text field operators - for string matching operations
export type TextOperator = 
  | 'equals'           // Exact match (case-insensitive)
  | 'contains'         // Substring match
  | 'startsWith'       // Prefix match
  | 'endsWith'         // Suffix match
  | 'doesNotContain';  // Negation of contains

// Number field operators - for numeric comparisons
export type NumberOperator = 
  | 'equals'              // Exact match
  | 'greaterThan'         // >
  | 'lessThan'            // <
  | 'greaterThanOrEqual'  // >=
  | 'lessThanOrEqual';    // <=

// Date field operators - currently only supports range filtering
export type DateOperator = 'between';

// Amount field operators - for range-based filtering (e.g., salary ranges)
export type AmountOperator = 'between';

// Single select operators - for exact match or negation
export type SingleSelectOperator = 'is' | 'isNot';

// Multi-select operators - for checking membership in arrays
export type MultiSelectOperator = 'in' | 'notIn';

// Boolean operators - for true/false checks
export type BooleanOperator = 'is';

// Union of all possible filter operators
export type FilterOperator = 
  | TextOperator 
  | NumberOperator 
  | DateOperator 
  | AmountOperator 
  | SingleSelectOperator 
  | MultiSelectOperator 
  | BooleanOperator;

// Filter value types - varies based on field type
export type FilterValue = 
  | string                              // For text and singleSelect
  | number                              // For number fields
  | { from: string; to: string }        // For date ranges
  | { min: number; max: number }        // For amount ranges
  | string[]                            // For multiSelect
  | boolean                             // For boolean fields
  | null;                               // Empty/unset value

// Field definition - metadata for each filterable field
export interface FieldDefinition {
  key: string;                          // Unique identifier for the field
  label: string;                        // Display name
  type: FieldType;                      // Field type determines available operators
  operators: FilterOperator[];          // Available operators for this field
  options?: string[];                   // Predefined options (for select fields)
  getValue?: (record: Employee) => unknown; // Custom value extractor (for nested fields)
}

// Filter condition - represents a single filter rule
export interface FilterCondition {
  id: string;              // Unique identifier for the filter
  field: string;           // Field key to filter on
  operator: FilterOperator; // Operator to apply
  value: FilterValue;      // Value(s) to filter by
}

// Filter state - array of filter conditions (all conditions are ANDed together)
export type FilterState = FilterCondition[];

// Field configuration - map of field keys to their definitions
export type FieldConfig = Record<string, FieldDefinition>;
