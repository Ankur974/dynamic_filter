import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import type { Employee } from '../types';

interface DataTableProps {
  data: Employee[];
  totalRecords: number; // Total records before filtering (for display purposes)
}

// Sortable fields include direct Employee properties and nested address fields
type SortField = keyof Employee | 'address.city' | 'address.state';
type SortDirection = 'asc' | 'desc';

// Extracts the display value for a given field from an employee record
// Handles nested fields like address.city and address.state
function getDisplayValue(record: Employee, field: SortField): any {
  if (field === 'address.city') {
    return record.address.city;
  }
  if (field === 'address.state') {
    return record.address.state;
  }
  return record[field as keyof Employee];
}

export function DataTable({ data, totalRecords }: DataTableProps) {
  // Current sort field and direction
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Memoized sorted data - only recalculates when data, sortField, or sortDirection changes
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aValue = getDisplayValue(a, sortField);
      const bValue = getDisplayValue(b, sortField);

      // Handle null/undefined values - push them to the end
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Array comparison (e.g., skills) - sort by array length
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        const comparison = aValue.length - bValue.length;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison using locale-aware comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Boolean comparison
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        const comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // Fallback: convert to string and compare
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortField, sortDirection]);

  // Handler for column header clicks
  // Toggles sort direction if clicking the same field, otherwise sets new field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const columns: Array<{ field: SortField; label: string; width?: string }> = [
    { field: 'id', label: 'ID', width: '80px' },
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'department', label: 'Department' },
    { field: 'role', label: 'Role' },
    { field: 'salary', label: 'Salary', width: '120px' },
    { field: 'joinDate', label: 'Join Date', width: '120px' },
    { field: 'isActive', label: 'Active', width: '100px' },
    { field: 'skills', label: 'Skills' },
    { field: 'address.city' as SortField, label: 'City' },
    { field: 'address.state' as SortField, label: 'State', width: '80px' },
    { field: 'projects', label: 'Projects', width: '100px' },
    { field: 'lastReview', label: 'Last Review', width: '120px' },
    { field: 'performanceRating', label: 'Rating', width: '100px' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{sortedData.length}</strong> of <strong>{totalRecords}</strong> records
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  sx={{
                    width: column.width,
                    backgroundColor: 'background.paper',
                    fontWeight: 'bold',
                  }}
                >
                  <TableSortLabel
                    active={sortField === column.field}
                    direction={sortField === column.field ? sortDirection : 'asc'}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No results found. Try adjusting your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Chip label={employee.department} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    ${employee.salary.toLocaleString()}
                  </TableCell>
                  <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={employee.isActive ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {employee.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{employee.address.city}</TableCell>
                  <TableCell>{employee.address.state}</TableCell>
                  <TableCell>{employee.projects}</TableCell>
                  <TableCell>{new Date(employee.lastReview).toLocaleDateString()}</TableCell>
                  <TableCell>{employee.performanceRating}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
