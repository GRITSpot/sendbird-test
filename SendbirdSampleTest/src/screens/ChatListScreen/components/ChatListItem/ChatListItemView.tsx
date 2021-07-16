import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'

import { scale } from '~/helpers/scaling'
import NoAvatar from '~/assets/icons/noAvatar'
import TYPOGRAPHY from '~/styles/typography'
import COLORS from '~/styles/colors'
import { ChatMemberUserData } from '~/types/user'

const PHOTO_SIZE = 40

type Props = {
  otherParticipant?: ChatMemberUserData
  lastMessageDate: string
  lastMessageText: string
  unreadMessageCount: number
  onPress: () => void
}

const ChatListItemView: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.photoContainer}>
        {!!props.otherParticipant?.profilePicture ? (
          <FastImage source={{ uri: props.otherParticipant.profilePicture }} style={styles.photo} />
        ) : (
          <NoAvatar width={PHOTO_SIZE} height={PHOTO_SIZE} />
        )}
      </View>
      <View style={styles.leftTextContainer}>
        <View style={styles.nameTextContainer}>
          <Text style={TYPOGRAPHY.subtitle}>{props.otherParticipant?.nickname ?? ''}</Text>
          {props.otherParticipant?.isNew && (
            <View style={styles.newcomerLabelContainer}>
              <Text style={[TYPOGRAPHY.label, styles.newcomerLabel]}>{'label_newcomer'}</Text>
            </View>
          )}
        </View>
        <Text numberOfLines={1} style={[TYPOGRAPHY.bodyText2, styles.messageText]}>
          {props.lastMessageText.trim()}
        </Text>
      </View>
      <View style={styles.rightTextContainer}>
        <Text style={[TYPOGRAPHY.caption, styles.dateText]}>{props.lastMessageDate}</Text>
        {!!props.unreadMessageCount && <View style={styles.badge} />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: scale(16),
  },
  photo: {
    width: scale(PHOTO_SIZE),
    height: scale(PHOTO_SIZE),
    borderRadius: scale(PHOTO_SIZE / 2),
  },
  photoContainer: {
    paddingRight: scale(16),
  },
  leftTextContainer: {
    flex: 1,
  },
  nameTextContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: scale(4),
    alignItems: 'center',
  },
  newcomerLabelContainer: {
    backgroundColor: COLORS.brand.secondaryDark,
    borderRadius: scale(4),
    marginLeft: scale(8),
    paddingHorizontal: scale(4),
    paddingVertical: scale(1),
  },
  newcomerLabel: {
    color: COLORS.greyscale.white,
  },
  messageText: {
    color: COLORS.greyscale.dark,
  },
  rightTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dateText: {
    color: COLORS.greyscale.dark,
    paddingBottom: scale(6),
  },
  badge: {
    backgroundColor: COLORS.brand.primary,
    borderRadius: scale(6),
    height: scale(8),
    width: scale(8),
    marginBottom: scale(6),
    marginRight: scale(10),
  },
})

export default ChatListItemView
