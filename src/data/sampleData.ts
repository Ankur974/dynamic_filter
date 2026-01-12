import type { Employee } from '../types';

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Product',
  'Design',
];

const ROLES = [
  'Senior Developer',
  'Junior Developer',
  'Product Manager',
  'Designer',
  'Marketing Manager',
  'Sales Representative',
  'HR Specialist',
  'Finance Analyst',
  'Operations Manager',
  'QA Engineer',
];

const CITIES = [
  'San Francisco',
  'New York',
  'Los Angeles',
  'Chicago',
  'Seattle',
  'Austin',
  'Boston',
  'Denver',
];

const STATES = ['CA', 'NY', 'TX', 'WA', 'IL', 'MA', 'CO', 'FL'];

const SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'GraphQL',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'Vue.js',
  'Angular',
  'Next.js',
];

const FIRST_NAMES = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica',
  'Robert', 'Ashley', 'William', 'Amanda', 'Richard', 'Melissa', 'Joseph',
  'Deborah', 'Thomas', 'Michelle', 'Charles', 'Laura', 'Christopher', 'Kimberly',
  'Daniel', 'Amy', 'Matthew', 'Angela', 'Anthony', 'Sharon', 'Mark', 'Lisa',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
}

function randomSubset<T>(array: T[], min: number, max: number): T[] {
  const count = randomInt(min, max);
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['company.com', 'techcorp.com', 'startup.io', 'enterprise.com'];
  const domain = randomElement(domains);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generateEmployee(id: number): Employee {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const department = randomElement(DEPARTMENTS);
  const role = randomElement(ROLES);
  const city = randomElement(CITIES);
  const state = randomElement(STATES);
  
  const joinDate = randomDate(new Date(2018, 0, 1), new Date(2024, 11, 31));
  
  const joinDateObj = new Date(joinDate);
  const lastReview = randomDate(joinDateObj, new Date());
  
  const baseSalary = randomInt(50000, 150000);
  const salary = Math.round(baseSalary / 1000) * 1000;
  
  const performanceRating = Math.round((Math.random() * 4 + 1) * 10) / 10;
  
  const skills = randomSubset(SKILLS, 2, 5);
  
  const projects = randomInt(0, 10);
  
  const isActive = Math.random() > 0.15;

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName),
    department,
    role,
    salary,
    joinDate,
    isActive,
    skills,
    address: {
      city,
      state,
      country: 'USA',
    },
    projects,
    lastReview,
    performanceRating,
  };
}

export function generateSampleData(count: number = 50): Employee[] {
  return Array.from({ length: count }, (_, index) => generateEmployee(index + 1));
}

export const sampleEmployees: Employee[] = generateSampleData(50);
