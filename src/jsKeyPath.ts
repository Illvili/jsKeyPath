export class jsKeyPath {
    private static mergeObj(oldObj, newObj, deep = true) {
        // copy oldObj
        var obj = JSON.parse(JSON.stringify(oldObj))

        for (var key in newObj) {
            var oldType = typeof oldObj[key]
            var newType = typeof newObj[key]

            if (oldType != newType || !deep || 'object' != oldType) {
                // not same type or not deep mode or type is not object, replace
                obj[key] = newObj[key]
            } else {
                // deep mode and same type and is object, recursive merge
                obj[key] = arguments.callee(oldObj[key], newObj[key], true)
            }
        }

        return obj
    }

    public static getValue(obj: Object, keyPath: string) {
        // not an object or keyPath is empty
        if (typeof obj != 'object' || !keyPath) {
            return undefined
        }

        return keyPath.split('.').reduce((o, k) => {
            if (!o || typeof o[k] == 'undefined') {
                return undefined
            }

            return o[k]
        }, obj)
    }

    public static setValue(obj: Object, keyPath: string, value) {
        // not an object or keyPath is empty
        if (typeof obj != 'object' || !keyPath) {
            return
        }

        var [firstKey, ...otherKeys] = keyPath.split('.')
        var tempValue = value

        if (!!otherKeys.length) {
            tempValue = otherKeys.reduceRight((o, k) => {
                var tempObj = {}
                tempObj[k] = o

                return tempObj
            }, value)
        }

        if (typeof tempValue == 'object' && typeof obj[firstKey] == 'object') {
            obj[firstKey] = this.mergeObj(obj[firstKey], tempValue)
        } else {
            obj[firstKey] = tempValue
        }
    }

    public static toPlainObject(obj: Object, prefix: string = ''): Object {
        var tempObj = {}

        for (var _ in obj) {
            var key = (prefix ? prefix + '.' : '') + _,
                value = obj[_],
                type = typeof value

            if (type == 'object') {
                if (value instanceof Array) {
                    tempObj[key] = JSON.stringify(value)

                    continue
                }

                tempObj = this.mergeObj(tempObj, this.toPlainObject(value, key))
            } else {
                tempObj[key] = value
            }
        }

        return tempObj
    }
}
