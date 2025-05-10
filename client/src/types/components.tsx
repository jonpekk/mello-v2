import type { ComponentProps, JSX } from "react";

export type ComponentWithProps<T, P extends keyof JSX.IntrinsicElements = 'div'> = ComponentProps<P> & T