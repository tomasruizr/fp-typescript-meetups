import { Config } from "src";
import { randomBytes } from "crypto";

export interface DbManager{
  _db: Record<string, any>
  create<T>(collection: string, data: T, key?: string): Promise<string>
  read<T>(collection:string, filter: Partial<T>): Promise<T[]>
  readById<T>(collection:string, id: string): Promise<T>
  update<T>(collection:string, filter: Partial<T>, newData: T) : Promise<T[]>
  updateById <T>(collection:string, id: string, newData: T) : Promise<T>
  destroy <T>(collection:string, filter: Partial<T>): Promise<T[]>
  destroyById <T>(collection:string, id: string): Promise<T>
}
export const create = (config?: Config) => {

  const db = {};

  const generateId = () => randomBytes(16).toString('hex');

  const create = <T>(collection: string, data: T, key?: string): Promise<string> =>{
    key = key || generateId();
    db[collection] = db[collection] || {};
    db[collection][key] = data;
    return Promise.resolve(key);
  }

  const read = <T>(collection:string, filter: Partial<T>): Promise<T[]> => {
    return Promise.resolve(
      Object
        .values(db[collection])
        .filter((item: T) =>
          Object.keys(filter)
            .filter(prop=> filter[prop] === item[prop]).length) as T[]
    );
  }

  const readById = <T>(collection:string, id: string): Promise<T> => {
    if (db[collection] && db[collection][id])
      return Promise.resolve(db[collection][id]);
    return Promise.resolve(undefined)
  }

  const update = <T>(collection:string, filter: Partial<T>, newData: T) : Promise<T[]> => {
    const matchingKeys = Object
      .keys(db[collection])
      .filter(key => Object.keys(filter)
        .filter(prop=> filter[prop] === db[collection][key][prop]).length)
    //REVIEW: match && db[match] = newData;
    if (matchingKeys.length) {
      const result: T[] = [];
      matchingKeys.forEach(match => {
        db[collection][match] = newData;
        result.push(db[collection][match]);
      })
      return Promise.resolve(result);
    } else {
      return Promise.resolve([]);
    }
  }
  const updateById = <T>(collection:string, id: string, newData: T) : Promise<T> => {
    if (db[collection] && db[collection][id]){
      db[collection][id] = newData;
      return Promise.resolve(newData);
    } else {
      return Promise.resolve(undefined);
    }
  }

  const destroy = <T>(collection:string, filter: Partial<T>): Promise<T[]> => {
    const matchingRecords =
      Object.keys(db[collection])
        .filter(key => Object.keys(filter)
          .filter(prop=> filter[prop] === db[collection][key][prop]).length)
    const result: T[] = [];
    matchingRecords.forEach(match => {
       result.push( db[collection][match]);
       delete db[collection][match];
    })
    return Promise.resolve(result);
  }
  const destroyById = <T>(collection:string, id: string): Promise<T> => {
    if (db[collection] && db[collection][id]){
      const result = db[collection][id];
      delete db[collection][id];
      return Promise.resolve(result);
    } else {
      return Promise.resolve(undefined)
    }
  }

  return {
    _db: db,
    create,
    read,
    readById,
    update,
    updateById,
    destroy,
    destroyById,
  }
}
