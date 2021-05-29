import { assert } from 'chai';
import * as mod from './DbManager';

describe( 'DbManager', function() {
  let dbManager: mod.DbManager;
  interface DATA {name:string, ref:number};
  const data = {name:'tomas', ref:1};
  this.beforeEach(() => {
    dbManager = mod.create();
  })
  describe('create', function() {
    it('add the record to db and returns the id', done => {
      dbManager.create('coll', data, '0001')
        .then((id) => {
          assert.deepEqual(id, '0001');
          dbManager._db;
          assert.deepEqual(dbManager._db, {'coll' : {'0001': data} } )
        })
        .then(() => done(), done);
    });

    it('add the record to db and returns a generated id if no provided', done => {
      dbManager.create('coll', data)
        .then((id) => {
          assert.match(id, /[0-9a-f]{16}/i);
          dbManager._db;
          assert.deepEqual(dbManager._db, {'coll' : {[id]: data} } )
        })
        .then(() => done(), done);
    });
  });

  describe('readById', function() {
    it('retrieves the record from db', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas'}};
      dbManager.readById('coll', '0001')
        .then(data => {
          assert.deepEqual(data, {name:'tomas'})
        })
        .then(() => done(), done)
    });
    it('returns undefined if it does not exists', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas'}};
      Promise.all([
        dbManager.readById('dontExists', 'dontExists')
        .then(result => {
          assert.isUndefined(result)
        }),
        dbManager.readById('coll', 'dontExists')
        .then(result => {
          assert.isUndefined(result)
        }),
      ])
        .then(() => done(), done)
    });
  });

  describe('read', function() {
    it('retrieves all the matching records from db', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.read<DATA>('coll', {name:'tomas'})
        .then(result => {
          assert.deepEqual(result, [{name:'tomas', ref:1}, {name:'tomas', ref:2}])
        })
        .then(() => done(), done)
    });
    it('returns an empty array if no match', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.read<DATA>('coll', {name:'notExists'})
        .then(result => {
          assert.deepEqual(result, [])
        })
        .then(() => done(), done)
    });
  });

  describe('update', function() {
    it('returns an array with the updated records', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.update<DATA>('coll', {name:'tomas'}, {name:'updatedName', ref:22})
        .then(result => {
          assert.deepEqual(result, [{name:'updatedName', ref:22}, {name:'updatedName', ref:22}])
        })
        .then(() => done(), done)
    });
    it('returns and empty array if no match', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.update<DATA>('coll', {name:'notExists'}, {name:'updatedName', ref:22})
        .then(result => {
          assert.deepEqual(result, [])
        })
        .then(() => done(), done)
    });
  });

  describe('updateById', function() {
    it('replaces the record in db and returns the updated record', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.updateById<DATA>('coll', '0001', {name:'updated', ref:22} )
        .then(result =>{
          assert.deepEqual(result, {name:'updated', ref:22});
          assert.deepEqual(dbManager._db, {
            coll: {
              '0001': { name: 'updated', ref: 22 },
              '0002': { name: 'tomas', ref: 2 }
            }
          })
        })
        .then(() => done(), done)
    });
    it('returns undefined if no match', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.updateById<DATA>('coll', 'notExists', {name:'updated', ref:22} )
        .then(result =>{
          assert.deepEqual(result, undefined);
          assert.deepEqual(dbManager._db, {
            coll: {
              '0001': { name: 'tomas', ref: 1 },
              '0002': { name: 'tomas', ref: 2 }
            }
          })
        })
        .then(() => done(), done)
    });
  });

  describe('destroy', function() {
    it('destroys all the matching records from db and returns destroyed records', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.destroy<DATA>('coll', {name:'tomas'})
        .then(result => {
          assert.deepEqual(result, [{name:'tomas', ref:1}, {name:'tomas', ref:2}])
          assert.deepEqual(dbManager._db['coll'], {})
        })
        .then(() => done(), done)
    });
    it('returns an empty array if no matching records', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.destroy<DATA>('coll', {name:'notExists'})
        .then(result => {
          assert.deepEqual(result, [])
          assert.deepEqual(dbManager._db['coll'], {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}})
        })
        .then(() => done(), done)
    });
  });

  describe('destroyById', function() {
    it('destroys the record in db and returns the destroyed record', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.destroyById<DATA>('coll', '0001' )
        .then(result =>{
          assert.deepEqual(result, {name:'tomas', ref:1});
          assert.deepEqual(dbManager._db, {
            coll: {
              '0002': { name: 'tomas', ref: 2 }
            }
          })
        })
        .then(() => done(), done)
    });
    it('returns undefined if no match', done => {
      dbManager._db['coll'] = {'0001': {name:'tomas', ref:1}, '0002': {name:'tomas', ref:2}};
      dbManager.destroyById<DATA>('coll', 'notExists' )
        .then(result =>{
          assert.deepEqual(result, undefined);
          assert.deepEqual(dbManager._db, {
            coll: {
              '0001': { name: 'tomas', ref: 1 },
              '0002': { name: 'tomas', ref: 2 }
            }
          })
        })
        .then(() => done(), done)
    });
  });
});
