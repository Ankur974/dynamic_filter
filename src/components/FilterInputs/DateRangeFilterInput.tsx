import { TextField, Box } from '@mui/material';
import type { FilterValue } from '../../types';

interface DateRangeFilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

// Date range filter input component
// Provides two date pickers for selecting a date range (from/to)
export function DateRangeFilterInput({ value, onChange }: DateRangeFilterInputProps) {
  // Ensure value is in correct format, default to empty range
  const dateValue = (value as { from: string; to: string }) || { from: '', to: '' };

  // Handler for "from" date changes
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...dateValue,
      from: e.target.value, // Update only the 'from' date
    });
  };

  // Handler for "to" date changes
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...dateValue,
      to: e.target.value, // Update only the 'to' date
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        size="small"
        type="date"
        label="From"
        value={dateValue.from}
        onChange={handleFromChange}
        InputLabelProps={{ shrink: true }} // Keep label visible when value is set
        variant="outlined"
        sx={{ flex: 1 }} // Equal width with "to" field
      />
      <TextField
        size="small"
        type="date"
        label="To"
        value={dateValue.to}
        onChange={handleToChange}
        InputLabelProps={{ shrink: true }} // Keep label visible when value is set
        variant="outlined"
        sx={{ flex: 1 }} // Equal width with "from" field
      />
    </Box>
  );
}
