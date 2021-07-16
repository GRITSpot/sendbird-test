import { get } from 'lodash'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native'

import ChatSendIcon from '~/assets/icons/chatSend'
import MessageView from '~/components/components/MessageView'
import { Loader } from '~/components/helpers'
import { prettifyDate } from '~/helpers/prettifyDate'
import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'
import TYPOGRAPHY from '~/styles/typography'
import { ChatMemberUserData } from '~/types/user'

import AlertBox from './AlertBox'

const BASE_INPUT_HEIGHT = 40

type MessageListSection = {
  title: string
  data: Array<SendBird.UserMessage | SendBird.AdminMessage>
}

type Props = {
  messages: Array<SendBird.UserMessage | SendBird.AdminMessage>
  participant: ChatMemberUserData | null
  user: ChatMemberUserData
  isLoading: boolean
  renderEmptyView: React.FunctionComponent
  renderHeader: React.FunctionComponent
  isBroadcast?: boolean
  loadPrevious: () => void
  sendMessage: (text: string) => void
  resendFailedMessage: (message: Array<SendBird.UserMessage | SendBird.AdminMessage>) => void
}

/**
 * Chat including list of messages + text input
 */
const Chat = (props: Props) => {
  const [text, setText] = useState('')
  const [inputHeight, setInputHeight] = useState(BASE_INPUT_HEIGHT)
  const [currentDate, setCurrentDate] = useState<string | null>(null)
  const [hasMyMessage, setHasMyMessage] = useState(false)
  const messageList = useRef<FlatList | null>(null)

  useEffect(() => {
    if (props.messages.length) {
      checkIfHasUserMessage()
    }
    prevMessages.current = props.messages
  }, [props.messages])

  const sendMessage = () => {
    if (text) {
      props.sendMessage(text.trim())
    }
    setText('')
    setInputHeight(BASE_INPUT_HEIGHT)
  }

  const renderStickyDate = () =>
    currentDate && (
      <View style={styles.stickyDateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
    )

  const isMyMessage = (message: SendBird.UserMessage | SendBird.AdminMessage) => {
    return get(message, '_sender.userId') === props.user.id
  }

  const checkIfHasUserMessage = () => {
    if (props.messages.some((m) => isMyMessage(m))) {
      setHasMyMessage(true)
    }
  }

  const getMessageListByDate = (messages: Array<SendBird.UserMessage | SendBird.AdminMessage>) => {
    const newMessageList: MessageListSection[] = []
    messages.forEach((m) => {
      const date = prettifyDate(m.createdAt)

      const dateSection = newMessageList.find((item) => item.title === date)
      if (dateSection) {
        dateSection.data.push(m)
      } else {
        newMessageList.push({
          title: date,
          data: [m],
        })
      }
    })
    return newMessageList
  }

  const messageListByDate = useMemo(() => getMessageListByDate(props.messages), [props.messages])
  const latestTitle = messageListByDate[messageListByDate.length - 1]?.title
  const prevMessages = useRef<Array<SendBird.UserMessage | SendBird.AdminMessage>>([])

  const keyboardDidShow = () => messageList.current?.scrollToOffset({ animated: true, offset: 1 })

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow)

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <props.renderHeader />
      {props.isLoading && !props.messages.length && <Loader />}
      {renderStickyDate()}
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        ref={messageList}
        contentInset={{ top: scale(24) }}
        inverted
        data={messageListByDate}
        onEndReached={props.loadPrevious}
        style={styles.scrollContainer}
        keyExtractor={(item) => item.title}
        renderItem={(day) => {
          const isLast = day.item.title === latestTitle
          return (
            <>
              {day.item.data.map((message: SendBird.UserMessage | SendBird.AdminMessage) => {
                return (
                  <MessageView
                    key={message.createdAt}
                    prevMessages={prevMessages.current}
                    currentUser={props.user}
                    message={message}
                    // @ts-ignore
                    resendFailedMessage={props.resendFailedMessage}
                    isBroadcast={props.isBroadcast}
                  />
                )
              })}
              {/* @ts-ignore */}
              <View style={styles.dateContainer(isLast)}>
                <Text style={styles.dateText}>{day.item.title}</Text>
              </View>
            </>
          )
        }}
        ListEmptyComponent={
          <View style={{ flexGrow: 1 }}>
            <props.renderEmptyView />
          </View>
        }
        ListHeaderComponent={
          !props.isLoading && !hasMyMessage ? (
            <View style={styles.alertContainer}>
              <AlertBox
                text={'Chat.disclaimer'}
                customContainerStyle={styles.disclaimerContainer}
                textColor={COLORS.greyscale.almostBlack}
                iconColor={COLORS.greyscale.almostBlack}
              />
            </View>
          ) : null
        }
      />

      <KeyboardAvoidingView behavior={Platform.select({ android: undefined, ios: 'padding' })}>
        <View style={[styles.bottomContainer]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              placeholder={'Chat.inputPlaceholder'}
              placeholderTextColor={COLORS.greyscale.dark}
              style={[styles.textInput, { height: Math.max(BASE_INPUT_HEIGHT, inputHeight) }]}
              value={text}
              multiline
              numberOfLines={4}
              onChangeText={setText}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height)
              }}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <View style={styles.sendIcon}>
                <ChatSendIcon width={scale(13)} height={scale(13)} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

Chat.defaultProps = {
  isBroadcast: false,
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(24),
    backgroundColor: COLORS.greyscale.light,
    flexGrow: 1,
  },
  bottomContainer: {
    backgroundColor: COLORS.greyscale.white,
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
  },
  textInput: {
    ...TYPOGRAPHY.bodyText2,
    backgroundColor: COLORS.greyscale.light,
    paddingVertical: scale(8),
    paddingHorizontal: scale(8),
    maxHeight: scale(80),
    flex: 1,
    borderRadius: scale(8),
    marginRight: scale(8),
  },
  sendButton: {
    backgroundColor: COLORS.brand.primary,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(32 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    marginLeft: scale(2),
  },
  // @ts-ignore
  dateContainer: (isLast: boolean) => ({
    backgroundColor: COLORS.greyscale.white,
    paddingHorizontal: scale(4),
    paddingVertical: scale(1),
    alignSelf: 'center',
    marginVertical: scale(24),
    ...(isLast && { marginTop: 0 }),
    borderRadius: scale(4),
  }),
  stickyDateContainer: {
    backgroundColor: COLORS.greyscale.white,
    paddingHorizontal: scale(4),
    paddingVertical: scale(1),
    alignSelf: 'center',
    borderRadius: scale(4),
    position: 'absolute',
    top: scale(24),
    zIndex: 999,
  },
  dateText: {
    ...TYPOGRAPHY.label,
    color: COLORS.brand.secondaryLight,
  },
  alertContainer: {
    backgroundColor: COLORS.greyscale.light,
    paddingBottom: scale(24),
  },
  disclaimerContainer: {
    backgroundColor: COLORS.uiSpecific.transparent,
    borderColor: COLORS.greyscale.medium,
    borderWidth: scale(1),
  },
})

export default Chat
