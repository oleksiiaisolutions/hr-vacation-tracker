
import { calculateVacationStats } from './js/logic.js';

// Simple Test Runner
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

async function runTests() {
    console.log("Running Tests...");
    let passed = 0;

    for (const t of tests) {
        try {
            t.fn();
            console.log(`✅ ${t.name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${t.name}`);
            console.error(e.message);
        }
    }

    console.log(`\nPassed ${passed} / ${tests.length}`);
}

// --- Tests ---

test('Scenario 1: Regular Accrual (Feb)', () => {
    // Born in July. Current: Feb 15.
    // 2 months worked (Jan, Feb) -> 4 days earned.
    const emp = { birthday: '07-10', requests: [] };
    const date = new Date('2024-02-15');
    const stats = calculateVacationStats(emp, date);

    if (stats.regularAccrued !== 4) throw new Error(`Expected 4 accrued, got ${stats.regularAccrued}`);
    if (stats.totalBalance !== 4) throw new Error(`Expected 4 balance, got ${stats.totalBalance}`);
});

test('Scenario 2: Birthday Bonus Available (Feb)', () => {
    // Born in Feb. Current: Feb 15.
    // Accrued 4 + 1 Bonus.
    const emp = { birthday: '02-10', requests: [] };
    const date = new Date('2024-02-15');
    const stats = calculateVacationStats(emp, date);

    if (stats.isBirthdayMonthNow !== true) throw new Error('Should be birthday month');
    if (stats.bonusAvailable !== 1) throw new Error('Bonus should be available');
    if (stats.totalBalance !== 5) throw new Error(`Expected 5 balance (4 regular + 1 bonus), got ${stats.totalBalance}`);
});

test('Scenario 3: Birthday Bonus Expired (March)', () => {
    // Born in Feb. Current: Mar 15.
    // Accrued 6. Bonus Expired.
    const emp = { birthday: '02-10', requests: [] };
    const date = new Date('2024-03-15');
    const stats = calculateVacationStats(emp, date);

    if (stats.bonusAvailable !== 0) throw new Error('Bonus should be expired');
    if (stats.totalBalance !== 6) throw new Error(`Expected 6 balance (No bonus), got ${stats.totalBalance}`);
});

test('Scenario 4: Negative Balance', () => {
    // Jan. Earned 2. Taken 5. Balance -3.
    const emp = {
        birthday: '07-10',
        requests: [{ id: '1', date: '2024-01-20', days: 5 }]
    };
    const date = new Date('2024-01-25');
    const stats = calculateVacationStats(emp, date);

    if (stats.regularUsed !== 5) throw new Error(`Expected 5 used, got ${stats.regularUsed}`);
    if (stats.totalBalance !== -3) throw new Error(`Expected -3 balance, got ${stats.totalBalance}`);
});

test('Scenario 5: Using Birthday Bonus (Feb)', () => {
    // Born Feb. Taken 1 day in Feb.
    // Should use Bonus, not Regular.
    // Regular Earned 4. Regular Used 0. Bonus Used 1. Total Balance 4.
    const emp = {
        birthday: '02-10',
        requests: [{ id: '1', date: '2024-02-20', days: 1 }]
    };
    const date = new Date('2024-02-25');
    const stats = calculateVacationStats(emp, date);

    if (!stats.bonusUsed) throw new Error('Should have used bonus');
    if (stats.regularUsed !== 0) throw new Error(`Expected 0 regular used, got ${stats.regularUsed}`);
    if (stats.totalBalance !== 4) throw new Error(`Expected 4 balance (4 regular - 0 used), got ${stats.totalBalance}`);
});

// Run
runTests();
