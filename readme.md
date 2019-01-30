# Bower Glob Resolver

A [resolver plugin] for [Bower] which enables the use of multiple, external `bower.json` files in your project which can be found using a [glob pattern].

[resolver plugin]: https://bower.io/docs/pluggable-resolvers/
[Bower]: https://bower.io/
[glob pattern]: https://www.npmjs.com/package/glob#glob-primer


## Installation

This is a [Node.js] module available through the [npm] registry. Before installing, download and install Node.js. Node.js 8 or higher is required.

Installation is done using the [npm install] command:

```sh
$ npm install --save-dev bower-glob-resolver
```

After installing this package you will need create or amend Bower's `.bowerrc` [configuration file] to declare the newly installed resolver:

```diff
  "resolvers": [
+    "bower-glob-resolver"
  ]
}
```

[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally
[configuration file]: https://bower.io/docs/config/


## Usage

This resolver will be used whenever a dependency's source begins with `glob:`. The value after this prefix should be a valid [glob pattern] ending `bower.json`. For example, a project could contain multiple component packages using this folder structure:

```
my-project/
├── components/
│   ├── header/
│   │   └── bower.json
│   └── footer/
│       └── bower.json
├── .bowerrc
└── bower.json
```

Using `bower-glob-resolver` it is possible to install all of the dependencies needed for every component package by adding a source by adding a new dependency with a glob source (the name doesn't matter):

```json
{
  "dependencies": {
    "all-component-dependencies": "glob:components/*/bower.json"
  }
}
```


### License

This package is MIT licensed.
