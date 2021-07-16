import React, { useState, useMemo, useEffect } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  StatusBar,
} from 'react-native'
import SendBird from 'sendbird'

import images from '~/assets/images'
import Header from '~/burpees/components/headers/Header'
import GenericButton from '~/components/buttons/GenericButton'
import EmptyScreen from '~/components/components/EmptyScreen'
import { Loader } from '~/components/helpers'
import COLORS from '~/styles/colors'
import { scale } from '~/helpers/scaling'

import ChatListItemController from './components/ChatListItem/ChatListItemController'

type Props = {
  channels: SendBird.GroupChannel[]
  isLoading: boolean
  fetchNext: () => void
  onChatPress: (channel: SendBird.GroupChannel) => void
  onReviewParticipantsButtonPress: () => void
  onUpcomingParticipantsButtonPress: () => void
  onBookWorkoutButtonPress: () => void
}

const ChatListView: React.FC<Props> = (props: Props) => {
  const [isLoadingChannels, setIsLoadingChannels] = useState(!props.channels.length)

  useEffect(() => {
    // Hack to avoid screen blinking the empty screen before loading
    setIsLoadingChannels(props.isLoading)
  }, [props.isLoading])

  const [headerHasShadow, setHeaderHasShadow] = useState(false)

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!headerHasShadow && event.nativeEvent.contentOffset.y > 0) {
      setHeaderHasShadow(true)
    } else if (headerHasShadow && event.nativeEvent.contentOffset.y <= 0) {
      setHeaderHasShadow(false)
    }
  }

  const emptyChatList = () => {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <EmptyScreen
          emojiSource={images.bubble}
          title={'emptyState_chatList_title'}
          description={'emptyState_chatList_description'}
          containerCustomStyles={styles.emptyScreenContentContainer}
        >
          <GenericButton
            customButtonStyle={styles.bookWorkoutButton}
            onPress={props.onBookWorkoutButtonPress}
          >
            {'emptyState_chatList_bookButton'}
          </GenericButton>
        </EmptyScreen>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.greyscale.white} barStyle='dark-content' />
      <Header title={'chat_title'} />
      {isLoadingChannels && !props.channels.length ? (
        <Loader />
      ) : (
        <FlatList
          scrollEnabled={!!props.channels.length}
          contentContainerStyle={styles.contentContainer}
          data={props.channels}
          onScroll={onScroll}
          keyExtractor={(item) => item.url}
          onEndReached={props.fetchNext}
          renderItem={(bundle) => {
            return <ChatListItemController channel={bundle.item} onChatPress={props.onChatPress} />
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={() =>
            props.channels.length > 0 ? <View style={styles.separator} /> : null
          }
          ListEmptyComponent={emptyChatList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
  },
  emptyScreenContentContainer: {
    backgroundColor: COLORS.greyscale.white,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.greyscale.light,
  },
  emptyCoachChatBulletList: {
    backgroundColor: COLORS.greyscale.light,
    borderRadius: scale(8),
    padding: scale(16),
    paddingTop: scale(18),
    width: '100%',
    marginBottom: scale(32),
    marginTop: scale(16),
  },
  reviewParticipantsButton: {
    width: '100%',
  },
  upcomingParticipantsButton: {
    marginTop: scale(16),
    borderColor: COLORS.brand.primary,
    width: '100%',
  },
  bookWorkoutButton: {
    marginTop: scale(32),
    width: '100%',
  },
})

export default ChatListView
