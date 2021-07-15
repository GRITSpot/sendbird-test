import { NativeModules, Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { LocaleConfig } from 'react-native-calendars'
import i18next from 'i18next'
import moment from 'moment'

import { SUPPORTED_LANGUAGES } from '~/const/language'

let currentAppLanguage = 'en'

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  amDesignator: 'AM',
  pmDesignator: 'PM',
}
LocaleConfig.locales.de = {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  amDesignator: 'AM',
  pmDesignator: 'PM',
}
LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  amDesignator: 'AM',
  pmDesignator: 'PM',
}

const getDeviceLocale = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? getIosLanguage(NativeModules.SettingsManager.settings.AppleLanguages)
      : getAndroidLanguage(NativeModules.I18nManager.localeIdentifier)

  return deviceLanguage
}

getAndroidLanguage = (locale) => {
  const language = locale.slice(0, 2)
  return SUPPORTED_LANGUAGES.includes(language) ? language : 'en'
}

const getIosLanguage = (languagesArray = []) => {
  const localeFound = languagesArray.find((locale) => {
    const language = locale.slice(0, 2)
    return SUPPORTED_LANGUAGES.includes(language)
  })

  return localeFound ? localeFound.slice(0, 2) : 'en'
}

const getAppLanguage = async () => {
  const appLanguage = await AsyncStorage.getItem('settings_locale')
  currentAppLanguage = appLanguage || getDeviceLocale()
  moment.locale(currentAppLanguage)
  LocaleConfig.defaultLocale = currentAppLanguage

  return currentAppLanguage
}

const changeLanguage = async (newLocale) => {
  currentAppLanguage = newLocale
  await i18next.changeLanguage(newLocale)
  await AsyncStorage.setItem('settings_locale', newLocale)
}

export { getAppLanguage, changeLanguage, currentAppLanguage }
