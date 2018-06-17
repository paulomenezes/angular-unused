import * as fs from 'fs';
import { findModule } from './module';
import { findControl } from './controls';

const sourcePath = './source/';
const moduleFilename = 'app.js';

fs.readFile(sourcePath + moduleFilename, 'utf8', (err, file) => {
  if (err) {
    return;
  }

  moduleFile(file);
});

const moduleFile = file => {
  const { module, alias } = findModule(file);
  findControl(file, module, alias);
};
