import Client from '@axiomhq/axiom-node'

declare global {
    // eslint-disable-next-line no-var
    var axiom: Client | undefined
}

export const axiom =
    global.axiom ||
    new Client({
        token: process.env.AXIOM_TOKEN,
        orgId: process.env.AXIOM_ORG_ID
    })

if (process.env.NODE_ENV != 'production') global.axiom = axiom
