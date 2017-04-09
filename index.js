// inspired by: https://gist.github.com/branneman/8048520

const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)

args.forEach(function (map) {
  let [
    source,
    destination
  ] = map.split(':');

  source = path.resolve(source)
  destination = path.join('node_modules', destination)

  function link() {
    fs.symlinkSync(source, destination)
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
