import { get } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import FastImage from 'react-native-fast-image'

import NoAvatar from '~/assets/icons/noAvatar'
import images from '~/assets/images'
import Chat from '~/components/components/Chat'
import EmptyScreen from '~/components/components/EmptyScreen'
import ScreenHeader from '~/components/components/ScreenHeader'
import BackButton from '~/components/navigation/BackButtonNew'
import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'
import TYPOGRAPHY from '~/styles/typography'
import { ChatMemberUserData } from '~/types/user'

const PHOTO_SIZE = 24

type Props = {
  user: ChatMemberUserData
  messages: Array<SendBird.UserMessage | SendBird.AdminMessage>
  otherParticipant: ChatMemberUserData | null
  isLoading: boolean
  loadPrevious: () => void
  sendMessage: (text: string) => void
  resendFailedMessage: (message: Array<SendBird.UserMessage | SendBird.AdminMessage>) => void
  onBackPress: () => void
}

const ChatView = (props: Props) => {
  const { t } = useTranslation()

  const participantProfilePicture = props.otherParticipant
    ? props.otherParticipant.profilePicture
    : null
  const participantNickname = props.otherParticipant?.nickname ?? ''

  const renderEmptyScreen = () => {
    return (
      <EmptyScreen
        emojiSource={images.wave}
        title={t('emptyState_customerChat_title', { name: props.user.nickname })}
        description={t('emptyState_customerChat_description', {
          coachName: participantNickname,
        })}
      />
    )
  }

  return (
    <Chat
      user={props.user}
      isLoading={props.isLoading}
      messages={props.messages.reverse()}
      participant={props.otherParticipant}
      sendMessage={props.sendMessage}
      loadPrevious={props.loadPrevious}
      resendFailedMessage={props.resendFailedMessage}
      renderEmptyView={renderEmptyScreen}
      renderHeader={() => (
        <>
          <StatusBar backgroundColor={COLORS.greyscale.white} barStyle='dark-content' />
          <ScreenHeader
            customContent={
              <View style={styles.headerContainer}>
                <BackButton onPress={props.onBackPress} />
                {participantProfilePicture ? (
                  <FastImage source={{ uri: participantProfilePicture }} style={styles.photo} />
                ) : (
                  <NoAvatar width={PHOTO_SIZE} height={PHOTO_SIZE} />
                )}
                <Text style={[TYPOGRAPHY.h2Header, styles.participantName]}>
                  {participantNickname}
                </Text>
              </View>
            }
          />
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(12),
  },
  photo: {
    width: scale(PHOTO_SIZE),
    height: scale(PHOTO_SIZE),
    borderRadius: PHOTO_SIZE / 2,
  },
  participantName: {
    marginLeft: scale(8),
  },
})

export default ChatView
