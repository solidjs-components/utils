import type { Accessor } from 'solid-js'

export type MaybeAccessor<T> = T | (() => T)
export type MaybeAccessorValue<T extends MaybeAccessor<unknown>> = T extends () => unknown ? ReturnType<T> : T

export function access<T extends MaybeAccessor<unknown>>(v: T): MaybeAccessorValue<T> {
    return typeof v === 'function' ? v() : v
}

export function chain<Args extends [] | unknown[]>(callbacks: {
    [Symbol.iterator]: () => IterableIterator<
        ((...args: Args) => unknown) | undefined
    >
}): ((...args: Args) => void) {
    return (...args: Args) => {
        for (const callback of callbacks) callback && callback(...args)
    }
}

export function mergeRefs<T>(...refs: (T | ((val: T) => void) | undefined)[]): ((el: T) => void) {
    return chain(refs as ((el: T) => void)[])
}

export function some(...signals: Accessor<unknown>[]) {
    return signals.some(signal => !!signal())
}
