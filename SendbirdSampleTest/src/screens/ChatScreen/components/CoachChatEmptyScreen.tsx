import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import images from '~/assets/images'
import EmptyScreen from '~/components/components/EmptyScreen'
import TYPOGRAPHY from '~/styles/typography'
import { scale } from '~/helpers/scaling'
import COLORS from '~/styles/colors'

type Props = {
  coachName: string
  participantName: string
}

const CoachChatEmptyScreen = (props: Props) => {
  const { t } = useTranslation()
  return (
    <EmptyScreen
      title={t('emptyState_coachChat_title', { coachName: props.coachName })}
      description={t('emptyState_coachChat_description', {
        customerName: props.participantName,
      })}
      emojiSource={images.wave}
    >
      <View style={styles.emptyStateListContainer}>
        <View style={styles.row}>
          <View style={styles.bulletPoint} />
          <Text style={TYPOGRAPHY.bodyText2}>{t('emptyState_coachChat_text1')}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.bulletPoint} />
          <Text style={TYPOGRAPHY.bodyText2}>{t('emptyState_coachChat_text2')}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.bulletPoint} />
          <Text style={TYPOGRAPHY.bodyText2}>{t('emptyState_coachChat_text3')}</Text>
        </View>
      </View>
    </EmptyScreen>
  )
}

const styles = StyleSheet.create({
  emptyStateListContainer: {
    padding: scale(16),
    backgroundColor: COLORS.greyscale.white,
    borderRadius: scale(8),
    width: '100%',
    marginTop: scale(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(4 / 2),
    backgroundColor: COLORS.greyscale.almostBlack,
    marginRight: scale(16),
  },
})

export default CoachChatEmptyScreen
