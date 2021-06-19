import { IComponents, Utils } from "src/server";

import {create as createUserManager} from "./userManager";

export interface IUser{
  id: string,
  name: string,
  lastName: string,
  friendsIds?: string[],
  friends?: IUser[],
}

export const create = (components: IComponents, utils: Utils) => {
  const manager = createUserManager(components, utils);

  components.endpointManager.registerEndpoint('get', '/users', (req, res) =>
    manager.read()
      .fork((e) => res.sendStatus(400).send(e), result => res.send(result)));

  components.endpointManager.registerEndpoint('post', '/users', (req, res) => {
    manager.create(req.body)
      .fork((e) => res.sendStatus(400).send(e), result => res.send(result));
  });
}
