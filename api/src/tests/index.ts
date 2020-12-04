import { readdirSync } from 'fs'

// * Enabled Tests
const files: string[] = readdirSync('src/tests/')
    .filter(f => f.endsWith('.test.ts'))
    .map(f => `./${f}`)

import { exit } from 'process'
// * Run test suite
import { TestingInstance } from './Suite'
// console.clear()
;(async () => {
    const imports = []
    for (let i = 0; i < files.length; i++) {
        imports.push(import(files[i]))
    }

    await Promise.all(imports)

    TestingInstance.run(failures => {
        if (failures > 0) exit(1)
        else exit(0)
    })
})()
