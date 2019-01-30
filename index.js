const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const glob = require('glob')

const PATTERN = /^glob:/

module.exports = function() {
  return {
    match(source) {
      return PATTERN.test(source)
    },
    fetch({ source, name }) {
      const globPattern = source.replace(PATTERN, '')
      const manifestFiles = glob.sync(globPattern, { absolute: true })
      const tempJSON = { name, dependencies: {} }

      if (manifestFiles.length) {
        log(`External manifests found for glob pattern "${globPattern}"`)

        manifestFiles.forEach((manifestFile) => {
          log(`Using external manifest from: ${manifestFile}`)
          const manifestJSON = require(manifestFile)
          tempJSON.dependencies[manifestJSON.name] = path.dirname(manifestFile)
        })
      }

      const outputJSON = JSON.stringify(tempJSON, null, 2)

      const tmpDir = tmp.dirSync()
      fs.writeFileSync(path.join(tmpDir.name, 'bower.json'), outputJSON)

      return {
        tempPath: tmpDir.name,
        removeIgnores: true
      }
    }
  }
}

function log(message) {
  const prefix = '\u001B[33m'
  const suffix = '\u001B[39m'
  console.warn(prefix + 'bower-glob-resolver: ' + message + suffix)
}
