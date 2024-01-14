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

function getAllFiles(dir, depth) {
    let currentDepth = 0;
    return fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        
        if (isDirectory && currentDepth < depth) {
            currentDepth++;
            return [...files, ...getAllFiles(name)];
        }

        return [...files, name];
    }, []);
}

function countFilesAndDirectories(directory, depth = 0) {
    const entries = getAllFiles(directory, depth);
    const numDirectories = entries.filter(entry => fs.statSync(entry).isDirectory()).length;
    const numFiles = entries.filter(entry => fs.statSync(entry).isFile()).length;
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

    const { numDirectories, numFiles } = countFilesAndDirectories(directory, depth);
    console.log(`\n${numDirectories} directories, ${numFiles} files`);
}

module.exports = main