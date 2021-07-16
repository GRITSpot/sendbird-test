import React, { useRef, useEffect } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ViewStyle, Animated } from 'react-native'
import moment from 'moment'
import SendBird from 'sendbird'
import { useTranslation } from 'react-i18next'
import Hyperlink from 'react-native-hyperlink'
import { get, findIndex } from 'lodash'

import TYPOGRAPHY from '~/styles/typography'
import COLORS from '~/styles/colors'
import { scale } from '~/helpers/scaling'
import { openFullUrl } from '~/helpers/urlFunctions'
import { ChatMemberUserData } from '~/types/user'

const MESSAGE_TYPE = {
  admin: 'admin',
  broadcast: 'broadcast',
}

type MessageType = 'admin' | 'broadcast'

type Props = {
  currentUser: ChatMemberUserData
  message: SendBird.UserMessage | SendBird.AdminMessage
  prevMessages: Array<SendBird.UserMessage | SendBird.AdminMessage>
  resendFailedMessage: (message: SendBird.UserMessage | SendBird.AdminMessage) => void
}

const MessageView = (props: Props) => {
  const { t } = useTranslation()
  const { message } = props

  const isUserMessage = (variableToCheck: any): variableToCheck is SendBird.UserMessage =>
    (variableToCheck as SendBird.UserMessage).requestState !== undefined

  const isAdminAndCoachMessage = props.message.messageType === MESSAGE_TYPE.admin

  const isMyMessage =
    get(message, '_sender.userId') === props.currentUser.id || isAdminAndCoachMessage

  const isFailedMessage = isUserMessage(message)
    ? message.messageId === 0 && message.requestState === 'failed'
    : false

  const direction = isMyMessage ? 'row-reverse' : 'row'
  const isBroadcast = props.message.customType === 'broadcast'

  const appearanceAnimation = useRef(new Animated.Value(0))

  const messageJustSentByMe = props.message.messageId === 0 && isMyMessage
  const messageJustReceivedFromOtherParticipant =
    findIndex(props.prevMessages, (m) => m.messageId === props.message.messageId) === -1 &&
    !isMyMessage

  useEffect(() => {
    Animated.timing(appearanceAnimation.current, {
      toValue: 1,
      duration:
        props.prevMessages.length !== 0 &&
        (messageJustReceivedFromOtherParticipant || messageJustSentByMe)
          ? 200
          : 0,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <View style={{ flexDirection: direction }}>
      <Animated.View
        style={{
          transform: [{ scale: appearanceAnimation.current }],
          position: 'relative',
          maxWidth: '80%',
          minWidth: scale(110),
        }}
      >
        <TouchableOpacity
          disabled={!isFailedMessage}
          onPress={() => props.resendFailedMessage(message)}
          activeOpacity={0.8}
          // @ts-ignore
          style={styles.messageTextContainer(isMyMessage)}
        >
          <View>
            <Hyperlink
              linkStyle={{
                color: isMyMessage ? COLORS.brand.secondary : COLORS.greyscale.white,
                textDecorationLine: 'underline',
              }}
              onPress={(url) => openFullUrl(url)}
            >
              {/* @ts-ignore */}
              <Text style={styles.messageText(isMyMessage, isFailedMessage)}>
                {message.message}
              </Text>
            </Hyperlink>
            {isFailedMessage && <Text style={styles.failedMessage}>{t('chat_failedMessage')}</Text>}
          </View>
          {!isFailedMessage && (
            <Text style={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</Text>
          )}
          {isBroadcast && (
            // @ts-ignore
            <View style={styles.labelContainer(MESSAGE_TYPE.broadcast)}>
              <Text style={styles.labelText}>{t('chat_broadcastLabel')}</Text>
            </View>
          )}
          {isAdminAndCoachMessage && (
            // @ts-ignore
            <View style={styles.labelContainer(MESSAGE_TYPE.admin)}>
              <Text style={styles.labelText}>{t('chat_adminLabel')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

MessageView.defaultProps = {
  isBroadcast: false,
}

export const styles = StyleSheet.create({
  // @ts-ignore
  messageTextContainer: (isMyMessage: boolean): ViewStyle => ({
    flexDirection: 'row',
    marginBottom: scale(16),
    borderRadius: 8,
    backgroundColor: isMyMessage ? COLORS.greyscale.white : COLORS.brand.secondaryDark,
    borderTopStartRadius: isMyMessage ? scale(8) : 0,
    borderTopEndRadius: isMyMessage ? 0 : scale(8),
    padding: scale(16),
  }),
  // @ts-ignore
  messageText: (isMyMessage: boolean, isFailedMessage: boolean) => ({
    ...TYPOGRAPHY.bodyText2,
    color: isMyMessage
      ? isFailedMessage
        ? COLORS.greyscale.medium
        : COLORS.greyscale.almostBlack
      : COLORS.greyscale.white,
    marginRight: scale(6),
    maxWidth: scale(200),
  }),
  messageTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.brand.secondaryLight,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    marginBottom: scale(-2.8),
  },
  // @ts-ignore
  labelContainer: (labelType: MessageType) => ({
    backgroundColor:
      labelType === MESSAGE_TYPE.admin ? COLORS.brand.primary : COLORS.brand.secondaryLight,
    borderRadius: scale(4),
    position: 'absolute',
    top: scale(-8),
    right: scale(16),
    paddingHorizontal: scale(4),
    paddingVertical: scale(1),
  }),
  labelText: {
    flex: 1,
    ...TYPOGRAPHY.label,
    color: COLORS.greyscale.white,
  },
  failedMessage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.brand.primary,
    marginTop: scale(8),
  },
})

export default MessageView
