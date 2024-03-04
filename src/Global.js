let focus = null;

export function setFocus(elem) {
    elem.focus();
    focus = elem;
}

export function getFocus() {
    return focus;
}