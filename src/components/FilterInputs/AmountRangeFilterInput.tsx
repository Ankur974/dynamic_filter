import { TextField, Box } from '@mui/material';
import type { FilterValue } from '../../types';

interface AmountRangeFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

// Amount range filter input component
// Provides two number inputs for selecting a numeric range (min/max)
export function AmountRangeFilterInput({ value, onChange }: AmountRangeFilterInputProps) {
  // Ensure value is in correct format, default to zero range
  const amountValue = (value as { min: number; max: number }) || { min: 0, max: 0 };

  // Handler for minimum value changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseFloat(e.target.value) || 0; // Default to 0 if empty or invalid
    onChange({
      ...amountValue,
      min, // Update only the 'min' value
    });
  };

  // Handler for maximum value changes
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseFloat(e.target.value) || 0; // Default to 0 if empty or invalid
    onChange({
      ...amountValue,
      max, // Update only the 'max' value
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        size="small"
        type="number"
        label="Min"
        value={amountValue.min || ''} // Convert 0 to empty string for better UX
        onChange={handleMinChange}
        variant="outlined"
        sx={{ flex: 1 }} // Equal width with "max" field
        inputProps={{ step: 'any' }} // Allow decimal numbers
      />
      <TextField
        size="small"
        type="number"
        label="Max"
        value={amountValue.max || ''} // Convert 0 to empty string for better UX
        onChange={handleMaxChange}
        variant="outlined"
        sx={{ flex: 1 }} // Equal width with "min" field
        inputProps={{ step: 'any' }} // Allow decimal numbers
      />
    </Box>
  );
}
