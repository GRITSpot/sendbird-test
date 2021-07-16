import moment from 'moment'

export const prettifyDate = (date: string | number, extended?: boolean, semiExtended?: boolean) => {
  const today = moment().startOf('day')
  if (moment(date).startOf('day').isSame(today)) {
    return 'Today'
  }
  const yesterday = moment().subtract(1, 'days').startOf('day')
  if (moment(date).startOf('day').isSame(yesterday)) {
    return 'Yesterday'
  }
  const tomorrow = moment().add(1, 'days').startOf('day')
  if (moment(date).startOf('day').isSame(tomorrow)) {
    return 'Tomorrow'
  }
  if (semiExtended) {
    if (moment.locale() === 'de') {
      return moment(date).format('ddd Do MMM')
    }
    return moment(date).format('ddd, MMM Do')
  }
  if (extended) {
    if (moment.locale() === 'de') {
      return moment(date).format('ddd Do MMM, HH:mm')
    }
    return moment(date).format('ddd, MMM Do, HH:mm')
  }
  return moment(date).format('dddd, Do MMMM')
}

export const prettifyChatMessageDate = (date: string | number) => {
  const today = moment().startOf('day')
  if (moment(date).startOf('day').isSame(today)) {
    return moment(date).format('HH:mm')
  }
  const yesterday = moment().subtract(1, 'days').startOf('day')
  if (moment(date).startOf('day').isSame(yesterday)) {
    return 'Yesterday'
  }
  const weekAgo = moment().subtract(7, 'days').startOf('day')
  if (moment(date).startOf('day').isAfter(weekAgo)) {
    return moment(date).format('ddd')
  }
  return moment(date).format('DD.MM')
}

export const prettifySubscriptionExpiryDate = (unixDate: number) => {
  if (moment.locale() === 'de' || moment.locale() === 'ru') {
    return moment.unix(unixDate).format('Do MMM yyyy')
  }
  return moment.unix(unixDate).format('MMM Do yyyy')
}
