
function parsePopulateString(pathAndSel) {
    const matches = pathAndSel.match(/([^[\]{}]+)(?:\[((?:\d+)(?::\d+)?)])?(?:{([^{}]+)+})?(?:\[((?:\d+)(?::\d+)?)])?/)

    const path = matches[1] || pathAndSel
    const skipAndLimit = (matches[4] || matches[2] || '0').split(':')
    const skip = (skipAndLimit.length > 1) ? parseInt(skipAndLimit[0]) : 0;
    const limit = (skipAndLimit.length > 1) ? parseInt(skipAndLimit[1]) : parseInt(skipAndLimit[0]);

    const select = matches[3] || ''
    let options = (limit > 0) ? {limit} : {}
    options = (skip > 0) ? {skip, ...options} : options

    let populate = (select !== '')? {path, select} : {path}

    if (Object.keys(options).length > 0) {
        populate = {options, ...populate}
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

