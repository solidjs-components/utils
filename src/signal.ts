import { type Accessor, type Setter, type Signal, createSignal, untrack } from 'solid-js'

export interface CreateControllableSignalProps<T> {
    value?: Accessor<T | undefined>
    initialValue?: T
    onChange?: (value: T) => void
}

export function createControllableSignal<T>(props: CreateControllableSignalProps<T>): Signal<T | undefined> {
    const [uncontrolledSignal, setUncontrolledSignal] = createSignal(props.initialValue)

    const isControlled = () => props.value?.() !== undefined
    const value = () => isControlled() ? (props.value?.() as T) : uncontrolledSignal()

    const setValue: Setter<T | undefined> = (next?: unknown) => {
        return untrack(() => {
            let nextValue: Exclude<T, Function>
            if (typeof next === 'function') {
                nextValue = next(value()) as Exclude<T, Function>
            }
            else {
                nextValue = next as Exclude<T, Function>
            }

            if (!Object.is(nextValue, value())) {
                if (!isControlled()) {
                    setUncontrolledSignal(nextValue)
                }
                props.onChange?.(nextValue)
            }
            return nextValue as never
        })
    }

    return [value, setValue]
}
