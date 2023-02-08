import { NumberValue, scaleTime } from 'd3-scale'

export const thresholdsTime =
    (n: number) => (min: Date | NumberValue, max: Date | NumberValue) =>
        scaleTime().domain([min, max]).ticks(n)
