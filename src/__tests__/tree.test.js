const fs = require('fs');
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

    it('should print tree for a valid directory with depth argument', () => {
        // Arrange
        const mockReaddirSync = jest.spyOn(fs, 'readdirSync');
        mockReaddirSync.mockReturnValueOnce(['subdir1', 'subdir2']);
        mockReaddirSync.mockReturnValueOnce(['file1.txt', 'file2.txt']);
        mockReaddirSync.mockReturnValueOnce(['subdir1', 'subdir2']);
        mockReaddirSync.mockReturnValueOnce(['file1.txt', 'file2.txt']);
        mockReaddirSync.mockReturnValueOnce(['subdir1', 'subdir2']);
        mockReaddirSync.mockReturnValueOnce(['file1.txt', 'file2.txt']);

        const mockStatExistsSync = jest.spyOn(fs, 'existsSync');
        mockStatExistsSync.mockReturnValue(true);

        const mockStatSync = jest.spyOn(fs, 'statSync');
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });

        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => false });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });
        mockStatSync.mockReturnValueOnce({ isDirectory: () => true });

        mockStatSync.mockReturnValueOnce({ isFile: () => false });
        mockStatSync.mockReturnValueOnce({ isFile: () => true });
        mockStatSync.mockReturnValueOnce({ isFile: () => true });
        mockStatSync.mockReturnValueOnce({ isFile: () => false });

        const pathToDirectory = 'path/to/directory';
        process.argv = [undefined, undefined, pathToDirectory, '-d', '1'];

        // Act
        main();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith('path/to/directory');
        expect(consoleLogSpy).toHaveBeenCalledWith('├── subdir1');
        expect(consoleLogSpy).toHaveBeenCalledWith('| ├── file1.txt');
        expect(consoleLogSpy).toHaveBeenCalledWith('| └── file2.txt');
        expect(consoleLogSpy).toHaveBeenCalledWith('└── subdir2');
    });
});