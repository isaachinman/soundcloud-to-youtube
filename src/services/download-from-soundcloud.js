/*
There are three basic steps to perform here:
  1. Retrieve tracks from SoundCloud
  2. Download each of those tracks as as mp3
  3. Encode a video for each track, using the previously created mp3 as an audio source
*/

// Dependencies
import config from 'config'
import cmd from 'node-cmd'
import fs from 'fs'
import logger from 'utils/logger'
import sanitiseFilename from 'sanitize-filename'
import SC from 'node-soundcloud'
import request from 'request'

// Track fetch function
const fetchTrackData = () => {

  // Initialise SoundCloud client
  SC.init(config.SOUNDCLOUD.credentials)

  const tracksToDownload = []

  return new Promise((resolve, reject) => {

    SC.get('/tracks', (err, tracks) => {

      if (err) {

        logger.error(`Soundcloud get tracklist error: ${err}.`)
        reject(err)

      } else {

        let iterator = 0

        logger.info(`Batch size is ${config.GENERAL.batchLimit}.`)
        logger.info(`Found ${tracks.filter(t => t.downloadable).length} downloadable tracks from SoundCloud.`)

        tracks.forEach((track) => {
          if (track.downloadable && iterator < config.GENERAL.batchLimit) {

            iterator += 1
            tracksToDownload.push(track)

          }

        })

        resolve(tracksToDownload)

      }
    })
  })
}

// Write mp3 function
const writeTracksToMp3s = tracks =>

  Promise.all(tracks.map(track =>

    new Promise((resolve, reject) => {

      logger.info(`Starting download: ${track.title}`)

      const filePath = `${process.env.PWD}/tmp/${sanitiseFilename(track.title)} - ${sanitiseFilename(track.user.username)}.${track.original_format}`

      request.get(`${track.download_url}?client_id=fbca4d02c0573ff483d8dd1e404a1d2f`, { timeout: 5000 })
        .on('error', (err) => {
          reject(new Error('Download error: ', err))
        })
        .on('end', () => {

          logger.info('Download complete: ', track.title)
          resolve({
            duration: track.duration / 1000,
            artist: track.user.username,
            title: track.title,
            path: filePath,
            format: track.original_format,
          })

        })
        .pipe(fs.createWriteStream(filePath))

    }),
  ))


// Encode video function
const encodeMp3sToVideo = mp3s =>

  Promise.all(mp3s.map((file) => {

    logger.info(`Encoding video: ${file.title}`)

    return new Promise((resolve, reject) => {

      const path = `tmp/${sanitiseFilename(file.title)} ${sanitiseFilename(file.artist)}.avi`

      cmd.get(
        `ffmpeg -loop 1 -r 1 -i ${config.VIDEO.bgImage} -i "${file.path}" -c:a copy -shortest "${path}" -threads 0`,
        (err) => {
          if (err) reject(err)
          resolve(Object.assign({}, file, {
            path,
          }))
        },
      )

    })
  }))


export default function downloadFromSoundCloud() {

  return new Promise((resolve, reject) => {
    fetchTrackData()
      .then(tracks => writeTracksToMp3s(tracks))
      .then(mp3s => encodeMp3sToVideo(mp3s))
      .then(arrayOfVideoFiles => resolve(arrayOfVideoFiles))
      .catch(error => reject(error))
  })

}

