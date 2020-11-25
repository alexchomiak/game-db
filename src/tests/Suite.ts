import Mocha, { Suite as S, Context, Test as T, Func, AsyncFunc } from 'mocha'
import { StringifyOptions } from 'querystring'
export const TestingInstance = new Mocha()
export const Test = (title: string) => {
    return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (Object.getOwnPropertyDescriptor(target, 'tests') == null) {
            Object.defineProperty(target, 'tests', {
                value: [{ fn: descriptor.value, title }]
            })
        } else
            (Object.getOwnPropertyDescriptor(target, 'tests').value as _Test[]).push({
                fn: descriptor.value,
                title
            })
        return descriptor
    }
}

export const BeforeEach = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__beforeEach__') == null)
        Object.defineProperty(target, '__beforeEach__', {
            value: descriptor.value
        })
    return descriptor
}

export const BeforeAll = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__beforeAll__') == null)
        Object.defineProperty(target, '__beforeAll__', {
            value: descriptor.value
        })
    return descriptor
}

export const AfterEach = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__afterEach__') == null)
        Object.defineProperty(target, '__afterEach__', {
            value: descriptor.value
        })
    return descriptor
}

export const AfterAll = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__afterAll__') == null)
        Object.defineProperty(target, '__afterAll__', {
            value: descriptor.value
        })
    return descriptor
}

interface _Test {
    fn: Mocha.AsyncFunc | Mocha.Func
    title: string
}

export const Suite = (title: string) => {
    return (target: new (...args: any) => any) => {
        const obj = new target()
        const suite = Mocha.Suite.create(TestingInstance.suite, title)
        if (obj.tests && obj.tests.length > 0)
            obj.tests.forEach((t: _Test) => {
                suite.addTest(new T(t.title, t.fn.bind(obj)))
            })

        if (obj.__beforeAll__) suite.beforeAll(obj.__beforeAll__)
        if (obj.__beforeEach__) suite.beforeEach(obj.__beforeEach__)
        if (obj.__afterAll__) suite.afterAll(obj.__afterAll__)
        if (obj.__afterEach__) suite.afterEach(obj.__afterEach__)

        return target
    }
}
