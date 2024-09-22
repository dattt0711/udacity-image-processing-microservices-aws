import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidImageUrl, fetchImageBuffer} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async (req, res) => {
    const { image_url } = req.query;
     // Step 1: Validate the image_url query parameter
    if (!image_url) {
      return res.status(400).send({ message: 'Image URL is required' });
    }
    console.log(isValidImageUrl(image_url), 'isValidImageUrl(image_url)')
    if (!isValidImageUrl(image_url)) {
      return res.status(400).send({ message: 'Invalid image URL. Make sure the URL is correct and points to a valid image format (e.g., .jpg, .png).' });
    }

    try {
      // Step 2: Filter the image
      const imageBuffer = await fetchImageBuffer(image_url);
      const filteredImagePath = await filterImageFromURL(imageBuffer);
  
      // Step 3: Send the resulting file in the response
      res.sendFile(filteredImagePath, async (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).send({ message: 'Error processing the image' });
        }
  
        // Step 4: Delete the file after the response is finished
        try {
          await deleteLocalFiles([filteredImagePath]);
          console.log('Temporary file deleted:', filteredImagePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      });
    } catch (error) {
      console.error('Error filtering image:', error);
      res.status(500).send({ message: 'Error processing the image' });
    }
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
