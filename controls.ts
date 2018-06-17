import { find, findBetween } from './util';

export const findControl = (file, module, alias) => {
  const config = find(file, alias + '.config');
  const run = find(file, alias + '.run');

  const files = [];
  files.push(proccess(config, 'config'));
  files.push(proccess(run, 'run'));

  console.log('module', processModule(module));
  console.log('files', files);

  let routes = [];
  files.forEach(file => {
    if (file.usedInjections.indexOf('$routeProvider') > -1) {
      routes = processRouteProvider(config);
    }
  });

  console.log('routes', routes);
};

const processModule = module => {
  module = findBetween(module, '(', ')');

  const name = module.substring(0, module.indexOf(',')).replace(/'/g, '');
  const dependencies = findBetween(module, '[', ']')
    .replace(/'/g, '')
    .replace(/\n/g, '')
    .replace(/ /g, '')
    .split(',');

  return {
    name,
    dependencies
  };
};

const proccess = (config, name?) => {
  let getInjections = config.substr(config.indexOf('function'));
  getInjections = getInjections.substr(0, getInjections.indexOf('{'));

  const injenctions = findBetween(getInjections, '(', ')')
    .replace(/ /g, '')
    .trim()
    .split(',');
  const usedInjections = [];
  const unusedInjections = [];

  const configBody = config.substr(config.indexOf('{'));

  injenctions.forEach(injenction => {
    if (configBody.indexOf(injenction) >= 0) {
      usedInjections.push(injenction);
    } else {
      unusedInjections.push(injenction);
    }
  });

  return {
    name,
    injenctions,
    usedInjections,
    unusedInjections
  };
};

const processRouteProvider = code => {
  code = findBetween(code, '$routeProvider', ';');
  code = code
    .replace(/ /g, '')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .replace(/'/g, '');

  const whens = code.split('.when');
  whens.splice(0, 1);
  whens.pop();

  const routes = [];

  whens.forEach(when => {
    const path = when.substring(when.indexOf('(') + 1, when.indexOf(','));
    const info = findBetween(when, '{', '}').split(',');

    let templateUrl = info[0].split(':')[1];
    let controllerName = info[1].split(':')[1];

    routes.push({ path, templateUrl, controllerName });
  });

  return routes;
};
