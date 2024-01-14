const fs = require('fs');
const path = require('path');

function printTree(directory, depth, currentDepth = 0) {
    const entries = fs.readdirSync(directory);

    entries.forEach((entry, index) => {
        const entryPath = path.join(directory, entry);
        const isDirectory = fs.statSync(entryPath).isDirectory();

        const prefix = '| '.repeat(currentDepth);
        const connector = index === entries.length - 1 ? '└── ' : '├── ';

        console.log(prefix + connector + entry);

        if (isDirectory && currentDepth < depth) {
            printTree(entryPath, depth, currentDepth + 1);
        }
    });
}

function countFilesAndDirectories(directory) {
    const entries = fs.readdirSync(directory);
    const numDirectories = entries.filter(entry => fs.statSync(path.join(directory, entry)).isDirectory()).length;
    const numFiles = entries.filter(entry => fs.statSync(path.join(directory, entry)).isFile()).length;
    return { numDirectories, numFiles };
}

function main() {
    const args = process.argv.slice(2);

    if (!args.length) {
        console.error('Usage: node tree.js <directory> [-d <depth>]');
        return;
    }

    const directory = args[0];
    const depthOptionIndex = args.indexOf('-d');
    const depth = depthOptionIndex !== -1 ? parseInt(args[depthOptionIndex + 1]) : Infinity;

    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
        console.error(`Error: '${directory}' is not a valid directory.`);
        return;
    }

    console.log(directory);
    printTree(directory, depth);

    const { numDirectories, numFiles } = countFilesAndDirectories(directory);
    console.log(`\n${numDirectories} directories, ${numFiles} files`);
}

module.exports = main