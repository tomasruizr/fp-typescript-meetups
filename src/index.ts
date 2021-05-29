import { create, start } from './server';
import config from './config.json';

export type Config = typeof config;

const server = create();
start(server, config);
