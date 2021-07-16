import { Container, ContainerModule, interfaces } from 'inversify'

import { ChatService, ChatServiceId, IChatService } from '~/services/chatService'
import {
  ISyncManagerService,
  SyncManagerService,
  SyncManagerServiceId,
} from '~/services/syncManagerService'

export const containerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IChatService>(ChatServiceId).to(ChatService).inSingletonScope()
  bind<ISyncManagerService>(SyncManagerServiceId).to(SyncManagerService).inSingletonScope()
})

export const container = new Container()
