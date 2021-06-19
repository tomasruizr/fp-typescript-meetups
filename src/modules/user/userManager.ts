import { IComponents, Utils } from "src/server";

import Async from "crocks/Async";
import { IUser } from "./userController";
import crypto from 'crypto';
import { read } from "fs";

export interface IUserManager{
  read(): Async<Error, IUser[]>
  create(nuevoUser: IUser): Async<Error, string>
}

export const create = (components: IComponents, utils: Utils): IUserManager => {
  const read = () =>
    utils.ensureAsync(components.dbManager.read('user', {id: 'asdf'} as IUser))

  const create = (nuevoUser: IUser) =>{
    const id = crypto.createHash('md5').update(new Date().valueOf().toString()).digest().toString('hex');
    return utils.ensureAsync(components.dbManager.create('user', {id, ...nuevoUser}, id))
  }

  return {
    read,
    create
  }
}
