/* Entry point */

// Inject environment
import 'utils/env'

import { downloadFromSoundCloud, uploadToYouTube } from 'services'
import fs from 'fs'
import logger from 'utils/logger'
import rimraf from 'rimraf'

logger.info('Starting procedure.')

// Remove old temp dir if it exists
rimraf.sync('tmp')

// Create new temp dir
fs.mkdirSync('tmp')

downloadFromSoundCloud()
  .then((arrayOfVideoFiles) => {
    uploadToYouTube(arrayOfVideoFiles)
  })
