"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-7-27 11:08:05
 * @Description:
 */
const path = require("path");
const child_process_1 = require("child_process");
const inquirer = require("inquirer");
const through = require("through2");
const copy = require("recursive-copy");
const fs = require("fs");
exports.DEV = false;
exports.templatesRoot = path.resolve(__dirname, './templates/templates');
exports.containersRoot = path.resolve(__dirname, './templates/containers');
exports.projectRoot = path.resolve(__dirname, './templates/project');
exports.assetsRoot = path.resolve(__dirname, './templates/assets');
exports.unityRoot = path.resolve(__dirname, './templates/unity');
exports.currentRoot = process.cwd();
exports.TEMPLATES = [
    { name: 'Lite, a simple rendering project', value: 'lite' },
    { name: 'Tiny, a tiny project with one simple script', value: 'tiny' },
    { name: 'Simple, a simple project with starndard Sein.js gameplay framework', value: 'simple' }
];
exports.ENGINES = [
    'none',
    'react',
    'my-tiny-game',
    'my-tiny-program'
];
exports.SEIN_DEPENDENCIES = {
    seinjs: '^1.4.0',
    'cannon-dtysky': '^0.6.4',
    'seinjs-camera-controls': '^0.8.2',
    'seinjs-debug-tools': '^0.8.0',
    'seinjs-dom-hud': '^0.8.0',
    'seinjs-gpu-particle-system': '^0.8.3',
    'seinjs-audio': '^0.9.0',
    'seinjs-post-processing-system': '^0.8.0'
};
function showError(msg) {
    console.error('\x1b[31m%s', `Error: ${msg}`);
    process.exit(0);
}
exports.showError = showError;
function showInfo(msg) {
    console.info('\x1b[32m%s\x1b[0m', msg);
}
exports.showInfo = showInfo;
function toSnakeCase(str) {
    const upperChars = str.match(/([A-Z])/g);
    if (!upperChars) {
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
exports.toSnakeCase = toSnakeCase;
function getTemplate(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let { template } = argv;
        if (!template) {
            template = (yield inquirer.prompt([
                {
                    name: 'template',
                    type: 'list',
                    message: 'Type of template.',
                    default: exports.TEMPLATES[0],
                    choices: exports.TEMPLATES
                }
            ])).template;
        }
        return path.resolve(exports.templatesRoot, template);
    });
}
exports.getTemplate = getTemplate;
function getRoot(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let { root } = argv;
        if (!root) {
            root = (yield inquirer.prompt([
                {
                    name: 'root',
                    type: 'input',
                    message: 'Project root folder.',
                    default: '.'
                }
            ])).root;
        }
        return path.resolve(exports.currentRoot, root);
    });
}
exports.getRoot = getRoot;
function getEngine(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        let { engine } = argv;
        if (!engine) {
            engine = (yield inquirer.prompt([
                {
                    name: 'engine',
                    type: 'list',
                    message: 'Container engine',
                    default: 'none',
                    choices: exports.ENGINES
                }
            ])).engine;
        }
        return path.resolve(exports.containersRoot, engine);
    });
}
exports.getEngine = getEngine;
function getAuthor() {
    return __awaiter(this, void 0, void 0, function* () {
        function gitConfig(field, callback) {
            var command = 'git config --get user.' + field;
            child_process_1.exec(command, function (err, stdout, stderr) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, stdout.toString().replace(/(\r\n|\n|\r)/gm, ""));
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
                    callback(null, { name, email });
                });
            });
        }
        return new Promise(resolve => {
            getAll((err, result) => {
                if (err) {
                    resolve({ name: '', email: '' });
                    return;
                }
                resolve(result);
            });
        });
    });
}
exports.getAuthor = getAuthor;
;
function getProjectConfig(root, container, template) {
    return __awaiter(this, void 0, void 0, function* () {
        const author = yield getAuthor();
        const meta = {
            NAME: toSnakeCase(root.split(/[/\\]/g).pop()),
            'AUTHOR.NAME': author.name,
            'AUTHOR.EMAIL': author.email,
            DATE: new Date().toDateString(),
            DEV_DEPENDENCIES: {},
            DEPENDENCIES: Object.assign({}, exports.SEIN_DEPENDENCIES),
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
        const config = { meta, overWriteDir: '', sourceDir: 'src', assetsDir: 'assets' };
        config.meta.WEBPACK_ASSETS_PATH = path.join(config.sourceDir, config.assetsDir);
        container = container.split('/').pop();
        if (!container) {
            return config;
        }
        const cDir = path.resolve(exports.containersRoot, container);
        const cProjectDir = path.resolve(cDir, 'project');
        const cConfigPath = path.resolve(cProjectDir, 'config.js');
        if (!fs.existsSync(cProjectDir)) {
            return config;
        }
        config.overWriteDir = cProjectDir;
        if (!fs.existsSync(cConfigPath)) {
            return config;
        }
        const c = (yield Promise.resolve().then(() => require(cConfigPath))) || {};
        c.meta.DEPENDENCIES = Object.assign(c.meta.DEPENDENCIES, config.meta.DEPENDENCIES);
        Object.assign(config.meta, c.meta);
        config.sourceDir = c.sourceDir || config.sourceDir;
        config.assetsDir = c.assetsDir || config.assetsDir;
        return config;
    });
}
exports.getProjectConfig = getProjectConfig;
function generate(templatePath, root, meta, filter = () => false) {
    return __awaiter(this, void 0, void 0, function* () {
        const { DEPENDENCIES, DEV_DEPENDENCIES, SCRIPTS } = meta, strMeta = __rest(meta, ["DEPENDENCIES", "DEV_DEPENDENCIES", "SCRIPTS"]);
        const options = {
            overwrite: true,
            dot: true,
            filter: (src) => !(/\.git\//.test(src) || filter(src)),
            transform: (src, dest, stats) => {
                return through((chunk, enc, done) => {
                    let output;
                    if (['.jpg', '.png', '.bmp', '.tileset', '.bin', '.unitypackage', '.glb', '.dll', '.pdb'].indexOf(path.extname(src)) > -1) {
                        output = chunk;
                    }
                    else {
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
            yield copy(templatePath, root, options)
                .on(copy.events.COPY_FILE_START, copyOperation => {
                showInfo(`Generate ${copyOperation.dest}...`);
            });
        }
        catch (error) {
            showError(`Generate failed: ${error}\nPlease clean current directory and retry !`);
        }
    });
}
exports.generate = generate;
function generateUnity(root, assetsFolder, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const unityFolder = path.resolve(root, 'unity');
        if (!fs.existsSync(unityFolder)) {
            fs.mkdirSync(unityFolder);
        }
        yield generate(exports.unityRoot, unityFolder, meta);
        // const configPath = path.resolve(unityFolder, 'Assets/SeinJSUnityToolkit/src/config.json');
        // const config = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf8'}));
        // config.exportPath = path.relative(path.resolve(unityFolder, 'Assets'), path.resolve(assetsFolder, 'gltfs'));
        // fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });
}
exports.generateUnity = generateUnity;
