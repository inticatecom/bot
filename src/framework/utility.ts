// Resources
import {pino} from "pino";
import * as fs from "fs/promises";
import * as path from "path";

// Definitions
import * as Types from "./definitions";

/**
 * A modification of the base JavaScript logger to provide a more detailed and prettified output.
 *
 * @example
 * console.info("This is an info message");
 */
export const console = pino({
    level: "trace",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            colorizeObjects: true,
        },
    },
});

/**
 * Fetches all files recursively from a directory with a specific extension. Recursively means that if the program
 * finds a directory inside a directory, it will run itself again on that directory.
 * @param directory The directory's relative or absolute path.
 * @param extension The extension to filter the result for, will default to '.ts' if not provided.
 * @returns An array of all the paths of the found files.
 *
 * @example
 * const files = await fetchFilesFromDir("./src", ".ts");
 * console.log(files);
 */
export async function fetchFilesFromDir(directory: string, extension: Types.Extension = ".ts"): Promise<string[]> {
    const fetched: string[] = []; // Create an array we can push to and then return later.
    const files = await fs.readdir(directory, {withFileTypes: true}); // Read all the files from the directory provided.

    // Loop through each file that was found.
    for (const file of files) {
        const filePath = path.resolve(directory, file.name); // Resolve the file path.
        if (file.isDirectory()) {
            fetched.push(...(await fetchFilesFromDir(filePath, extension))); // If it's a directory, run the function again on that directory.
        } else if (filePath.endsWith(".ts")) {
            fetched.push(filePath); // If the file ends with the provided extension, push it to the array.
        }
    }

    return fetched; // Return the array of found files.
}