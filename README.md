# WIP!
A cli tool to install plugins for the Musiqpad Pad Server

PadPlus adds a bunch of cool stuff to your musiqpad!
**Planned Features:**
* Configure your Pad using a webinterface
* Install Community-made MusiqPad Plugins
* easily create own Plugins via our feature-rich api
* Keep your MusiqPad Server up to date
* Custom themes

**Plugins**
Plugins can add both Server and client side code. Because PadPlus uses browserify
to create the client side code, you can require() npm modules.
Client side plugins have access to both the api included in vanilla musiqpad
and our custom API.
Plugins can also just add a Theme or their own css. More Infos on that soon.

**Planned Plugins (by padplus):**
* Custom MusiqPlus build for every User
* Facebook/Google/Twitter login
* Username verification (Theres a padplus pad hosted on musiqpad.com where you'll need to pm our bot to verify your username)
