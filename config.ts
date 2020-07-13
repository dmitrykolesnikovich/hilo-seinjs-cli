/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-27 11:08:05
 * @Description:
 */
import * as path from 'path';
import {exec} from 'child_process';
import * as inquirer from 'inquirer';
import * as yargs from 'yargs';
import * as through from 'through2';
import * as copy from 'recursive-copy';
import * as fs from 'fs';

export const DEV = false;

export const templatesRoot = path.resolve(__dirname, './templates/templates');

export const containersRoot = path.resolve(__dirname, './templates/containers');

export const projectRoot = path.resolve(__dirname, './templates/project');

export const assetsRoot = path.resolve(__dirname, './templates/assets');

export const unityRoot = path.resolve(__dirname, './templates/unity');

export const currentRoot = process.cwd();

export const TEMPLATES = [
  {name: 'Lite, a simple rendering project', value: 'lite'},
  {name: 'Tiny, a tiny project with one simple script', value: 'tiny'},
  {name: 'Simple, a simple project with starndard Sein.js gameplay framework', value: 'simple'}
];

export const ENGINES = [
  'none',
  'react',
  'wx-mini-game',
  'wx-mini-program',
  'my-tiny-game',
  'my-tiny-program'
];

export const SEIN_DEPENDENCIES = {
  seinjs: '^1.5.0',
  'cannon-dtysky': '^0.6.4',
  'seinjs-camera-controls': '^0.8.2',
  'seinjs-debug-tools': '^0.8.0',
  'seinjs-dom-hud': '^0.8.0',
  'seinjs-gpu-particle-system': '^0.8.3',
  'seinjs-audio': '^0.9.0',
  'seinjs-post-processing-system': '^0.8.0'
};

export function showError(msg: string) {
  console.error('\x1b[31m%s', `Error: ${msg}`);
  process.exit(0);
}

export function showInfo(msg: string) {
  console.info('\x1b[32m%s\x1b[0m', msg);
}

export function toSnakeCase(str: string) {
    const upperChars = str.match(/([A-Z])/g);
    if (! upperChars) {
      return str;
    }

    for (var i = 0, n = upperChars.length; i < n; i += 1) {
      str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
    }

    if (str.slice(0, 1) === '-') {
      str = str.slice(1);
    }

    return str;
}

export async function getTemplate(argv: yargs.Arguments) {
  let {template} = argv;

  if (!template) {
    template = (await inquirer.prompt<{template: string}>([
      {
        name: 'template',
        type: 'list',
        message: 'Type of template.',
        default: TEMPLATES[0],
        choices: TEMPLATES
      }
    ])).template;
  }

  return path.resolve(templatesRoot, template);
}

export async function getRoot(argv: yargs.Arguments) {
  let {root} = argv;

  if (!root) {
    root = (await inquirer.prompt<{root: string}>([
      {
        name: 'root',
        type: 'input',
        message: 'Project root folder.',
        default: '.'
      }
    ])).root;
  }

  return path.resolve(currentRoot, root);
}

export async function getEngine(argv: yargs.Arguments) {
  let {engine} = argv;

  if (!engine) {
    engine = (await inquirer.prompt<{engine: string}>([
      {
        name: 'engine',
        type: 'list',
        message: 'Container engine',
        default: 'none',
        choices: ENGINES
      }
    ])).engine;
  }

  return path.resolve(containersRoot, engine);
}

export async function getAuthor() {
  function gitConfig(field, callback) {
    var command = 'git config --get user.' + field;
    exec(command, function (err, stdout, stderr) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, stdout.toString().replace(/(\r\n|\n|\r)/gm,""));
    });
  }

  function getAll(callback) {
    gitConfig("name", function (err, name) {
      if (err) {
        callback(err);
        return;
      }

      gitConfig("email", function (err, email) {
        if (err) {
          callback(err);
          return;
        }

        callback(null, {name, email});
      });
    });
  }

  return new Promise<{name: string, email: string}>(resolve => {
    getAll((err, result) => {
      if (err) {
        resolve({name: '', email: ''});
        return;
      }

      resolve(result);
    })
  })
}

export interface IMeta {
  NAME: string;
  'AUTHOR.NAME': string;
  'AUTHOR.EMAIL': string;
  DATE: string;
  DEV_DEPENDENCIES: Object;
  DEPENDENCIES: Object;
  SCRIPTS: Object;
  WEBPACK_FILE_PREFIX: string;
  WEBPACK_MAIN_ENTRY_PREFIX: string;
  WEBPACK_MAIN_ENTRY: string;
  WEBPACK_OUTPUT_PATH: string;
  WEBPACK_OUTPUT_NAME: string;
  WEBPACK_OUTPUT_CHUNKNAME: string;
  WEBPACK_PUBLIC_PATH: string;
  WEBPACK_ASSETS_PATH: string;
  WEBPACK_OUTPUT_POSTFIX: string;
  WEBPACK_LOADER_POSTFIX: string;
  WEBPACK_PLUGIN_POSTFIX: string;
};

