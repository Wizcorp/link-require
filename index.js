#!/usr/bin/env node

'use strict'

// inspired by: https://gist.github.com/branneman/8048520

const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const root = process.cwd()

args.forEach(function (map) {
  const data = map.split(':')

  if (data.length !== 2) {
    throw new Error('Argument must be "<string>:<string>"')
  }

  const rootNodeModules = path.resolve(root, 'node_modules')
  const absSource = path.resolve(root, data[0])
  const relSource = path.relative(rootNodeModules, absSource)
  const destination = path.join(rootNodeModules, data[1])

  // Make sure that we create the link internally to the
  // module being installed
  try {
    fs.accessSync(rootNodeModules)
  } catch (error) {
    fs.mkdirSync(rootNodeModules)
  }

  function link() {
    fs.symlinkSync(relSource, destination, 'junction')
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
