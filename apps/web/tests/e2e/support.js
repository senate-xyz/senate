import * as path from 'path'
const synpressPath = path.join(
    process.cwd(),
    '/node_modules/@synthetixio/synpress'
)

module.exports = {
    extends: `${synpressPath}/.eslintrc.js`,
}
