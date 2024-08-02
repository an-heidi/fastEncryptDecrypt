#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
    .name('fetch-values')
    .description('CLI tool to fetch value, key, iv, and algo, and return a combined string')
    .version('1.0.0')
    .option('-v, --value <value>', 'The value to use')
    .option('-k, --key <key>', 'The key to use')
    .option('-i, --iv <iv>', 'The initialization vector to use', '')
    .option('-a, --algo <algo>', 'The algorithm to use', 'aes-256-cbc')
    .option('-t, --type <type>', 'The type of operation encrypt/decrypt', '')
    .option('--help', 'Show help', () => {
        console.log(`
    Usage: ./index.js [options]

    Options:
      -v, --value <value>      The value to use
      -k, --key <key>          The key to use
      -i, --iv <iv>            The initialization vector to use
      -a, --algo <algo>        The algorithm to use
      -t, --type <type>        The type of operation encrypt/decrypt
      --help                   Show help

    Example:
      ./index.js --value "myValue" --key "myKey" --iv "myIv" --algo "aes-256-cbc"
    `);
        process.exit(0);
    });

program.parse(process.argv);

const options = program.opts();

const { encrypt, decrypt } = require('./utils');

if (options.key.length !== 64) {
    console.error('Key must be 64 characters long');
    process.exit(1);
}

if (options.value.length === 0) {
    console.error('Value must not be empty');
    process.exit(1);
}

if (options.type && options.type.length && options.type === 'decrypt') {
    const result = decrypt(options.value, options.key);
    console.log(result);
} else {
    if (options.iv.length !== 32) {
        console.log(options.iv.length);
        console.error('Iv must be 32 characters long');
        process.exit(1);
    }
    if (options.algo.length === 0) {
        options.algo = 'aes-256-cbc';
    }
    const result = encrypt(options.value, options.key, options.iv, options.algo);
    console.log(result);
}
