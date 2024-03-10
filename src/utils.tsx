const IS_DEBUG = true;

export class OrderedMap {
    order: any[];
    map: {};
    constructor() {
        this.order = [];
        this.map = {};
    }

    size() {
        return this.order.length;
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(str: string) {
        const data = JSON.parse(str);
        this.order = [...data.order];
        this.map = { ...data.map };
    }

    set(key: any, value: any) {
        if (value == null) {
            this.remove(key);
            return;
        }
        if (this.map[key] == null) {
            this.order.push(key);
        }
        this.map[key] = value;
    }

    get(key: any) {
        return this.map[key];
    }

    move(key: any, newIndex: number) {
        const index = this.order.indexOf(key);
        if (index === -1 || index === newIndex) return;
        this.order.splice(index, 1);
        this.order.splice(newIndex, 0, key);
    }

    moveTo(id: string, to: string) {
        const toIndex = this.order.indexOf(to);
        if (toIndex === -1) return;
        this.move(id, toIndex);
    }

    index(key: any) {
        return this.order.indexOf(key);
    }

    all() {
        return this.order.map((key) => ({
            key,
            value: this.map[key],
        }));
    }

    clone() {
        const newMap = new OrderedMap();
        newMap.order = [...this.order];
        newMap.map = { ...this.map };
        return newMap;
    }

    remove(key: any) {
        const index = this.order.indexOf(key);
        if (index > -1) {
            this.order.splice(index, 1);
            delete this.map[key];
        }
    }
}

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

export function traverse(element: HTMLElement, cb: (a: HTMLElement) => boolean) {
    while (true) {
        if (cb(element)) return element;
        if (!element.parentElement) return null;
        element = element.parentElement;
        if (element === document) break;
    }
}