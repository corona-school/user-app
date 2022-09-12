'use strict'

const fs = require('fs')

function parseTheme() {
  console.log('parse Theme.ts ...')
  fs.readFile('./src/Theme.ts', { encoding: 'utf-8' }, function (err, data) {
    if (err) {
      console.log(err)
      return
    }
    const hits = data.match(/^(?:const VAR_)+.*$/gm)

    const vars = []
    hits.forEach(hit => {
      let vhit = hit.replace('const ', '')
      vhit = vhit.split(' = ')

      const name = getCSSName(vhit[0]).toLowerCase()
      let val
      if (vhit[1].startsWith('VAR_')) {
        val = `var(${getCSSName(vhit[1]).toLowerCase()})`
      } else {
        val = vhit[1].replace(/'/g, '')
      }
      vars.push(`${name}: ${val}`)
    })

    const output = `html {
${parseVars(vars)}}`

    fs.writeFile(
      './src/web/scss/_generated.scss',
      output,
      { encoding: 'utf-8' },
      function (err) {
        if (err) console.log({ err })
        else console.log('Theme.ts parsed successfully!')
      }
    )
  })
}

function getCSSName(name) {
  let n = name
  n = n.replace('VAR_', '--')
  n = n.replace('_', '-')
  return n
}

function parseVars(vars) {
  let s = ''
  vars.forEach(v => (s += `  ${v};\n`))
  return s
}

module.exports = {
  parseTheme
}
