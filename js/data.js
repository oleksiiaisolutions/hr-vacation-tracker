
/**
 * Data management (Mock Persistence)
 */

const STORAGE_KEY = 'vacation_tracker_data_v1';

export function getEmployees() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    return seedData();
}

export function saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function addRequest(employeeId, request) {
    const employees = getEmployees();
    const emp = employees.find(e => e.id === employeeId);
    if (emp) {
        if (!emp.requests) emp.requests = [];
        emp.requests.push(request);
        saveEmployees(employees);
    }
}

export function addEmployee(name, birthday, startDate) {
    const employees = getEmployees();
    const newEmp = {
        id: 'emp-' + Date.now(),
        name,
        birthday,   // MM-DD
        startDate,  // YYYY-MM-DD
        requests: []
    };
    employees.push(newEmp);
    saveEmployees(employees);
    return newEmp;
}

function seedData() {
    const employees = [
        {
            id: 'emp-001',
            name: 'Alice Johnson',
            birthday: '02-15', // Feb
            startDate: '2024-01-01',
            requests: []
        },
        {
            id: 'emp-002',
            name: 'Bob Smith',
            birthday: '05-22', // May
            startDate: '2023-11-20',
            requests: [
                { id: 'req-1', date: '2026-01-20', days: 2 } // Mock previous request
            ]
        },
        {
            id: 'emp-003',
            name: 'Charlie Brown',
            birthday: '12-01', // Dec
            startDate: '2024-03-01',
            requests: []
        }
    ];
    saveEmployees(employees);
    return employees;
}
