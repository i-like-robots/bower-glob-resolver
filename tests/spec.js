const path = require('path')
const subject = require('../')

describe('bower-glob-resolver', () => {
  let instance

  beforeEach(() => {
    instance = subject()
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
    let result

    beforeEach(() => {
      const tmp = instance.fetch({
        name: 'component-dependencies',
        source: 'glob:./tests/fixture/components/*/bower.json'
      })

      result = require(path.join(tmp.tempPath, 'bower.json'))
    })

    it('creates a temporary package with the given name', () => {
      expect(result.name).toEqual('component-dependencies')
    })

    it('adds all glob matches as dependencies', () => {
      expect(Object.keys(result.dependencies)).toEqual(['footer-component', 'header-component'])
    })
  })
})
