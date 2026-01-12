import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Grid,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { FilterCondition, FilterValue } from '../types';
import { getFieldDefinition, getAvailableFields } from '../config/fieldDefinitions';
import {
  TextFilterInput,
  NumberFilterInput,
  DateRangeFilterInput,
  AmountRangeFilterInput,
  SingleSelectFilterInput,
  MultiSelectFilterInput,
  BooleanFilterInput,
} from './FilterInputs';

interface FilterRowProps {
  condition: FilterCondition;
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
}

// Returns the default value for a field type when switching fields
function getDefaultValue(fieldType: string): FilterValue {
  switch (fieldType) {
    case 'text':
    case 'singleSelect':
      return '';
    case 'number':
      return 0;
    case 'date':
      return { from: '', to: '' };
    case 'amount':
      return { min: 0, max: 0 };
    case 'multiSelect':
      return [];
    case 'boolean':
      return true;
    default:
      return null;
  }
}

export function FilterRow({ condition, onUpdate, onRemove }: FilterRowProps) {
  // Local state for the filter condition
  // Allows for debounced updates to prevent excessive re-renders
  const [localCondition, setLocalCondition] = useState<FilterCondition>(condition);
  
  // Get field definition and available fields for dropdowns
  const fieldDef = getFieldDefinition(localCondition.field);
  const availableFields = getAvailableFields();

  // Debounced update: waits 100ms after last change before notifying parent
  // This prevents excessive updates while user is typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate(localCondition);
    }, 100);
    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or change
  }, [localCondition, onUpdate]);

  // Handler for field selection change
  // When field changes, reset operator and value to defaults for the new field type
  const handleFieldChange = (newField: string) => {
    const newFieldDef = getFieldDefinition(newField);
    if (newFieldDef) {
      setLocalCondition({
        ...localCondition,
        field: newField,
        operator: newFieldDef.operators[0], // Use first available operator
        value: getDefaultValue(newFieldDef.type), // Reset to default value
      });
    }
  };

  // Handler for operator selection change
  const handleOperatorChange = (newOperator: string) => {
    setLocalCondition({
      ...localCondition,
      operator: newOperator as any,
    });
  };

  // Handler for value input changes
  const handleValueChange = (newValue: FilterValue) => {
    setLocalCondition({
      ...localCondition,
      value: newValue,
    });
  };

  // Renders the appropriate input component based on field type
  // Each field type has its own specialized input component
  const renderValueInput = () => {
    if (!fieldDef) return null;

    switch (fieldDef.type) {
      case 'text':
        return (
          <TextFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
          />
        );
      case 'number':
        return (
          <NumberFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
          />
        );
      case 'date':
        return (
          <DateRangeFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
          />
        );
      case 'amount':
        return (
          <AmountRangeFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
          />
        );
      case 'singleSelect':
        return (
          <SingleSelectFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
            options={fieldDef.options || []}
          />
        );
      case 'multiSelect':
        return (
          <MultiSelectFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
            options={fieldDef.options || []}
          />
        );
      case 'boolean':
        return (
          <BooleanFilterInput
            value={localCondition.value}
            onChange={handleValueChange}
          />
        );
      default:
        return null;
    }
  };

  // Converts operator keys to human-readable labels for display
  const getOperatorLabel = (operator: string): string => {
    const operatorLabels: Record<string, string> = {
      equals: 'Equals',
      contains: 'Contains',
      startsWith: 'Starts With',
      endsWith: 'Ends With',
      doesNotContain: 'Does Not Contain',
      greaterThan: 'Greater Than',
      lessThan: 'Less Than',
      greaterThanOrEqual: 'Greater Than or Equal',
      lessThanOrEqual: 'Less Than or Equal',
      between: 'Between',
      is: 'Is',
      isNot: 'Is Not',
      in: 'In',
      notIn: 'Not In',
    };
    return operatorLabels[operator] || operator;
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Field</InputLabel>
            <Select
              value={localCondition.field}
              onChange={(e) => handleFieldChange(e.target.value)}
              label="Field"
              variant="outlined"
            >
              {availableFields.map((field) => {
                const def = getFieldDefinition(field);
                return (
                  <MenuItem key={field} value={field}>
                    {def?.label || field}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Operator</InputLabel>
            <Select
              value={localCondition.operator}
              onChange={(e) => handleOperatorChange(e.target.value)}
              label="Operator"
              variant="outlined"
              disabled={!fieldDef}
            >
              {fieldDef?.operators.map((op) => (
                <MenuItem key={op} value={op}>
                  {getOperatorLabel(op)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 5 }}>
          {renderValueInput()}
        </Grid>

        <Grid size={{ xs: 12, sm: 1 }}>
          <IconButton
            onClick={onRemove}
            color="error"
            size="small"
            aria-label="Remove filter"
          >
            <Trash2 size={18} />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}
