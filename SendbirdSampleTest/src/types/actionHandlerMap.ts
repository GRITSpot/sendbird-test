import {
  OpenChannel,
  GroupChannel,
  AdminMessage,
  UserMessage,
  FileMessage,
  User,
  BaseChannel,
  Member,
  ReactionEvent,
  ThreadInfoUpdateEvent,
} from 'sendbird'

export type ActionHandlerMap = {
  [key in ActionType]: (params: any) => void
}

export enum ActionType {
  INSERT = 'insert',
  UPDATE = 'update',
  MOVE = 'move',
  REMOVE = 'remove',
  CLEAR = 'clear',
}

export type ChannelHandlerActionMap = {
  onMessageReceived?: (
    channel: OpenChannel | GroupChannel,
    message: AdminMessage | UserMessage | FileMessage,
  ) => void
  onMessageUpdated?: (
    channel: OpenChannel | GroupChannel,
    message: AdminMessage | UserMessage | FileMessage,
  ) => void
  onMessageDeleted?: (channel: OpenChannel | GroupChannel, messageId: string) => void
  onReadReceiptUpdated?: (channel: GroupChannel) => void
  onTypingStatusUpdated?: (channel: GroupChannel) => void
  onUserJoined?: (channel: GroupChannel, user: User) => void
  onUserLeft?: (channel: GroupChannel, user: User) => void
  onOperatorUpdated?: (channel: BaseChannel, operators: User[]) => void
  onUserEntered?: (channel: OpenChannel, user: User) => void
  onUserExited?: (channel: OpenChannel, user: User) => void
  onUserMuted?: (channel: OpenChannel | GroupChannel, user: User) => void
  onUserUnmuted?: (channel: OpenChannel | GroupChannel, user: User) => void
  onUserBanned?: (channel: OpenChannel | GroupChannel, user: User) => void
  onUserUnbanned?: (channel: OpenChannel | GroupChannel, user: User) => void
  onChannelFrozen?: (channel: OpenChannel | GroupChannel) => void
  onChannelUnfrozen?: (channel: OpenChannel | GroupChannel) => void
  onChannelChanged?: (channel: OpenChannel | GroupChannel) => void
  onChannelDeleted?: (channelUrl: string, channelType: string) => void
  onUserReceivedInvitation?: (channel: GroupChannel, inviter: User, invitees: User[]) => void
  onUserDeclinedInvitation?: (channel: GroupChannel, inviter: User, invitee: Member) => void
  onMetaDataCreated?: (channel: OpenChannel | GroupChannel, metaData: any) => void
  onMetaDataUpdated?: (channel: OpenChannel | GroupChannel, metaData: any) => void
  onMetaDataDeleted?: (channel: OpenChannel | GroupChannel, metaDataKeys: string[]) => void
  onMetaCountersCreated?: (channel: OpenChannel | GroupChannel, metaCounter: any) => void
  onMetaCountersUpdated?: (channel: OpenChannel | GroupChannel, metaCounter: any) => void
  onMetaCountersDeleted?: (channel: OpenChannel | GroupChannel, metaCounterKeys: string[]) => void
  onChannelHidden?: (channel: GroupChannel) => void
  onReactionUpdated?: (channel: OpenChannel | GroupChannel, reactionEvent: ReactionEvent) => void
  onMentionReceived?: (
    channel: OpenChannel | GroupChannel,
    message: AdminMessage | UserMessage | FileMessage,
  ) => void
  onThreadInfoUpdated?: (
    channel: OpenChannel | GroupChannel,
    threadInfoUpdateEvent: ThreadInfoUpdateEvent,
  ) => void
}
