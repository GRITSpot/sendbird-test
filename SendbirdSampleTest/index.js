/**
 * @format
 */
import 'reflect-metadata'
import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { container, containerModule } from '~/services/servicesContainer'
import { ServiceProvider } from '~/services/serviceProvider'

container.load(containerModule)

AppRegistry.registerComponent(appName, () => (props) => (
  <ServiceProvider container={container}>
    <App {...props} />
  </ServiceProvider>
))
