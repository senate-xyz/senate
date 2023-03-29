import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node'
import { format, loggers } from 'winston'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
}

const defaultLoggerOptions = {
    format: format.combine(
        format.json(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.label({ label: 'proposal-detective' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.ms(),
        format.metadata(),
        format.errors({ stack: true })
    ),
    transports: [
        new AxiomTransport({
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
            orgId: process.env.AXIOM_ORG_ID
        })
        // new transports.Console()
    ]
}

const createLogger = (label: string) => {
    return {
        ...defaultLoggerOptions,
        format: format.combine(
            defaultLoggerOptions.format,
            format.label({ label })
        )
    }
}

const initLoggers = () => {
    const logLabels = [
        'proposal-detective',
        'refresher',
        'bulletin',
        'sanity',
        'prisma'
    ]
    logLabels.forEach((label) => {
        loggers.add(label, createLogger(label))
    })
}

initLoggers()

export const log_pd = loggers.get('proposal-detective')
export const log_ref = loggers.get('refresher')
export const log_bul = loggers.get('bulletin')
export const log_sanity = loggers.get('sanity')
export const log_prisma = loggers.get('prisma')
