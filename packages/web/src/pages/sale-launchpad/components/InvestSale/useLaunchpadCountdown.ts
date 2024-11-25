/**
 * 募资倒计时
 */

import dayjs from 'dayjs'
import { ref, reactive, watchEffect } from 'vue'
import { SaleCrowdfundingStatus } from '../../utils'

export default function useLaunchpadCountdown(
  start_time: number,
  end_time: number,
  status: number
) {
  const numberClass = 'u-h4 rounded-sm px-1 min-w-10 text-center py-2'
  const dateNow = ref<dayjs.Dayjs>(dayjs.utc())
  const countdown = reactive({
    status,
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    class: `${numberClass} bg-[rgba(245,246,250,1)] text-black text-opacity-10`
  })

  if (status === SaleCrowdfundingStatus.CANCELED) {
    countdown.class = `${numberClass} bg-[rgba(245,246,250,1)] text-black text-opacity-10`
    return countdown
  }

  const timer: any = () => {
    dateNow.value = dayjs.utc()
    if (dateNow.value.isAfter(dayjs(Number(end_time)).utc())) return null

    return setTimeout(timer, 1000)
  }

  timer()

  watchEffect(() => {
    // before start
    if (dateNow.value.isBefore(dayjs(Number(start_time)).utc())) {
      const diffDuration = dayjs.duration(dayjs(Number(start_time)).utc().diff(dateNow.value))
      const [hours, minutes, seconds] = diffDuration.format('HH-mm-ss').split('-')
      const days = Math.floor(diffDuration.asDays())
      countdown.status = SaleCrowdfundingStatus.UPCOMING
      countdown.days = String(days)
      countdown.hours = hours
      countdown.minutes = minutes
      countdown.seconds = seconds
      countdown.class = `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
    }

    // after start and before end
    if (
      dateNow.value.isAfter(dayjs(Number(start_time)).utc()) &&
      dateNow.value.isBefore(dayjs(Number(end_time)).utc())
    ) {
      const diffDuration = dayjs.duration(dayjs(Number(end_time)).utc().diff(dateNow.value))
      const days = Math.floor(diffDuration.asDays())
      const [hours, minutes, seconds] = diffDuration.format('HH-mm-ss').split('-')
      countdown.status = SaleCrowdfundingStatus.LIVE
      countdown.days = String(days)
      countdown.hours = hours
      countdown.minutes = minutes
      countdown.seconds = seconds
      countdown.class = `${numberClass} bg-[rgba(83,49,244,0.06)] text-primary`
    }

    // ended
    if (dateNow.value.isAfter(dayjs(Number(end_time)).utc())) {
      countdown.status = SaleCrowdfundingStatus.ENDED
      countdown.class = `${numberClass} bg-[rgba(242,159,57,0.06)] text-warning`
    }
  })

  return countdown
}
