import {create, start} from './server';

import config from './config.json';

export type Config = typeof config;


const dbFixtures = {
  user: {
    '12341234123413241324123': {
      id:'asdf',
      name: 'tomas',
      lastName: 'ruiz'
    }
  }
}

const httpServer = create(dbFixtures);
start(httpServer, config);
