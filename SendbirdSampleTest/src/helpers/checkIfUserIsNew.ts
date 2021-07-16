import moment from 'moment'

export const checkIfUserIsNew = (createdAt: string) => {
  return moment().isBefore(moment(createdAt).add(2, 'weeks'))
}
