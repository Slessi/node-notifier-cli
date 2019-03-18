#!/usr/bin/env node

// tslint:disable: no-var-requires
const Notification = require("node-notifier").Notification;
const usage = require("cli-usage");
const minimist = require("minimist");

const aliases = {
    help: "h",
    title: "t",
    subtitle: "st",
    message: "m",
    icon: "i",
    sound: "s",
    open: "o",
    port: "p",
    failsafe: "x",
};

const argv = minimist(process.argv.slice(2), {
    alias: aliases,
    string: ["icon", "message", "open", "subtitle", "title", "host", "port", "failsafe"],
});

readme(aliases, ["host"]);

const validOpts = Object.keys(aliases).concat("host");
const passedOptions = getOptionsIfExists(validOpts, argv);

doNotification(passedOptions);

function doNotification(options) {
    const notifier = new Notification(options);

    if (!options.message) {
        // Do not show an empty message
        process.exit(0);
    }

    notifier.notify(options, (err) => {
        if (err) {
            // tslint:disable-next-line: no-console
            console.error(err.message);
            process.exit(1);
        }

        process.exit(0);
    });
}

function getOptionsIfExists(optionTypes, argv) {
    return optionTypes.reduce((options, key) => {
        if (key && argv[key]) {
            options[key] = key === "sound" && argv[key] === "none" ? false : argv[key];
        }

        return options;
    }, {});
}

function readme(input, extra) {
    usage(`# notify

## Options
${params(input, extra)}

## Example
\`\`\`shell
$ notify -t "Hello" -m "My Message" -s --open http://github.com
$ notify -t "Agent Coulson" --icon https://raw.githubusercontent.com/mikaelbr/node-notifier/master/example/coulson.jpg
$ notify -m "My Message" -s Glass
$ echo "My Message" | notify -t "Hello"
\`\`\`

`);
}

function params(input, extra) {
    const withAlias = Object.keys(input).reduce((acc, key) => `${acc} * --${key} (alias -${input[key]})\n`, "");

    if (!extra) {
        return withAlias;
    }

    return withAlias + extra.reduce((acc, key) => `${acc} * --${key}\n`, "");
}
