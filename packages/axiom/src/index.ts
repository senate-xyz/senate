import { WinstonTransport as AxiomTransport } from '@axiomhq/axiom-node'
import { Logger, createLogger, format, transports, loggers } from 'winston'

declare global {
    // eslint-disable-next-line no-var
    var logger: Logger | undefined
}

const logger =
    global.logger ||
    createLogger({
        format: format.combine(
            format.json(),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.ms()
        ),
        transports: [
            new AxiomTransport({
                dataset: process.env.AXIOM_DATASET,
                token: process.env.AXIOM_TOKEN,
                orgId: process.env.AXIOM_ORG_ID
            }),
            new transports.Console()
        ]
    })

loggers.add('proposal-detective', {
    format: format.combine(
        format.json(),
        format.label({ label: 'proposal-detective' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.ms()
    ),
    transports: [
        new AxiomTransport({
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
            orgId: process.env.AXIOM_ORG_ID
        }),
        new transports.Console()
    ]
})

loggers.add('refresher', {
    format: format.combine(
        format.json(),
        format.label({ label: 'refresher' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.ms()
    ),
    transports: [
        new AxiomTransport({
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
            orgId: process.env.AXIOM_ORG_ID
        }),
        new transports.Console()
    ]
})

loggers.add('bulletin', {
    format: format.combine(
        format.json(),
        format.label({ label: 'bulletin' }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.ms()
    ),
    transports: [
        new AxiomTransport({
            dataset: process.env.AXIOM_DATASET,
            token: process.env.AXIOM_TOKEN,
            orgId: process.env.AXIOM_ORG_ID
        }),
        new transports.Console()
    ]
})

export const log_pd = loggers.get('proposal-detective')
export const log_ref = loggers.get('refresher')
export const log_bul = loggers.get('bulletin')
