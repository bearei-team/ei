export * from './core';
export * from './data';
export * from './error';
export * from './header';
export * from './option';
export * from './response';
export * from './url';
export { option };
export { data, error, header, response, url };

import ei from './core';
import { default as data } from './data';
import { default as error } from './error';
import { default as header } from './header';
<<<<<<< HEAD
import * as option from './option';
=======
import { option } from './option';
>>>>>>> main
import { default as response } from './response';
import { default as url } from './url';

export default ei;
