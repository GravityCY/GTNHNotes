const IS_DEBUG = false;

/**
 * Used to log to console only when is in debug mode
 * @param  {...any} arr 
 * @returns 
 */
export function DEBUG(...arr) {
    if (!IS_DEBUG) return;
    console.log(...arr);
}

export function generateUniqueId() {
    // Generate a random number and append it to the current timestamp
    const randomPart = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
    const timestampPart = new Date().getTime().toString(36); // Current timestamp in base36
    return `${timestampPart}-${randomPart}`;
}

/**
 * 
 * @param {*} element 
 * @param {*} cb 
 * @returns 
 */
export function traverse(element, cb) {
    while (true) {
        if (cb(element)) return element;
        element = element.parentElement;
        if (element === document) break;
    }
}