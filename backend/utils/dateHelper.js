function normalizeDate(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function isPastDate(date) {
    const selected = normalizeDate(date);
    const today = normalizeDate(new Date());

    return selected < today;
}

function isToday(date) {
    const selected = normalizeDate(date);
    const today = normalizeDate(new Date());

    return selected.getTime() === today.getTime();
}

function isNextDay(date) {
    const selected = normalizeDate(date);

    const tomorrow = normalizeDate(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);

    return selected.getTime() === tomorrow.getTime();
}

function isLockedAfter10PM() {
    const now = new Date();
    return now.getHours() >= 22;
}

function isEditableDate(date) {
    return isNextDay(date) && !isLockedAfter10PM();
}

module.exports = {
    isPastDate,
    isToday,
    isNextDay,
    isLockedAfter10PM,
    isEditableDate
};