import { FormControlLabel, Switch } from '@mui/material';
import type { FilterValue } from '../../types';

interface BooleanFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

// Boolean filter input component
// Provides a toggle switch for true/false filtering
export function BooleanFilterInput({ value, onChange }: BooleanFilterInputProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value === true} // Only true is considered checked
          onChange={(e) => onChange(e.target.checked)} // Update filter value on toggle
        />
      }
      label={value === true ? 'Yes' : 'No'} // Display label based on current value
    />
  );
}
