export default {
  GENERAL: {
    batchLimit: 1,
  },
  SOUNDCLOUD: {
    credentials: {
      id: process.env.SOUNDCLOUD_CREDENTIALS_ID,
      secret: process.env.SOUNDCLOUD_CREDENTIALS_SECRET,
    },
  },
  VIDEO: {
    bgImage: 'src/img/video-bg.jpeg',
  },
  YOUTUBE: {
    switchChannelUrl: process.env.YOUTUBE_SWITCH_CHANNEL_URL,
    credentials: {
      email: process.env.YOUTUBE_LOGIN_EMAIL,
      password: process.env.YOUTUBE_LOGIN_PASSWORD,
    },
  },
}
