const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const glob = require('glob')

const SOURCE_PREFIX = 'glob:'
const SOURCE_SUFFIX = 'bower.json'

module.exports = function(bower) {
  return {
    match(source) {
      return source.startsWith(SOURCE_PREFIX) && source.endsWith(SOURCE_SUFFIX)
    },
    fetch({ name, source }) {
      const globPattern = source.replace(SOURCE_PREFIX, '')
      const manifestFiles = glob.sync(globPattern, { cwd: bower.config.cwd, absolute: true })
      const tempJSON = { name, dependencies: {} }

      manifestFiles.forEach((manifestFile) => {
        const manifestJSON = require(manifestFile)
        const manifestPath = path.dirname(manifestFile)

        log(`Adding dependency on ${manifestPath}`)
        tempJSON.dependencies[manifestJSON.name] = manifestPath
      })

      const tmpDir = tmp.dirSync()
      const outputJSON = JSON.stringify(tempJSON, null, 2)

      fs.writeFileSync(path.join(tmpDir.name, 'bower.json'), outputJSON)

      return {
        tempPath: tmpDir.name,
        removeIgnores: true
      }
    },
    releases() {
      // There are no versions to return but this method is required by `bower list`
      // At least one release is required for `bower install` but the version doesn't matter.
      return [{ target: 'v0.0.0', version: '0.0.0' }]
    }
  }

  function log(message) {
    bower.logger.info('glob-resolver', message)
  }
}
