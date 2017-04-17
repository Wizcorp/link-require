#!/usr/bin/env node

'use strict'

// inspired by: https://gist.github.com/branneman/8048520

const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)

console.log("OHAI", process.cwd())
args.forEach(function (map) {
  const root = process.cwd()
  const data = map.split(':')
  const source = path.resolve(root, data[0])
  const rootNodeModules = path.resolve(root, 'node_modules')
  const destination = path.join(rootNodeModules, data[1])

  // Make sure that we create the link internally to the
  // module being installed
  fs.mkdirSync(rootNodeModules)

  function link() {
    fs.symlinkSync(source, destination, 'junction')
  }

  try {
    const stats = fs.lstatSync(destination)

    if (!stats.isSymbolicLink()) {
      throw new Error(`Folder ${destination} already exists; make sure you are not trying to overwrite a module!`)
    }

    // The link might have been changed; unlink and re-link ro be sure
    fs.unlinkSync(destination)
    link()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return link()
    }

    throw error
  }
})
