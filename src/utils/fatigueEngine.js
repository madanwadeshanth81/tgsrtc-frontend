// TGSRTC Fatigue Analysis Engine
// Composite fatigue risk scoring based on multiple parameters

/**
 * Calculate fatigue risk score for a driver-shift-route combination
 * Returns a score from 0-100 (higher = more fatigued/risky)
 */
export function calculateFatigueRisk(driver, shift, route) {
    let score = 0;

    // Factor 1: Consecutive working hours (weight: 25%)
    const hoursWorked = driver.hoursWorked || 0;
    if (hoursWorked > 8) score += 25;
    else if (hoursWorked > 6) score += 18;
    else if (hoursWorked > 4) score += 10;
    else score += 3;

    // Factor 2: Rest gap before shift (weight: 20%)
    const restHours = driver.restHours || 10;
    if (restHours < 7) score += 20;
    else if (restHours < 9) score += 14;
    else if (restHours < 10) score += 8;
    else score += 2;

    // Factor 3: Route difficulty (weight: 20%)
    const difficulty = route ? route.difficulty : 5;
    score += (difficulty / 10) * 20;

    // Factor 4: Health score inverse (weight: 15%)
    const healthScore = driver.healthScore || 75;
    score += ((100 - healthScore) / 100) * 15;

    // Factor 5: Time of day factor (weight: 10%)
    if (shift) {
        const startHour = parseInt(shift.startTime?.split(':')[0] || '8');
        if (startHour < 5 || startHour >= 22) score += 10; // Night/early morning
        else if (startHour < 6) score += 7;
        else if (startHour >= 14 && startHour < 16) score += 5; // Post-lunch
        else score += 2;
    }

    // Factor 6: Age factor (weight: 10%)
    const age = driver.age || 35;
    if (age > 50) score += 10;
    else if (age > 45) score += 7;
    else if (age > 40) score += 4;
    else score += 2;

    return Math.min(Math.round(score), 100);
}

/**
 * Get shift recommendation for a driver
 */
export function getShiftRecommendation(driver) {
    const fatigueLevel = driver.fatigueLevel || 0;
    const healthScore = driver.healthScore || 75;
    const age = driver.age || 35;

    let maxShiftHours = 8;
    let minRestHours = 10;
    let recommendedRoutes = [];

    if (fatigueLevel > 70 || healthScore < 60) {
        maxShiftHours = 0;
        minRestHours = 24;
        recommendedRoutes = [];
        return {
            maxShiftHours,
            minRestHours,
            recommendedRoutes,
            status: 'rest-required',
            message: 'Driver needs extended rest. Do not assign shifts for 24 hours.',
        };
    }

    if (fatigueLevel > 50 || healthScore < 70) {
        maxShiftHours = 6;
        minRestHours = 14;
        return {
            maxShiftHours,
            minRestHours,
            recommendedRoutes: ['short-highway', 'city-short'],
            status: 'light-duty',
            message: 'Assign only short, low-difficulty routes with extra rest.',
        };
    }

    if (age > 50) {
        maxShiftHours = 7;
        minRestHours = 12;
    }

    return {
        maxShiftHours,
        minRestHours,
        recommendedRoutes: ['any'],
        status: 'fit',
        message: `Driver is fit for duty. Max ${maxShiftHours}h shift, min ${minRestHours}h rest.`,
    };
}

/**
 * Flag high-risk assignments from a list of shifts
 */
export function flagHighRiskAssignments(shifts, drivers, routes) {
    const driverMap = {};
    drivers.forEach(d => { driverMap[d.id] = d; });
    const routeMap = {};
    routes.forEach(r => { routeMap[r.id] = r; });

    return shifts.map(shift => {
        const driver = driverMap[shift.driverId];
        const route = routeMap[shift.routeId];
        const risk = driver && route ? calculateFatigueRisk(driver, shift, route) : shift.fatigueRisk;

        let riskLevel = 'low';
        if (risk >= 70) riskLevel = 'critical';
        else if (risk >= 50) riskLevel = 'warning';
        else if (risk >= 35) riskLevel = 'moderate';

        const violations = [];
        if (driver) {
            if (driver.hoursWorked > 8) violations.push('Exceeds 8-hour shift limit');
            if (driver.restHours < 10) violations.push('Rest period below 10-hour minimum');
            if (driver.fatigueLevel > 70) violations.push('Driver fatigue exceeds safe threshold');
            if (driver.healthScore < 60) violations.push('Low health score - medical review needed');
        }
        if (route && route.difficulty >= 7 && driver && driver.fatigueLevel > 50) {
            violations.push('High-difficulty route assigned to fatigued driver');
        }

        return {
            ...shift,
            calculatedRisk: risk,
            riskLevel,
            violations,
            driverName: driver?.name || 'Unknown',
            routeName: route?.name || 'Unknown',
        };
    });
}

/**
 * Simulate shift optimization
 */
export function optimizeShifts(shifts, drivers, routes) {
    const analyzed = flagHighRiskAssignments(shifts, drivers, routes);

    const optimized = analyzed.map(shift => {
        if (shift.riskLevel === 'critical' || shift.riskLevel === 'warning') {
            const reduction = shift.riskLevel === 'critical' ? 25 : 15;
            return {
                ...shift,
                optimizedRisk: Math.max(shift.calculatedRisk - reduction, 10),
                optimized: true,
                recommendation: shift.riskLevel === 'critical'
                    ? 'Reassign to a rested driver or reduce shift duration'
                    : 'Add a mid-shift break or swap to a shorter route',
            };
        }
        return { ...shift, optimizedRisk: shift.calculatedRisk, optimized: false, recommendation: 'No changes needed' };
    });

    const totalRiskBefore = analyzed.reduce((sum, s) => sum + s.calculatedRisk, 0);
    const totalRiskAfter = optimized.reduce((sum, s) => sum + (s.optimizedRisk || s.calculatedRisk), 0);

    return {
        shifts: optimized,
        improvement: Math.round(((totalRiskBefore - totalRiskAfter) / totalRiskBefore) * 100),
        criticalCount: optimized.filter(s => s.riskLevel === 'critical').length,
        warningCount: optimized.filter(s => s.riskLevel === 'warning').length,
    };
}

/**
 * Get fatigue level classification and color
 */
export function getFatigueClass(level) {
    if (level >= 70) return { label: 'Critical', color: 'danger', cssColor: '#ef4444' };
    if (level >= 50) return { label: 'High', color: 'warning', cssColor: '#f59e0b' };
    if (level >= 30) return { label: 'Moderate', color: 'info', cssColor: '#3b82f6' };
    return { label: 'Low', color: 'success', cssColor: '#22c55e' };
}

/**
 * Get health score classification
 */
export function getHealthClass(score) {
    if (score >= 85) return { label: 'Excellent', color: 'success' };
    if (score >= 70) return { label: 'Good', color: 'info' };
    if (score >= 55) return { label: 'Fair', color: 'warning' };
    return { label: 'Poor', color: 'danger' };
}
