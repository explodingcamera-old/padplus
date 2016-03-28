# PadPlus

A cli tool to install plugins for the Musiqpad Pad Server
[![npm](https://img.shields.io/npm/dt/padplus.svg)]()
(PadPlus is still in alpha and might contain Bugs, if you find any, please report them and/or send a pr)

## Installation

just do `npm i -g padplus`. More [Infos](https://github.com/explodingcamera/padplus/wiki/Installing-PadPlus)

## Features

- Install Community-made MusiqPad Plugins
- easily create own Plugins via our feature-rich api
- Keep your MusiqPad Server up to date

## Plugins

Plugins can add both Server and client side code. Because PadPlus uses browserify to create the client side code, you can require() npm modules. Client side plugins have access to both the api included in vanilla musiqpad and our custom API. Plugins can also just add a Theme or their own css. More Infos on the wiki.

## Planned Features:

- Configure your Pad using a webinterface
- Custom themes

## Planned Plugins (by padplus):

- Custom MusiqPlus build for every User
- Facebook/Google/Twitter login
- Username verification (Theres a padplus pad hosted on musiqpad.com where you'll need to pm our bot to verify your username)
