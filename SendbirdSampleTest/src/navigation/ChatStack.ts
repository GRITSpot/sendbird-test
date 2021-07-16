import { createStackNavigator } from 'react-navigation-stack'
import ChatListController from '~/screens/ChatListScreen/ChatListController'
import ChatController from '~/screens/ChatScreen/ChatController'

const ChatStack = createStackNavigator(
  {
    ChatList: {
      screen: ChatListController,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Chat: {
      screen: ChatController,
      navigationOptions: () => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'ChatList',
    headerLayoutPreset: 'center',
  },
)
export default ChatStack
