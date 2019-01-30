const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const glob = require('glob')

const PATTERN = /^glob:/

module.exports = function(bower) {
  return {
    match(source) {
      return PATTERN.test(source)
    },
    fetch({ source, name }) {
      const globPattern = source.replace(PATTERN, '')
      const manifestFiles = glob.sync(globPattern, { absolute: true })
      const tempJSON = { name, dependencies: {} }

      manifestFiles.forEach((manifestFile) => {
        const manifestJSON = require(manifestFile)
        const packagePath = path.dirname(manifestFile)

        log(`Adding dependency on ${packagePath}`)
        tempJSON.dependencies[manifestJSON.name] = packagePath
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

  function log(message) {
    if (bower && bower.logger) {
      bower.logger.info('glob-resolver', message)
    }
  }
}
