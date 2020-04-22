/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 1/31/2019, 2:24:41 PM
 * @Description:
 */
import * as path from 'path';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as yargs from 'yargs';
import * as through from 'through2';

import {
  showError,
  toSnakeCase,
  projectRoot,
  getAuthor,
  getProjectConfig,
  getRoot,
  getTemplate,
  generate,
  assetsRoot,
  showInfo,
  SEIN_DEPENDENCIES,
  generateUnity
} from '../../config';

async function getSource(argv: yargs.Arguments, root: string) {
  let {source} = argv;

  if (!source) {
    source = (await inquirer.prompt<{source: string}>([
      {
        name: 'source',
        type: 'input',
        message: 'Source folder',
        default: './src'
      }
    ])).source;
  }

  return path.resolve(root, source);
}

async function getAssets(argv: yargs.Arguments, source: string) {
  let {assets} = argv;

  if (!assets) {
    assets = (await inquirer.prompt<{assets: string}>([
      {
        name: 'assets',
        type: 'input',
        message: 'Assets folder(Relative to source folder)',
        default: './assets'
      }
    ])).assets;
  }

  return path.resolve(source, assets);
}

async function create(root: string, source: string, assets: string, template: string) {
  const meta = (await getProjectConfig(root, '', template)).meta;

  const gameFolder = path.resolve(source, 'game');
  if (!fs.existsSync(gameFolder)) {
    fs.mkdirSync(gameFolder);
  }

  await generate(template, gameFolder, meta);
  await generate(assetsRoot, assets, meta);

  await generateUnity(root, assets, meta);

  const packagePath = path.resolve(root, 'package.json');
  const packageInfo = JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf8'}));
  const dependencies = packageInfo.dependencies = packageInfo.dependencies || {};

  for (const key in SEIN_DEPENDENCIES) {
    if (!dependencies[key]) {
      dependencies[key] = SEIN_DEPENDENCIES[key];
    }
  }

  fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2));
}

export async function exec(argv: yargs.Arguments) {
  const root = await getRoot(argv);

  if (fs.readdirSync(root).indexOf('package.json') < 0) {
    showError(`Current directory has no "package.json" file: ${root}`);
  }

  const source = await getSource(argv, root);

  if (!fs.existsSync(source)) {
    showError(`Source directory is not existed: ${source}`);
  }

  const assets = await getAssets(argv, source);

  if (!fs.existsSync(assets)) {
    fs.mkdirSync(assets);
  }

  const template = await getTemplate(argv);

  await create(root, source, assets, template);

  showInfo("追加完成，请自行执行`npm i`安装新依赖。");
  showInfo("并且`import {main} from './game';`引入游戏入口");
  showInfo("之后使用`const game = main(canvas);`初始化游戏");
  showInfo("不要忘了在必要时使用`game.destroy();`进行销毁，避免内存泄漏！");
  showInfo("如果要引入gltf或者atlas文件，请见`seinjs-gltf-loader`和`seinjs-atlas-loader`！");
}
