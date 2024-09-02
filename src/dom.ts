import type { JSX } from 'solid-js'

export type EventHandlerEvent<T, E extends Event> = E & {
    currentTarget: T
    target: Element
}

export const afterPaint = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn))

export function callEventHandler<T, E extends Event>(eventHandler: JSX.EventHandlerUnion<T, E> | undefined, event: EventHandlerEvent<T, E>) {
    if (eventHandler) {
        if (typeof eventHandler === 'function') {
            eventHandler(event)
        }
        else {
            eventHandler[0](eventHandler[1], event)
        }
    }
    return event.defaultPrevented
}
