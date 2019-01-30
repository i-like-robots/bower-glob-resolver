const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const glob = require('glob')

module.exports = function() {
  return {
    match(source) {
      return source.startsWith('glob:')
    },
    fetch({ source, name }) {
      const globPattern = source.replace(/^glob:/, '')
      const manifestFiles = glob.sync(globPattern, { absolute: true })
      const tempJSON = { name, dependencies: {} }

      manifestFiles.forEach((manifestFile) => {
        console.log('Loading external manifest from', manifestFile)
        const manifestJSON = require(manifestFile)
        tempJSON.dependencies[manifestJSON.name] = path.dirname(manifestFile)
      })

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
