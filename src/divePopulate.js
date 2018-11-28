import {buildDivePath} from './divePath.js'

export default function divePopulate (schema) {
    schema.method('diveTo', function (path) {
        const divePath = buildDivePath(path)

        this.populate(divePath)
        return this
    })
}
