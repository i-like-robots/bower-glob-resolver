const path = require('path')
const rimraf = require('rimraf')
const subject = require('../')

describe('bower-glob-resolver', () => {
  let bower
  let instance

  beforeEach(() => {
    bower = {
      config: {
        cwd: process.cwd()
      },
      logger: jasmine.createSpyObj('logger', ['info', 'warn', 'error'])
    }

    instance = subject(bower)
  })

  describe('#match', () => {
    it('matches sources prefixed with "glob:" and ending "bower.json"', () => {
      expect(instance.match('glob:path/to/packages/bower.json')).toEqual(true)
    })

    it('does not match sources not starting with "glob:"', () => {
      expect(instance.match('path/to/packages/bower.json')).toEqual(false)
    })

    it('does not match sources not ending with "bower.json"', () => {
      expect(instance.match('glob:path/to/packages')).toEqual(false)
    })
  })

  describe('#fetch', () => {
    let temp
    let result

    beforeEach(() => {
      temp = instance.fetch({
        name: 'components',
        source: 'glob:./tests/fixture/components/*/bower.json'
      })

      result = require(path.join(temp.tempPath, 'bower.json'))
    })

    afterEach(() => {
      // The cleanup callback returned by tmp is not recursive so use rimraf
      rimraf.sync(temp.tempPath)
    })

    it('creates a temporary package with the given name', () => {
      expect(result.name).toEqual('components')
    })

    it('logs each match found', () => {
      expect(bower.logger.info).toHaveBeenCalledTimes(2)
    })

    it('adds all glob matches as dependencies', () => {
      expect(Object.keys(result.dependencies)).toEqual(['footer', 'header'])
    })
  })
})
