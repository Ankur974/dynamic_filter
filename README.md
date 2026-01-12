# Dynamic Filter Component System

A powerful, type-safe React application for filtering and exploring employee data with dynamic, configurable filters. Built with React, TypeScript, and Material-UI.

## Features

- **Dynamic Filter Builder**: Create multiple filters with different field types and operators
- **Type-Safe Filtering**: Full TypeScript support with comprehensive type definitions
- **Multiple Field Types**: Support for text, number, date, amount, single select, multi-select, and boolean fields
- **Flexible Operators**: Different operators for each field type (equals, contains, between, etc.)
- **Persistent Filters**: Filters are automatically saved to localStorage
- **Sortable Data Table**: Sort by any column with visual indicators
- **Real-time Filtering**: Filters are applied instantly as you type or change values
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Field Types & Operators

### Text Fields
- **Operators**: Equals, Contains, Starts With, Ends With, Does Not Contain
- **Example Fields**: Name, Email

### Number Fields
- **Operators**: Equals, Greater Than, Less Than, Greater Than or Equal, Less Than or Equal
- **Example Fields**: Projects, Performance Rating

### Date Fields
- **Operators**: Between
- **Example Fields**: Join Date, Last Review

### Amount Fields
- **Operators**: Between
- **Example Fields**: Salary

### Single Select Fields
- **Operators**: Is, Is Not
- **Example Fields**: Department, Role, City, State

### Multi-Select Fields
- **Operators**: In, Not In
- **Example Fields**: Skills

### Boolean Fields
- **Operators**: Is
- **Example Fields**: Active Status

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dynamic-filter-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                 # API layer (mock API for demo)
│   └── mockApi.ts
├── components/          # React components
│   ├── DataTable.tsx    # Data table with sorting
│   ├── FilterBuilder.tsx # Main filter builder component
│   ├── FilterRow.tsx    # Individual filter row component
│   └── FilterInputs/    # Filter input components for each field type
│       ├── TextFilterInput.tsx
│       ├── NumberFilterInput.tsx
│       ├── DateRangeFilterInput.tsx
│       ├── AmountRangeFilterInput.tsx
│       ├── SingleSelectFilterInput.tsx
│       ├── MultiSelectFilterInput.tsx
│       └── BooleanFilterInput.tsx
├── config/              # Configuration files
│   └── fieldDefinitions.ts  # Field definitions and metadata
├── data/                # Sample data
│   └── sampleData.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── filterUtils.ts  # Filtering logic
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Usage

### Adding a Filter

1. Click the "Add Filter" button
2. Select a field from the dropdown
3. Choose an operator
4. Enter the filter value(s)
5. The data table will automatically update to show filtered results

### Removing a Filter

Click the trash icon (🗑️) next to any filter to remove it.

### Clearing All Filters

Click the "Clear All" button to remove all active filters.

### Sorting Data

Click on any column header to sort by that column. Click again to reverse the sort order.

## Customization

### Adding New Fields

To add a new filterable field:

1. Update the `Employee` interface in `src/types/index.ts` if needed
2. Add a field definition in `src/config/fieldDefinitions.ts`:
```typescript
newField: {
  key: 'newField',
  label: 'New Field',
  type: 'text', // or 'number', 'date', etc.
  operators: ['equals', 'contains'],
}
```

### Adding New Field Types

1. Add the new type to `FieldType` in `src/types/index.ts`
2. Add operators for the new type
3. Create a new filter input component in `src/components/FilterInputs/`
4. Add filtering logic in `src/utils/filterUtils.ts`
5. Update `FilterRow.tsx` to handle the new type

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Vite** - Build tool
- **date-fns** - Date manipulation
- **uuid** - Unique ID generation
- **lucide-react** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# dynamic_filter
