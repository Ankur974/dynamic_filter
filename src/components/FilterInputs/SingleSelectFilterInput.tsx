import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { FilterValue } from '../../types';

interface SingleSelectFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  options: string[]; // Predefined list of options to choose from
}

// Single select filter input component
// Provides a dropdown menu for selecting a single value from predefined options
export function SingleSelectFilterInput({ value, onChange, options }: SingleSelectFilterInputProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>Select value</InputLabel>
      <Select
        value={value || ''} // Convert null/undefined to empty string
        onChange={(e) => onChange(e.target.value)} // Update filter value on selection
        label="Select value"
        variant="outlined"
      >
        {/* Render each option as a menu item */}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
