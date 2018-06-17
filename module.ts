import { find } from './util';

export const findModule = file => {
  const module = find(file, 'angular.module');

  let alias = 'angular';
  if (module.indexOf('=') >= 0) {
    alias = module
      .substr(0, module.indexOf('='))
      .replace('var', '')
      .replace('const', '')
      .replace('let')
      .trim();
  }

  return {
    module: module.substr(module.indexOf('=') + 1).trim(),
    alias
  };
};
