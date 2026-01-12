import type { Employee, FilterCondition } from '../types';
import { getFieldDefinition } from '../config/fieldDefinitions';

// Extracts the value for a given field from an employee record
// Supports nested fields (e.g., 'address.city') and custom value extractors
function getFieldValue(record: Employee, fieldKey: string): any {
  const fieldDef = getFieldDefinition(fieldKey);
  
  // Use custom value extractor if provided (for complex fields)
  if (fieldDef?.getValue) {
    return fieldDef.getValue(record);
  }
  
  // Handle nested field paths (e.g., 'address.city')
  const keys = fieldKey.split('.');
  let value: any = record;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined || value === null) return null; // Early return on null/undefined
  }
  return value;
}

// Applies text filter operations (case-insensitive)
function applyTextFilter(
  recordValue: string,
  operator: string,
  filterValue: string
): boolean {
  if (!recordValue) return false;
  
  // Case-insensitive comparison
  const recordLower = recordValue.toLowerCase();
  const filterLower = filterValue.toLowerCase();
  
  switch (operator) {
    case 'equals':
      return recordLower === filterLower;
    case 'contains':
      return recordLower.includes(filterLower);
    case 'startsWith':
      return recordLower.startsWith(filterLower);
    case 'endsWith':
      return recordLower.endsWith(filterLower);
    case 'doesNotContain':
      return !recordLower.includes(filterLower);
    default:
      return false;
  }
}

// Applies numeric filter operations
function applyNumberFilter(
  recordValue: number,
  operator: string,
  filterValue: number
): boolean {
  if (recordValue === null || recordValue === undefined) return false;
  
  switch (operator) {
    case 'equals':
      return recordValue === filterValue;
    case 'greaterThan':
      return recordValue > filterValue;
    case 'lessThan':
      return recordValue < filterValue;
    case 'greaterThanOrEqual':
      return recordValue >= filterValue;
    case 'lessThanOrEqual':
      return recordValue <= filterValue;
    default:
      return false;
  }
}

// Applies date range filter (between two dates)
// Sets time boundaries to include entire days
function applyDateFilter(
  recordValue: string,
  filterValue: { from: string; to: string }
): boolean {
  if (!recordValue) return false;
  
  const recordDate = new Date(recordValue);
  const fromDate = new Date(filterValue.from);
  const toDate = new Date(filterValue.to);
  
  // Set time boundaries: start of day for 'from', end of day for 'to'
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);
  
  return recordDate >= fromDate && recordDate <= toDate;
}

// Applies amount range filter (between min and max values)
function applyAmountFilter(
  recordValue: number,
  filterValue: { min: number; max: number }
): boolean {
  if (recordValue === null || recordValue === undefined) return false;
  
  return recordValue >= filterValue.min && recordValue <= filterValue.max;
}

// Applies single select filter (exact match or negation)
function applySingleSelectFilter(
  recordValue: string,
  operator: string,
  filterValue: string
): boolean {
  if (!recordValue) return false;
  
  switch (operator) {
    case 'is':
      return recordValue === filterValue;
    case 'isNot':
      return recordValue !== filterValue;
    default:
      return false;
  }
}

// Applies multi-select filter (checks if any selected value is in record's array)
function applyMultiSelectFilter(
  recordValue: string[],
  operator: string,
  filterValue: string[]
): boolean {
  if (!recordValue || !Array.isArray(recordValue)) return false;
  
  switch (operator) {
    case 'in':
      // Record must contain at least one of the selected values
      return filterValue.some((val) => recordValue.includes(val));
    case 'notIn':
      // Record must not contain any of the selected values
      return !filterValue.some((val) => recordValue.includes(val));
    default:
      return false;
  }
}

// Applies boolean filter (exact match)
function applyBooleanFilter(
  recordValue: boolean,
  filterValue: boolean
): boolean {
  return recordValue === filterValue;
}

// Applies a single filter condition to a record
// Routes to the appropriate filter function based on field type
function applyFilterCondition(record: Employee, condition: FilterCondition): boolean {
  const { field, operator, value } = condition;
  const recordValue = getFieldValue(record, field);
  const fieldDef = getFieldDefinition(field);
  
  // Invalid field definition
  if (!fieldDef) return false;
  
  // Null/undefined values don't match any filter
  if (recordValue === null || recordValue === undefined) {
    return false;
  }
  
  // Route to appropriate filter function based on field type
  switch (fieldDef.type) {
    case 'text':
      return applyTextFilter(recordValue, operator, value as string);
    
    case 'number':
      return applyNumberFilter(recordValue, operator, value as number);
    
    case 'date':
      return applyDateFilter(recordValue, value as { from: string; to: string });
    
    case 'amount':
      return applyAmountFilter(recordValue, value as { min: number; max: number });
    
    case 'singleSelect':
      return applySingleSelectFilter(recordValue, operator, value as string);
    
    case 'multiSelect':
      return applyMultiSelectFilter(recordValue, operator, value as string[]);
    
    case 'boolean':
      return applyBooleanFilter(recordValue, value as boolean);
    
    default:
      return false;
  }
}

// Filters employees based on multiple filter conditions
// All conditions must match (AND logic) - a record must satisfy every filter
export function filterEmployees(
  employees: Employee[],
  filters: FilterCondition[]
): Employee[] {
  // Return all employees if no filters applied
  if (filters.length === 0) {
    return employees;
  }
  
  // Filter records where every condition is satisfied
  return employees.filter((record) => {
    return filters.every((condition) => applyFilterCondition(record, condition));
  });
}

// Validates that a filter condition is properly formed and has valid values
// Used to filter out incomplete or invalid filters before applying them
export function validateFilterCondition(condition: FilterCondition): boolean {
  const { field, operator, value } = condition;
  const fieldDef = getFieldDefinition(field);
  
  // Field must exist in definitions
  if (!fieldDef) return false;
  
  // Operator must be valid for this field type
  if (!fieldDef.operators.includes(operator)) return false;
  
  // Validate value based on field type
  switch (fieldDef.type) {
    case 'text':
    case 'singleSelect':
      // Must be non-empty string
      return typeof value === 'string' && value.trim().length > 0;
    
    case 'number':
      // Must be a valid number
      return typeof value === 'number' && !isNaN(value);
    
    case 'date':
      // Must be object with 'from' and 'to' string properties
      return (
        typeof value === 'object' &&
        value !== null &&
        'from' in value &&
        'to' in value &&
        typeof (value as { from: string; to: string }).from === 'string' &&
        typeof (value as { from: string; to: string }).to === 'string'
      );
    
    case 'amount':
      // Must be object with 'min' and 'max' number properties, and min <= max
      return (
        typeof value === 'object' &&
        value !== null &&
        'min' in value &&
        'max' in value &&
        typeof (value as { min: number; max: number }).min === 'number' &&
        typeof (value as { min: number; max: number }).max === 'number' &&
        (value as { min: number; max: number }).min <= (value as { min: number; max: number }).max
      );
    
    case 'multiSelect':
      // Must be non-empty array
      return Array.isArray(value) && value.length > 0;
    
    case 'boolean':
      // Must be boolean
      return typeof value === 'boolean';
    
    default:
      return false;
  }
}
