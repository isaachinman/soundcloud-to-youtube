// Unfortunately this approach is necessary when
// using babel - node and dotenv together
// https://github.com/motdotla/dotenv/issues/89

import dotenv from 'dotenv'

dotenv.config({ silent: true })
