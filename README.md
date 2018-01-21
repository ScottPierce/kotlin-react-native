## Pull Requests Welcome!

## Running the Project on Mac
1. Install yarn. [Homebrew](https://brew.sh/) for mac is highly recommended. Skip this if you already have it installed
2. Run `yarn install` to install all the javascript dependencies.
3. Run `./gradlew -t :shared:assemble` - compiles the Kotlin javascript module located in `./shared`, and watches it for changes. Leave this terminal open. Remove the `-t` argument if you don't want gradle to watch for changes and auto-rebuild.
4. Open a new terminal window and run `yarn haul start`. After a few seconds, it will prompt you asking which platform to bundle for. Select the `android` platform. Add the `--platform android` parameter to select the android platform automatically.
5. Run the Android app in an Android emulator. It should display the `HelloWorld` react component located in the `Main.kt` file in the `./shared` module.
6. Any changes you make in the `./shared` module should auto-trigger builds thanks to what we did in step 3. If using IntelliJ or Android Studio, files aren't always saved instantly. Pressing `⌘ + S` will trigger a save of all changed files, and gradle should see the changes, and trigger another build within a second or 2. After the js files have changed, pres `rr` in the emulator to trigger a js code reload.
7. Press the Android `menu` key on the emulator (You know... that key from 4 years ago that the `ActionBar` replaced) to see a debug menu allowing several debug options, including debugging.


## Why use Haul instead of metro (the default react-native packager)?
This example uses [Haul](https://github.com/callstack/haul), an open-source, drop-in replacement for the react-native bundler. The default react-native bundler is [metro](https://github.com/facebook/metro), which has 2 known issues when using Kotlin currently:
1. [The bundler will time-out while packaging the kotlin.js library (which is 1.4MB, 37k lines)](https://github.com/facebook/metro/issues/123). There are some known work-arounds discussed in the link for this.
2. [Source-maps aren't properly merged](https://github.com/facebook/metro/issues/104). There are no known work-arounds for this. The effect of this is that you can't properly debug Kotlin source files, or get proper stack-traces. 


## Project Structure
* `./android` - Base android project directory
* `./ios` - Base ios project directory
* `./shared` - The module compiled to javascript that runs react-native
* `./index.js` - The entry point for the react-native js application. All this file does currently is defer to the `Main.kt` in the `./shared` module.


## TODO:
1. Have the Android gradle `:android:assemble` commands depend on the corresponding `:shared:assemble` commands.


## Known issues:
1. [https://github.com/callstack/haul/issues/338](https://github.com/callstack/haul/issues/338)

## How does React-Native Work?
The best place to read about this is the [React-Native Documentation](https://facebook.github.io/react-native/docs/getting-started.html), however here is a high level working model for those who are brand new to React-Native:

React-Native can be thought of as a mini js server running alongside the android / ios application. In production the js code runs inside the android / ios applications on it's own separate thread. It communicates back and fourth with the main application through a single socket connection. When debugging the javascript application, the javascript code is run inside a chrome browser (debugging is done in chrome), and communicates back-and fourth with the main application through that same socket.

To display screens / ui, a representation of how to display all the data on the screen, along with any data that needs to be displayed, is serialized and sent to the main application thread, and then it will use native android / iOS `View`'s to create the View representation described in the React `Component`.

In development, the javascript code isn't packaged with the application. It's instead delivered to the running application by a locally hosted server. Any changes to the js files are automatically packaged by `haul`, and then can be delivered to the mobile application without rebuilding by pressing `rr` in the Android emulator, or pressing the Android `menu` key, and selecting `Reload`.

Any events (i.e. click events) are serialized, and sent back to the javascript thread for javascript to handle / process.
