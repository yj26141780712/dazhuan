export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
}


export function getEventPosition(event: MouseEvent | TouchEvent): MouseEvent | Touch {
    return isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
}