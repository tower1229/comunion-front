import dayjs from 'dayjs'
import { register } from 'timeago.js'
// import } from 'dayjs'

function localeFunc(number: number, index: number, totalSec?: number) {
  // number: the timeago / timein number;
  // index: the index of array below;
  // totalSec: total seconds between date to be formatted and today's date;
  const years: string[] = [
    dayjs.utc(new Date().getTime() - (totalSec || 0) * 1000).format('YYYY-MM-DD UTC'),
    dayjs.utc(new Date().getTime() - (totalSec || 0) * 1000).format('YYYY-MM-DD UTC')
  ]

  const result = [
    ['just now', 'right now'],
    ['%s seconds ago', 'in %s seconds'],
    ['1 minute ago', 'in 1 minute'],
    ['%s minutes ago', 'in %s minutes'],
    ['1 hour ago', 'in 1 hour'],
    ['%s hours ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    years,
    years,
    years
    // ['%s months ago', 'in %s months'],
    // ['1 year ago', 'in 1 year'],
    // ['%s years ago', 'in %s years']
  ][index]
  return result as [string, string]
}

export function comunionTimeAgo() {
  // register your locale with timeago
  register('comunionTimeAgo', localeFunc)
}
