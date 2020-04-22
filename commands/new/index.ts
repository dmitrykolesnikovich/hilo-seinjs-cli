/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 1/31/2019, 2:24:32 PM
 * @Description:
 */
import * as path from 'path';
import * as fs from 'fs';
import * as yargs from 'yargs';

import {
  showError,
  toSnakeCase,
  projectRoot,
  getAuthor,
  getProjectConfig,
  getEngine,
  getRoot,
  getTemplate,
  generate,
  assetsRoot,
  generateUnity,
  showInfo
} from '../../config';

async function create(root: string, template: string, container: string) {
  const {meta, sourceDir, overWriteDir, assetsDir} = await getProjectConfig(root, container, template);
  
  await generate(projectRoot, root, meta);

  const srcFolder = path.resolve(root, sourceDir);
  if (!fs.existsSync(srcFolder)) {
    fs.mkdirSync(srcFolder);
  }
  await generate(container, srcFolder, meta, src => /project/.test(src));

  if (overWriteDir) {
    await generate(overWriteDir, root, meta, src => path.basename(src) === 'config.js');
  }

  const gameFolder = path.resolve(srcFolder, 'game');
  if (!fs.existsSync(gameFolder)) {
    fs.mkdirSync(gameFolder);
  }
  await generate(template, gameFolder, meta);

  const assetsFolder = path.resolve(srcFolder, assetsDir);
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder);
  }
  await generate(assetsRoot, assetsFolder, meta);

  await generateUnity(root, assetsFolder, meta);
}

export async function exec(argv: yargs.Arguments) {
  const root = await getRoot(argv);

  const existedFiles = fs.readdirSync(root).filter(name => ['.git', '.DS_Store'].indexOf(name) < 0);
  if (existedFiles.length > 0) {
    showError(`Current directory is not empty: ${existedFiles.toString()}`);
  }

  const template = await getTemplate(argv);
  const engine = await getEngine(argv);

  await create(root, template, engine);

  showInfo("新建完成，请自行执行`npm i`安装新依赖。");
  showInfo("可以使用`npm run dev`进行开发，默认Url是`localhost:8888`");
  showInfo("打包请使用`npm run build`。");
}
