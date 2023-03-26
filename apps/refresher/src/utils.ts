import { type NumberValue, scaleTime } from 'd3-scale'

export const thresholdsTime =
    (n: number) =>
    (
        _data: ArrayLike<Date>,
        min: Date | NumberValue,
        max: Date | NumberValue
    ) =>
        scaleTime().domain([min, max]).ticks(n)
