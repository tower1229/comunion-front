import dayjs from 'dayjs'

export const getBountyStatus = (detail: any) => {
  const isExpired = dayjs.utc(Number(detail.apply_deadline)).unix() <= dayjs().utcOffset(0).unix()

  return ((detail.applicants && !detail.applicants.length) ||
    (!isNaN(Number(detail.applicant_count)) && detail.applicant_count < 1)) &&
    isExpired
    ? 4
    : detail.status || 0
}
