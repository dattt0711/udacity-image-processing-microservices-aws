import fs from "fs";
import Jimp from "jimp";
import axios from 'axios';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Fetch image as buffer using axios
export async function fetchImageBuffer (url)  {
  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data, 'binary');
};

// Helper function to validate image URL using regex
export function isValidImageUrl  (image_url) {
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|bmp|gif|tiff))$/i;
  return urlRegex.test(image_url);
};


// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
