# Bower Glob Resolver

A [resolver plugin] for [Bower] which enables the use of multiple, external `bower.json` files in your project which can be found using a [glob pattern]. This is ideal for codebases which contain multiple packages or components.

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

This resolver will be used whenever a dependency's source begins with `glob:`. The value after this prefix must be a valid [glob pattern] ending with `bower.json`.

For example, a project containing multiple components may use this folder structure:

```
my-project/
├── components/
│   ├── footer/
│   │   └── bower.json
│   └── header/
│       └── bower.json
├── .bowerrc
└── bower.json
```

To install all of the Bower dependencies for every component in the project a new dependency must be added to the root `bower.json` file (the name doesn't matter so long as it is unique.) The source of this dependency should be a glob pattern matching the `bower.json` files for each component:

```json
{
  "dependencies": {
    "all-component-dependencies": "glob:components/*/bower.json"
  }
}
```

If successful when running `bower install` this resolver will log each extra `bower.json` file it finds and uses:

```bash
$ bower install
> bower-glob-resolver: External manifests found matching the pattern "components/*/bower.json"
> bower-glob-resolver: Using external manifest from: /my-project/components/footer/bower.json
> bower-glob-resolver: Using external manifest from: /my-project/components/header/bower.json
```


## How it works

This resolver works by creating a temporary package which has dependencies on all of the packages found by the glob match.


### License

This package is MIT licensed.
