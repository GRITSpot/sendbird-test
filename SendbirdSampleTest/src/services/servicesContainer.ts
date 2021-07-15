import { Container, ContainerModule, interfaces } from 'inversify'
import 'reflect-metadata'

export const containerModule = new ContainerModule((bind: interfaces.Bind) => {})

export const container = new Container()
