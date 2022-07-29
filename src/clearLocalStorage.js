import * as fs from 'fs';
import 'dotenv/config'

const localPath = process.env.LOCAL_STORAGE
console.log("localPath " + localPath);
// Using the recursive option to delete
// multiple directories that are nested
fs.rm(localPath, { recursive: true, }, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Recursive: Directories Deleted!");
        fs.mkdir(localPath, (err) => { console.log(err) });
    }
})