export function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function isPastDate(dateStr) {
    const selected = normalizeDate(dateStr);
    const today = normalizeDate(new Date());
    return selected < today;
}

export function isToday(dateStr) {
    const selected = normalizeDate(dateStr);
    const today = normalizeDate(new Date());
    return selected.getTime() === today.getTime();
}

export function isNextDay(dateStr) {
    const selected = normalizeDate(dateStr);
    const tomorrow = normalizeDate(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return selected.getTime() === tomorrow.getTime();
}

export function isLockedAfter10PM() {
    const now = new Date();
    return now.getHours() >= 22; // রাত ১০টা বা তার বেশি
}

export function getMealDateStatus(dateStr) {
    if (isPastDate(dateStr)) return 'past';
    if (isToday(dateStr)) return 'today';
    if (isNextDay(dateStr)) {
        return isLockedAfter10PM() ? 'locked' : 'editable';
    }
    return 'future_locked'; // আগামীকালকের পরের দিনগুলোও লকড থাকবে
}

export function formatDateString(date) {
    return date.toISOString().split('T')[0];
}