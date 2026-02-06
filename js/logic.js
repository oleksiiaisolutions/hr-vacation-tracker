
/**
 * Core business logic for Vacation Tracker
 */

export const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
 * Calculates the vacation stats for an employee relative to a specific 'current' date.
 * 
 * @param {Object} employee - The employee object
 * @param {string} employee.birthday - "MM-DD"
 * @param {Array} employee.requests - List of vacation requests { id, date, days }
 * @param {Date} currentDate - The date relative to which we calculate "Earned"
 */
export function calculateVacationStats(employee, currentDate) {
    const currentYear = currentDate.getFullYear();
    const currentMonthIdx = currentDate.getMonth(); // 0-11

    // 1. Calculate Regular Accrued
    // Rule: 2 days for every month worked.
    // We assume: Start of Jan = 2 days? Or End? 
    // "Earns 2 days for every month worked".
    // Let's assume standard: In Jan (month 0), you are working the 1st month.
    // Let's grant the accrual at the start of the month to allow "taking in advance" easier?
    // Actually, standard HR is usually "Start of month". 
    // So Jan = 2, Feb = 4.
    const regularAccrued = (currentMonthIdx + 1) * 2;

    // 2. Analyze Usage & Birthday Bonus
    let regularUsed = 0;
    let bonusUsed = false;

    const birthMonthIdx = parseInt(employee.birthday.split('-')[0]) - 1;

    // We only care about requests in the CURRENT YEAR for this scope?
    // Prompt: "All unused vacation days expire at the end of the calendar year".
    // So we filter requests for currentYear.
    const requestsThisYear = (employee.requests || []).filter(r => {
        return new Date(r.date).getFullYear() === currentYear;
    });

    for (const req of requestsThisYear) {
        const reqDate = new Date(req.date);
        const reqMonth = reqDate.getMonth();

        let daysToDeduct = req.days;

        // Check if this request falls in birthday month
        if (reqMonth === birthMonthIdx) {
            // If we haven't consumed the bonus yet, use it for 1 day of this request
            if (!bonusUsed && daysToDeduct > 0) {
                daysToDeduct -= 1; // 1 day covered by bonus
                bonusUsed = true;
            }
        }

        regularUsed += daysToDeduct;
    }

    // 3. Determine Current Birthday Bonus Availability
    // Bonus is available ONLY if:
    // - We are currently in the birthday month
    // - We haven't used it yet
    const isBirthdayMonthNow = (currentMonthIdx === birthMonthIdx);
    const bonusAvailable = (isBirthdayMonthNow && !bonusUsed) ? 1 : 0;

    // 4. Final Balance
    // "Remaining balance (including negative)".
    // This usually refers to the Regular Balance + Any currently usable bonus.
    const regularBalance = regularAccrued - regularUsed;
    const totalBalance = regularBalance + bonusAvailable;

    return {
        regularAccrued,
        regularUsed,
        regularBalance,
        bonusUsed,
        bonusAvailable, // 1 if currently available to be taken
        totalBalance,
        isBirthdayMonthNow
    };
}

export function formatBalance(num) {
    return num > 0 ? `+${num}` : `${num}`;
}
