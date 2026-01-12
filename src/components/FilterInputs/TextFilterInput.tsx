import { TextField } from '@mui/material';
import type { FilterValue } from '../../types';

interface TextFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  placeholder?: string;
}

// Text filter input component
// Provides a text field for entering string values to filter by
export function TextFilterInput({ value, onChange, placeholder = 'Enter value...' }: TextFilterInputProps) {
  return (
    <TextField
      size="small"
      fullWidth
      value={value || ''} // Convert null/undefined to empty string for display
      onChange={(e) => onChange(e.target.value)} // Update filter value on change
      placeholder={placeholder}
      variant="outlined"
    />
  );
}
