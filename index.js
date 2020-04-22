#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-5-7 19:13:02
 * @Description:
 */
const Yargs = require("yargs");
const config_1 = require("./config");
const config_2 = require("./config");
const cmdNew = require("./commands/new");
const cmdMerge = require("./commands/merge");
const { argv } = Yargs
    .command('$0', 'Sein.js工程相关脚手架，使用 `seinjs -h` 查看所有有效指令。')
    .usage('Usage: $0 <command> [options]')
    .command('new', '直接创建一个全新的Sein.js工程。', yargs => yargs
    .example('$0 new -t simple', '选择了simple模板。')
    .example('$0 new -r .', '创建在当前目录。')
    .example('$0 new -e none', '不依赖视图引擎，纯Sein.js项目。')
    .example('$0 new -n my-project', '项目名为`my-project`。')
    .example('$0 new', '不指定模板，进入选择模式。')
    .alias('t', 'template')
    .describe('t', `指定一个模板，不指定将进入选择模式，可选${config_2.TEMPLATES.join(', ')}。`)
    .alias('r', 'root')
    .describe('r', '指定要创建工程的目录。')
    .alias('c', 'container')
    .describe('t', `指定容器引擎，可选${config_2.ENGINES.join(', ')}`))
    .command('merge', '在现有项目中追加Sein.js的功能，但需要自己做出些许修改。', yargs => yargs
    .example('$0 merge -t simple', '选择了simple模板。')
    .example('$0 merge -s src', '以`src`作为工程源码目录。')
    .example('$0 merge -a assets', '以`src/assets`作为资源目录。')
    .example('$0 merge', '不指定内容，进入选择模式。')
    .alias('t', 'template')
    .describe('t', `指定一个模板，不指定将进入选择模式，可选${config_2.TEMPLATES.join(', ')}。`)
    .alias('r', 'root')
    .describe('r', '指定要创建工程的目录。')
    .alias('s', 'src')
    .describe('s', '指定工程中的source目录。')
    .alias('a', 'assets')
    .describe('a', '指定工程中静态资源的目录，相对于source目录。'))
    .command('compress', '（预留）压缩指定gltf或指定目录下的所有gltf资源')
    .help('h')
    .alias('h', 'help');
if (['new', 'merge'].indexOf(argv._[0]) < 0) {
    config_1.showError('无此指令, 使用 `seinjs -h` 查看所有有效指令。');
}
if (argv._[0] === 'new') {
    cmdNew.exec(argv);
}
if (argv._[0] === 'merge') {
    cmdMerge.exec(argv);
}
