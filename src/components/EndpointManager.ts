import { Application, RequestHandler } from "express";

export interface IEndpointManager {
  registerEndpoint( verb:string, route:string, actions: RequestHandler ): void
}

export const create = ( app: Application ): IEndpointManager => {
  const registerEndpoint = ( verb:string, route:string, actions: RequestHandler ) => {
    app[verb]( route, actions );
    console.log( 'Endpoint Registered:', verb.toUpperCase(), route );
  };
  return { registerEndpoint };
};
