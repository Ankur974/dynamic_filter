import { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import type { FilterCondition, Employee } from './types';
import { FilterBuilder } from './components/FilterBuilder';
import { DataTable } from './components/DataTable';
import { filterEmployees, validateFilterCondition } from './utils/filterUtils';
import { mockApi } from './api/mockApi';

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // State for storing all employee records
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // State for filter conditions, initialized from localStorage if available
  // This allows filters to persist across page refreshes
  const [filters, setFilters] = useState<FilterCondition[]>(() => {
    try {
      const saved = localStorage.getItem('dynamic-filters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  // Loading state for async data fetching
  const [loading, setLoading] = useState(true);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dynamic-filters', JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }, [filters]);

  // Memoized filtered employees list
  // Only recalculates when employees or filters change
  // Validates filters before applying them to ensure data integrity
  const filteredEmployees = useMemo(() => {
    const validFilters = filters.filter((filter) => validateFilterCondition(filter));
    return filterEmployees(employees, validFilters);
  }, [employees, filters]);

  // Handler for filter changes from FilterBuilder component
  const handleFiltersChange = (newFilters: FilterCondition[]) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dynamic Filter Component System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Filter and explore employee data with dynamic, type-safe filters
          </Typography>
        </Box>

        <FilterBuilder filters={filters} onChange={handleFiltersChange} />

        <DataTable data={filteredEmployees} totalRecords={employees.length} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
