import {buildDivePath} from './divePath'

describe('buildDivePath', () => {
    it('should be able to dive into depth', () => {
        const path = 'aaa/bbb/ccc/ddd'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa', 
            populate: {
                path: 'bbb',
                populate: {
                    path: 'ccc',
                    populate: {
                        path: 'ddd'
                    }
                }
            }

        })
    })

    it('should build populate options with select', () => {
        const path = 'aaa{xa,ya}/bbb{xb,yb}'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa', select: 'xa,ya',
            populate: {
                path: 'bbb', select: 'xb,yb'
            }
        })
    })

    it('should build populate options with limit', () => {
        const path = 'aaa[123]/bbb[456]'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa', options: {limit: 123},
            populate: {
                path: 'bbb', options: {limit: 456}
            }
        })
    })

    it('should build populate options with limit and select', () => {
        const path = 'aaa[123]{xa,ya}/bbb[456]{xb,yb}'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa', options:{limit: 123}, select: 'xa,ya',
            populate: {
                path: 'bbb', options:{limit: 456}, select: 'xb,yb'
            }
        })
    })

    it('should build populate options with select and limit', () => {
        const path = 'aaa{xa,ya}[123]/bbb{xb,yb}[456]'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa', options:{limit: 123}, select: 'xa,ya',
            populate: {
                path: 'bbb', options:{limit: 456}, select: 'xb,yb'
            }
        })
    })


    it('should accept path array', () => {
        const paths = ['aaa/bbb', 'xxx/yyy']
        expect(buildDivePath(paths)).toEqual([
            {path: 'aaa', populate: {path: 'bbb'}},
            {path: 'xxx', populate: {path: 'yyy'}}
        ])
    })

    it('should accept one layer path', () => {
        const path = 'aaa'
        expect(buildDivePath(path)).toEqual({
            path: 'aaa'
        })
    })
})
