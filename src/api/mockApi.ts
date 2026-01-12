import { sampleEmployees } from '../data/sampleData';
import type { Employee } from '../types';

// Mock API class for simulating backend API calls
// In a real application, this would make HTTP requests to an actual backend
class MockApi {
  // Internal storage of employee data
  private employees: Employee[];

  constructor() {
    // Initialize with sample data
    this.employees = sampleEmployees;
  }

  // Simulates fetching all employees with a small delay
  // Returns a copy of the employees array to prevent mutations
  async getEmployees(): Promise<Employee[]> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay
    return [...this.employees]; // Return copy to prevent external mutations
  }

  // Simulates fetching a single employee by ID
  async getEmployeeById(id: number): Promise<Employee | null> {
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay
    return this.employees.find((emp) => emp.id === id) || null;
  }
}

// Export singleton instance
export const mockApi = new MockApi();
