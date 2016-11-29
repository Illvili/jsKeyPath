import { jsKeyPath } from '../src/jsKeyPath'

describe('Basic Test', function () {
    it('Should be defined', function () {
        expect(jsKeyPath).toBeDefined()
    })

    it('Should has some methods', function () {
        expect(jsKeyPath.getValue).toBeDefined('getValue is undefined')
        expect(jsKeyPath.setValue).toBeDefined('setValue is undefined')
        expect(jsKeyPath.toPlainObject).toBeDefined('toPlainObject is undefined')
    })
})

describe('Functional Test', function () {
    it('Should get right value from object', function () {
        var testObj = {
            a: 1, b: 2.0, c: 'test value',
            d: {
                e: false,
                f: {
                    g: 'deep value'
                }
            },
            0: 1, 1: 2,
            arr: [ 0, 1, 2, false ]
        }

        expect(jsKeyPath.getValue(testObj, 'a')).toBe(1)
        expect(jsKeyPath.getValue(testObj, 'b')).toBe(2.0)
        expect(jsKeyPath.getValue(testObj, 'c')).toBe('test value')
        expect(jsKeyPath.getValue(testObj, 'd')).toBeDefined()
        expect(jsKeyPath.getValue(testObj, 'd.e')).toBe(false)
        expect(jsKeyPath.getValue(testObj, 'd.f.g')).toBe('deep value')
        expect(jsKeyPath.getValue(testObj, '0')).toBe(1)
        expect(jsKeyPath.getValue(testObj, '1')).toBe(2)
        expect(jsKeyPath.getValue(testObj, 'arr')).toEqual([ 0, 1, 2, false ])
        expect(jsKeyPath.getValue(testObj, '')).toBeUndefined()
        expect(jsKeyPath.getValue(testObj, 'x')).toBeUndefined()
    })

    it('Should set right value to object', function () {
        var testObj = {
            a: 1, b: 2.0, c: 'test value',
            d: {
                e: false,
                f: {
                    g: 'deep value'
                }
            },
            0: 1, 1: 2,
            arr: [ 0, 1, 2, false ],
            q: undefined
        }

        var kpValues = jsKeyPath.toPlainObject(testObj)
        expect(Object.keys(kpValues).length).toBe(9)

        expect(kpValues['a']).toBe(1)
        expect(kpValues['b']).toBe(2.0)
        expect(kpValues['c']).toBe('test value')
        expect(kpValues['d.e']).toBe(false)
        expect(kpValues['d.f.g']).toBe('deep value')
        expect(kpValues['0']).toBe(1)
        expect(kpValues['1']).toBe(2)
        expect(kpValues['arr']).toBe('[0,1,2,false]')
        expect(kpValues.hasOwnProperty('q')).toBe(true)
        expect(kpValues['q']).toBeUndefined()
    })

    it('Should return keyPath: value object', function () {
        var testObj = { }

        jsKeyPath.setValue(testObj, 'a', 1)
        expect(testObj['a']).toBe(1)

        jsKeyPath.setValue(testObj, 'b', 2.0)
        expect(testObj['b']).toBe(2.0)

        jsKeyPath.setValue(testObj, 'c', 'test value')
        expect(testObj['c']).toBe('test value')

        jsKeyPath.setValue(testObj, 'd.e', false)
        expect(testObj['d']).toBeDefined()
        expect(testObj['d']['e']).toBe(false)

        jsKeyPath.setValue(testObj, 'd.f.g.h', 'deep value')
        expect(testObj['d']).toBeDefined()
        expect(testObj['d']['f']).toBeDefined()
        expect(testObj['d']['f']['g']).toBeDefined()
        expect(testObj['d']['f']['g']['h']).toBe('deep value')
        expect(testObj['d']['e']).toBe(false, 'd.e should keep as-is')

        jsKeyPath.setValue(testObj, '0', 1)
        expect(testObj['0']).toBe(1)

        jsKeyPath.setValue(testObj, '1', 2)
        expect(testObj['1']).toBe(2)

        var arr = [ 0, 1, 2, false ]
        jsKeyPath.setValue(testObj, 'arr', arr)
        expect(testObj['arr']).toEqual(arr)
        expect(arr).toEqual([ 0, 1, 2, false ], 'original value should not change')

        expect(testObj['']).toBeUndefined()
        expect(testObj['x']).toBeUndefined()
    })
})
