import type { FieldConfig, Employee } from '../types';

// Helper function to extract nested values from employee records
// Used for fields like 'address.city' that require traversing nested objects
function getNestedValue(record: Employee, path: string): any {
  const keys = path.split('.');
  let value: any = record;
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined || value === null) return null; // Early return on null/undefined
  }
  return value;
}

// Field definitions configuration
// Defines all filterable fields, their types, operators, and metadata
// This is the central configuration that determines what fields can be filtered
export const fieldDefinitions: FieldConfig = {
  // Text fields - support various string matching operations
  name: {
    key: 'name',
    label: 'Name',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  email: {
    key: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  
  // Single select fields - exact match from predefined options
  department: {
    key: 'department',
    label: 'Department',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Product', 'Design'],
  },
  role: {
    key: 'role',
    label: 'Role',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: [
      'Senior Developer',
      'Junior Developer',
      'Product Manager',
      'Designer',
      'Marketing Manager',
      'Sales Representative',
      'HR Specialist',
      'Finance Analyst',
      'Operations Manager',
      'QA Engineer',
    ],
  },
  
  // Number fields - support comparison operations
  projects: {
    key: 'projects',
    label: 'Projects',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  performanceRating: {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  
  // Amount fields - range-based filtering (min/max)
  salary: {
    key: 'salary',
    label: 'Salary',
    type: 'amount',
    operators: ['between'],
  },
  
  // Date fields - range-based filtering (from/to dates)
  joinDate: {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date',
    operators: ['between'],
  },
  lastReview: {
    key: 'lastReview',
    label: 'Last Review',
    type: 'date',
    operators: ['between'],
  },
  
  // Boolean fields - true/false filtering
  isActive: {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
    operators: ['is'],
  },
  
  // Multi-select fields - array membership checking
  skills: {
    key: 'skills',
    label: 'Skills',
    type: 'multiSelect',
    operators: ['in', 'notIn'],
    options: [
      'React',
      'TypeScript',
      'Node.js',
      'GraphQL',
      'Python',
      'Java',
      'AWS',
      'Docker',
      'Kubernetes',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'Vue.js',
      'Angular',
      'Next.js',
    ],
  },
  
  // Nested fields - require custom value extractor
  'address.city': {
    key: 'address.city',
    label: 'City',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Seattle', 'Austin', 'Boston', 'Denver'],
    getValue: (record) => getNestedValue(record, 'address.city'), // Custom extractor for nested field
  },
  'address.state': {
    key: 'address.state',
    label: 'State',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: ['CA', 'NY', 'TX', 'WA', 'IL', 'MA', 'CO', 'FL'],
    getValue: (record) => getNestedValue(record, 'address.state'), // Custom extractor for nested field
  },
};

// Retrieves field definition by key
export function getFieldDefinition(key: string) {
  return fieldDefinitions[key];
}

// Returns array of all available field keys
export function getAvailableFields(): string[] {
  return Object.keys(fieldDefinitions);
}
