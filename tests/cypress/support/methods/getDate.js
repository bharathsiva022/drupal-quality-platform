export function getFormattedDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    return formattedDate;
}

export function convertDateToISOFormat(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${dateString}`);
    }
    return date.toISOString().split('T')[0]; // e.g. "2025-04-23"
}
