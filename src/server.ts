import * as u from './utils'

import {IDbManager, create as createDbManager} from './components/DbManager'
//Components
import {IEndpointManager, create as createEndpointManager} from './components/EndpointManager'
import { Server, createServer } from 'http';

import { Config } from 'src';
import Express from 'express';
//Modules
import {create as createUser} from './modules/user/userController';

export type Utils = typeof u;



export interface IComponents{
  endpointManager: IEndpointManager
  dbManager: IDbManager
}

export function create(dbFixtures?:object) {
  const App = Express();
  const endpointManager = createEndpointManager( App );
  const dbManager = createDbManager(dbFixtures);

  const components: IComponents = {
    endpointManager,
    dbManager
  };
  // Create the Modules
  [
    createUser,
  ].map( createFn => createFn(components, u));

  const server = createServer( App );
  return server;
}

export function start( server: Server, config: Config ) {
  return server.listen( config.httpServer.port, () => {
    console.log( `server listening on ${config.httpServer.port}` );
  });
}
