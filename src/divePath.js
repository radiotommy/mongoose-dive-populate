
function parsePopulateString(pathAndSel) {
    const matches = pathAndSel.match(/([^[\]{}]+)(?:\[(\d+)\])?(?:{([^{}]+)+})?(?:\[(\d+)\])?/)
    const path = matches[1] || pathAndSel
    const limit = parseInt(matches[4] || matches[2] || 0)
    const select = matches[3] || ''

    let populate = (limit > 0)
        ? {path, options:{limit}}
        : {path}
    if (select !== '') {
        populate = {select, ...populate}
    }
    return populate
}

/**
 * Build a deep populate path from a url like string.
 * Example:
 *  "aaaa/bbbb" turn to {path: "aaaa", populate:{path: "bbbb"}}
 * 
 * @param {*} path 
 */
function buildOneDivePath(path) {
    const steps = Array.isArray(path) ? path : (path || '').split('/')
    const [first, ...rest] = steps

    let populateOptions = parsePopulateString(first)

    if (rest.length > 0) {
        populateOptions = {...populateOptions, populate: buildOneDivePath(rest)}
    }
    return populateOptions
}

/**
 * Build a populate path from one or multipule url like string.
 * 
 * @param {*} paths    a path string or an array of path string
 */
export function buildDivePath (paths) {
    return (Array.isArray(paths))
        ? paths.map(path => buildOneDivePath(path))
        : buildOneDivePath(paths)
}

