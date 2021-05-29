import { createServer, Server } from 'http';
import Express from 'express';

//Components
import {create as createEndpointManager, EndpointManager} from './components/EndpointManager'

//Modules
import {create as User} from './modules/user/userModule';
import { Config } from 'src';

export interface Components{
  endpointManager: EndpointManager
}

export function create() {
  const App = Express();
  const endpointManager = createEndpointManager( App );

  // Create the Modules
  [
    User
  ].map( createFn => createFn({ endpointManager }));

  const server = createServer( App );
  return server;
}

export function start( server: Server, config: Config ) {
  server.listen( config.httpServer.port, () => {
    console.log( `server listening on ${config.httpServer.port}` );
  });
}
