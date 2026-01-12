import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { FilterCondition } from '../types';
import { getFieldDefinition, getAvailableFields } from '../config/fieldDefinitions';
import { FilterRow } from './FilterRow';

interface FilterBuilderProps {
  filters: FilterCondition[];
  onChange: (filters: FilterCondition[]) => void;
}

// Creates a new empty filter with default values
// Uses the first available field and its default operator
function createEmptyFilter(): FilterCondition {
  const availableFields = getAvailableFields();
  const firstField = availableFields[0];
  const fieldDef = getFieldDefinition(firstField);
  
  return {
    id: uuidv4(), // Generate unique ID for the filter
    field: firstField,
    operator: fieldDef?.operators[0] || 'equals', // Use first available operator
    value: getDefaultValue(fieldDef?.type || 'text'), // Get default value based on field type
  };
}

// Returns the default value for a given field type
// Used when creating new filters or resetting filter values
function getDefaultValue(fieldType: string): any {
  switch (fieldType) {
    case 'text':
    case 'singleSelect':
      return '';
    case 'number':
      return 0;
    case 'date':
      return { from: '', to: '' }; // Empty date range
    case 'amount':
      return { min: 0, max: 0 }; // Empty amount range
    case 'multiSelect':
      return []; // Empty array
    case 'boolean':
      return true; // Default to true
    default:
      return null;
  }
}

export function FilterBuilder({ filters, onChange }: FilterBuilderProps) {
  // Local state to manage filters internally
  // This prevents unnecessary re-renders and provides better UX
  const [localFilters, setLocalFilters] = useState<FilterCondition[]>(filters);
  
  // Ref to track if update is from internal state change or external prop change
  // Prevents infinite update loops when syncing with parent component
  const isInternalUpdate = useRef(false);

  // Sync local state with prop changes (but ignore internal updates)
  useEffect(() => {
    if (!isInternalUpdate.current) {
      setLocalFilters(filters);
    }
    isInternalUpdate.current = false; // Reset flag after sync
  }, [filters]);

  // Centralized filter update function
  // Updates both local state and notifies parent component
  const updateFilters = useCallback((newFilters: FilterCondition[]) => {
    isInternalUpdate.current = true; // Mark as internal update
    setLocalFilters(newFilters);
    onChange(newFilters); // Notify parent component
  }, [onChange]);

  // Handler for adding a new filter row
  const handleAddFilter = () => {
    const newFilter = createEmptyFilter();
    const updated = [...localFilters, newFilter];
    updateFilters(updated);
  };

  // Handler for updating an existing filter
  // Finds the filter by ID and replaces it with the updated version
  const handleUpdateFilter = useCallback((updatedFilter: FilterCondition) => {
    const updated = localFilters.map((f) => (f.id === updatedFilter.id ? updatedFilter : f));
    updateFilters(updated);
  }, [localFilters, updateFilters]);

  // Handler for removing a filter
  // Filters out the filter with the given ID
  const handleRemoveFilter = useCallback((filterId: string) => {
    const updated = localFilters.filter((f) => f.id !== filterId);
    updateFilters(updated);
  }, [localFilters, updateFilters]);

  // Handler for clearing all filters
  const handleClearAll = () => {
    updateFilters([]);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {localFilters.length > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<X size={16} />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={handleAddFilter}
          >
            Add Filter
          </Button>
        </Box>
      </Box>

      {localFilters.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            No filters applied. Click "Add Filter" to start filtering your data.
          </Typography>
        </Box>
      ) : (
        <Box>
          {localFilters.map((filter) => (
            <FilterRow
              key={filter.id}
              condition={filter}
              onUpdate={handleUpdateFilter}
              onRemove={() => handleRemoveFilter(filter.id)}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
