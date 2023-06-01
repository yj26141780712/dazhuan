import { Observable, Subject } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';
import { getEventPosition, isTouchEvent } from '../util/dom';

interface Point {
    x: number;
    y: number;
}

type Delta = Point;

interface HandlerItem {
    handler?(e: Event): void;

    teardown(): void;
}

function getPagePosition(event: MouseEvent | TouchEvent): Point {
    const e = getEventPosition(event);
    return {
        x: e.pageX,
        y: e.pageY
    };
}


export class DragService {
    private draggingThreshold = 5;
    private currentDraggingSequence: Subject<MouseEvent | Touch> | null = null;
    private currentStartingPoint: Point | null = null;
    private handleRegistry = new Set<any>();
    private renderer;

    constructor(document: Document) {
        this.renderer = document;
    }

    requestDraggingSequence(event: MouseEvent | TouchEvent): Observable<Delta> {
        if (!this.handleRegistry.size) {
            this.registerDraggingHandler(isTouchEvent(event));
        }

        // Complete last dragging sequence if a new target is dragged.
        if (this.currentDraggingSequence) {
            this.currentDraggingSequence.complete();
        }

        this.currentStartingPoint = getPagePosition(event);
        this.currentDraggingSequence = new Subject<MouseEvent | Touch>();
        return this.currentDraggingSequence.pipe(
            map((e: MouseEvent | Touch) => ({
                x: e.pageX - this.currentStartingPoint!.x,
                y: e.pageY - this.currentStartingPoint!.y
            })),
            filter((e: Delta) => {
                return Math.abs(e.x) > this.draggingThreshold || Math.abs(e.y) > this.draggingThreshold;
            }),
            finalize(() => this.teardownDraggingSequence())
        );
    }

    private registerDraggingHandler(isTouch: boolean): void {
        if (isTouch) {
            this.handleRegistry.add({
                teardown: document.addEventListener('touchmove', (e: TouchEvent) => {
                    if (this.currentDraggingSequence) {
                        this.currentDraggingSequence.next(e.touches[0] || e.changedTouches[0]);
                    }
                })
            });
            this.handleRegistry.add({
                teardown: document.addEventListener('touchend', () => {
                    if (this.currentDraggingSequence) {
                        this.currentDraggingSequence.complete();
                    }
                })
            });
        } else {
            this.handleRegistry.add({
                teardown: document.addEventListener('mousemove', e => {
                    if (this.currentDraggingSequence) {
                        this.currentDraggingSequence.next(e);
                    }
                })
            });
            this.handleRegistry.add({
                teardown: document.addEventListener('mouseup', () => {
                    if (this.currentDraggingSequence) {
                        this.currentDraggingSequence.complete();
                    }
                })
            });
        }
    }

    private teardownDraggingSequence(): void {
        this.currentDraggingSequence = null;
    }
}