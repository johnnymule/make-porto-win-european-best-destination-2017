/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const OPEN_PAGE_TIMEOUT = process.env.OPEN_PAGE_TIMEOUT || 120000
const EXECUTION_TIMEOUT = process.env.EXECUTION_TIMEOUT || 90000
const PROXY = process.env.PROXY

const POLLDADDY_POLL_URL = 'https://www.app.com/story/sports/high-school/soccer/2019/10/30/nj-girls-soccer-vote-shore-conference-player-week/2503108001/'
const POLLDADDY_POLL_ID = '10445611'
const POLLDADDY_POLL_OPTION_ID = '48220374'

const _ = require('lodash')

const Logger = require('modern-logger')

const Pollmommy = require('pollmommy')

const defaultOptions = {
  pollmommy: {
    nightmare: {
      gotoTimeout: OPEN_PAGE_TIMEOUT,
      executionTimeout: EXECUTION_TIMEOUT
    }
  }
}

class VotingPoll {
  constructor (options = {}) {
    this._options = _.defaultsDeep({}, options, defaultOptions)

    if (PROXY) {
      _.set(this._options.pollmommy, 'nightmare.switches.proxy-server', PROXY)
    }

    this._pollmommy = new Pollmommy(this._options.pollmommy)
  }

  vote () {
    const startDate = _.now()

    return Logger.debug('Started voting')
      .then(() => this._pollmommy.vote(POLLDADDY_POLL_URL, POLLDADDY_POLL_ID, POLLDADDY_POLL_OPTION_ID))
      .then((geoip = {}) => {
        const stopDate = _.now()
        const duration = _.round((stopDate - startDate) / 1000, 1)
        const ipAddress = geoip.ip || `:thinking_face: `
        const country = _.lowerCase(geoip.country)
        const emojiFlag = `:flag-${country}: `

        Logger.info(`Voted for Sara from ${ipAddress} ${ipAddress ? 'in ' + emojiFlag : ''} (took ${duration} ms)`)
      })
      .finally(() => Logger.debug('Finished voting'))
  }
}

module.exports = new VotingPoll()
