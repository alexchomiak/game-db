import { Test, Suite, BeforeEach, AfterEach, BeforeAll, AfterAll } from './Suite'
import { expect } from 'chai'

@Suite('Example')
export class Example {
    @BeforeEach
    beforeEach() {
        console.log('Before Each test.')
    }

    @AfterEach
    afterEach() {
        console.log('After Each Test.')
    }

    @BeforeAll
    beforeAll() {
        console.log('Before All.')
    }

    @AfterAll
    afterAll() {
        console.log('After All.')
    }

    @Test('2 + 2 = 4')
    twoPlusTwo() {
        expect(2 + 2).to.equal(4)
    }

    @Test('2 * 2 = 4')
    twoTimesTwo() {
        expect(2 * 2).to.equal(4)
    }

    @Test('2 * 3 = 5')
    failingTest() {
        expect(2 * 3).to.equal(5)
    }

    @Test('Async Test')
    async asyncTest() {
        const val = await new Promise(res => setTimeout(() => res(10), 1000))
        expect(val).to.equal(10)
    }
}
