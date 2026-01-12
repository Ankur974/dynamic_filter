import { Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, Chip, Box } from '@mui/material';
import type { FilterValue } from '../../types';

interface MultiSelectFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  options: string[]; // Predefined list of options to choose from
}

// Multi-select filter input component
// Provides a dropdown menu with checkboxes for selecting multiple values
export function MultiSelectFilterInput({ value, onChange, options }: MultiSelectFilterInputProps) {
  // Ensure value is an array, default to empty array
  const selectedValues = (value as string[]) || [];

  // Handler for selection changes
  // Handles both array and string (comma-separated) formats
  const handleChange = (event: any) => {
    const newValue = event.target.value;
    // Convert string to array if needed (for compatibility)
    onChange(typeof newValue === 'string' ? newValue.split(',') : newValue);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Select values</InputLabel>
      <Select
        multiple // Enable multiple selection
        value={selectedValues}
        onChange={handleChange}
        label="Select values"
        variant="outlined"
        // Custom render function to display selected values as chips
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((val) => (
              <Chip key={val} label={val} size="small" />
            ))}
          </Box>
        )}
      >
        {/* Render each option with a checkbox */}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={selectedValues.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
