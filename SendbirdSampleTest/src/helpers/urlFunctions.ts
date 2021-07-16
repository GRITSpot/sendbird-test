import { Linking, Platform, Alert } from 'react-native'

export const linkingOpenUrl = (url: string | undefined) => {
  if (url) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        console.log("Don't know how to open URI: " + url)
      }
    })
  }
}

export const openFullUrl = (url: string) => {
  let requestUrl = url
  if (url.indexOf('http') === -1) {
    requestUrl = `https://${url}`
  }
  linkingOpenUrl(requestUrl)
}