export async function getProjectConfig(
  root: string,
  container: string,
  template: string
): Promise<{
  meta: IMeta, 
  overWriteDir: string,
  sourceDir: string,
  assetsDir: string
}> {
  const author = await getAuthor();

  const meta = {
    NAME: toSnakeCase(root.split(/[/\\]/g).pop()),
    'AUTHOR.NAME': author.name,
    'AUTHOR.EMAIL': author.email,
    DATE: new Date().toDateString(),
    DEV_DEPENDENCIES: {},
    DEPENDENCIES: Object.assign({}, SEIN_DEPENDENCIES),
    SCRIPTS: {},
    WEBPACK_FILE_PREFIX: ``,
    WEBPACK_MAIN_ENTRY_PREFIX: '',
    WEBPACK_MAIN_ENTRY: 'src/index.ts',
    WEBPACK_OUTPUT_PATH: 'dist',
    WEBPACK_OUTPUT_NAME: '[name].[hash].js',
    WEBPACK_OUTPUT_CHUNKNAME: '[name].[hash].js',
    WEBPACK_PUBLIC_PATH: '/',
    WEBPACK_ASSETS_PATH: '',
    WEBPACK_OUTPUT_POSTFIX: '',
    WEBPACK_LOADER_POSTFIX: '',
    WEBPACK_PLUGIN_POSTFIX: '',
  };
  const config = {meta, overWriteDir: '', sourceDir: 'src', assetsDir: 'assets'};
  config.meta.WEBPACK_ASSETS_PATH = path.join(config.sourceDir, config.assetsDir);

  container = container.split('/').pop() as any;

  if (!container) {
    return config;
  }

  const cDir = path.resolve(containersRoot, container);
  const cProjectDir = path.resolve(cDir, 'project');
  const cConfigPath = path.resolve(cProjectDir, 'config.js');

  if (!fs.existsSync(cProjectDir)) {
    return config;
  }

  config.overWriteDir = cProjectDir;

  if (!fs.existsSync(cConfigPath)) {
    return config;
  }

  const c = await import(cConfigPath) || {};

  c.meta.DEPENDENCIES = Object.assign(c.meta.DEPENDENCIES, config.meta.DEPENDENCIES);
  Object.assign(config.meta, c.meta);
  config.sourceDir = c.sourceDir || config.sourceDir;
  config.assetsDir = c.assetsDir || config.assetsDir;

  return config;
}

export async function generate(
  templatePath: string,
  root: string,
  meta: IMeta,
  filter: (src: string) => boolean = () => false
) {
  const {DEPENDENCIES, DEV_DEPENDENCIES, SCRIPTS, ...strMeta} = meta;
  const options = {
    overwrite: true,
    dot: true,
    filter: (src: string) => !(/\.git\//.test(src) || filter(src)),
    transform: (src, dest, stats) => {
      return through((chunk, enc, done) =>  {
        let output;

        if (['.jpg', '.png', '.bmp', '.tileset', '.bin', '.unitypackage', '.glb', '.dll', '.pdb'].indexOf(path.extname(src)) > -1) {
          output = chunk;
        } else {
          output = chunk.toString();

          if (path.basename(src) === 'package.json') {
            output = JSON.parse(output);
            if (output.dependencies) {
              Object.assign(output.dependencies, DEPENDENCIES);
            }
            if (output.devDependencies) {
              Object.assign(output.devDependencies, DEV_DEPENDENCIES);
            }
            if (output.scripts) {
              Object.assign(output.scripts, SCRIPTS);
            }
            output = JSON.stringify(output, null, 2);
          }

          Object.keys(strMeta).forEach(key => {
            output = output.replace(new RegExp(`{{${key}}}`, 'g'), strMeta[key].trim());
          });
        }

        done(null, output);
      });
    }
  };

  try {
    await copy(templatePath, root, options)
      .on(copy.events.COPY_FILE_START, copyOperation => {
        showInfo(`Generate ${copyOperation.dest}...`);
      });
  } catch (error) {
    showError(`Generate failed: ${error}\nPlease clean current directory and retry !`);
  }
}

export async function generateUnity(root: string, assetsFolder: string, meta: IMeta) {
  const unityFolder = path.resolve(root, 'unity');

  if (!fs.existsSync(unityFolder)) {
    fs.mkdirSync(unityFolder);
  }

  await generate(unityRoot, unityFolder, meta);

  // const configPath = path.resolve(unityFolder, 'Assets/SeinJSUnityToolkit/src/config.json');
  // const config = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf8'}));
  // config.exportPath = path.relative(path.resolve(unityFolder, 'Assets'), path.resolve(assetsFolder, 'gltfs'));
  // fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
