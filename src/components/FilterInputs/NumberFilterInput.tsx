import { TextField } from '@mui/material';
import type { FilterValue } from '../../types';

interface NumberFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  placeholder?: string;
}

// Number filter input component
// Provides a number input field with validation
export function NumberFilterInput({ value, onChange, placeholder = 'Enter number...' }: NumberFilterInputProps) {
  // Handles input changes and validates numeric input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow empty input (sets to null for clearing filter)
    if (inputValue === '') {
      onChange(null);
      return;
    }
    // Parse and validate numeric value
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue); // Only update if valid number
    }
    // Invalid numbers are ignored (input stays as-is)
  };

  return (
    <TextField
      size="small"
      fullWidth
      type="number"
      value={value === null || value === undefined ? '' : value} // Convert null to empty string
      onChange={handleChange}
      placeholder={placeholder}
      variant="outlined"
      inputProps={{ step: 'any' }} // Allow decimal numbers
    />
  );
}
