import {create, start} from '../../../src/server'

import { Server } from 'http';
import Sinon from 'sinon';
import { assert } from 'chai';
import crypto from 'crypto';
import fetch from 'node-fetch';

describe( 'user.integration', function() {
  const user1 = {
    id:'asdf',
    name: 'tomas',
    lastName: 'ruiz'
  };

  const dbFixtures = {
    user: {
      '12341234123413241324123': user1
    }
  }
  let server: Server;
  const baseUrl = () => `http://localhost:${(server.address() as {port:number}).port}`

  const config = {
    "httpServer":{
      "port": undefined
    }
  }

  this.beforeEach(() => {
    const httpServer = create(dbFixtures);
    server = start(httpServer, config);
  })
  describe('read', function() {
    it('retorne la lista de usuarios en DB', (done) => {
      fetch(`${baseUrl()}/users`)
        .then(response => response.json())
        .then(data => {
          assert.deepEqual(data, [user1])
        })
        .then(() => done(), done)
    });
  });
  describe('create', function() {
    it('crear un usuario en la base de datos y retorne en nuevo usuario', (done) => {
      const date = new Date();
      Sinon.useFakeTimers(date);
      const dateMD5 = crypto.createHash('md5').update(new Date().valueOf().toString()).digest().toString('hex');
      const nuevoUser = {
        name: 'nuevo',
        lastName: 'usuario'
      };
      fetch(`${baseUrl()}/users`, {
        method: 'post',
        body: JSON.stringify(nuevoUser)
      })
        .then(response => response.text())
        .then(data => {
          assert.equal(data, dateMD5);
          //FIXME: Nos quedamos en testear la base de datos para la inserción
        })
        .then(() => done(), done)
    });
  });
});
