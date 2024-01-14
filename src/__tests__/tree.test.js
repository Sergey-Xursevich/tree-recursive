const fs = require('fs');
const path = require('path');
const main = require('../tree');

let consoleLogSpy;
let consoleErrorSpy;
const originalArgv = process.argv;

describe('Tree recursive feature', () => {
    beforeEach(() => {
        consoleLogSpy = jest.spyOn(global.console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation();
    });

    afterEach(() => {
        process.argv = originalArgv;
        jest.restoreAllMocks();
    });

    it('should handle invalid directory', () => {
        // Arrange
        const invalidDirectory = 'nonexistent_directory';
        process.argv = [undefined, undefined, invalidDirectory];

        // Act
        main();

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith(`Error: '${invalidDirectory}' is not a valid directory.`);
    });

    it('should print tree for a valid directory', () => {
        // Arrange
        const mockReaddirSync = jest.spyOn(fs, 'readdirSync');
        mockReaddirSync.mockReturnValue(['file1.txt', 'file2.txt']);

        const mockStatExistsSync = jest.spyOn(fs, 'existsSync');
        mockStatExistsSync.mockReturnValue(true);

        const mockStatSync = jest.spyOn(fs, 'statSync');
        mockStatSync.mockReturnValue({
            isDirectory: () => true,
            isFile: () => false
        });


        const pathToDirectory = 'path/to/directory';
        process.argv = [undefined, undefined, pathToDirectory, '-d', '0'];

        // Act
        main();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith(pathToDirectory);
        expect(consoleLogSpy).toHaveBeenCalledWith('├── file1.txt');
        expect(consoleLogSpy).toHaveBeenCalledWith('└── file2.txt');
    });

    it('should handle console error when we doesn\'t pass any args', () => {
        // Arrange
        const message = 'Usage: node tree.js <directory> [-d <depth>]';
        process.argv = [];

        // Act
        main();

        // Assert
        expect(consoleErrorSpy).toHaveBeenCalledWith(message);
    });
});