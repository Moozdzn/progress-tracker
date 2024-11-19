
  

  

## Progress Tracker

  

![Progress Tracker](https://r2.fivemanage.com/pub/5g56bkh7iqxa.png)
*Note*: This resource is **WIP**

## Features

  

-  **Dynamic Hint Registration**: Register hints with customizable headers, actions, and progress indicators.

-  **Theme Management**: Automatically switches between light and dark themes based on the time of day.

-  **Command and Key Mapping**: Easily toggle hints using commands or key mappings.

-  **Extensible**: Add or remove extra information to hints as needed.

  

## Configuration

  

The configuration for this resource is defined in `client/config.lua`:

  

-  **primaryColor**: The primary color of the hint (can be set via convars).

-  **position**: The position of the hint on the screen (can be set via convars).

-  **colorScheme**: Automatically switches between 'light' and 'dark' based on the time of day. Default is 'auto'.

-  **hideKey**: The keyboard key used to toggle the hint menu.

-  **hideCommand**: The command used to toggle the hint menu.

### Built With

* [![React][React.js]][React-url]
* [![Shadcn][Shadcn]][Shadcn-url]
* [![Framer-motion][Framer-motion]][Framer-motion-url] 
* [![Font-awesome][Font-awesome]][Font-awesome-url] 

  

## Installation

  

1. Clone the repo
2. Navigate to the web folder
	```sh
	cd web
	```
3. Install NPM packages
	```sh
	npm  install
	```

4. Run locally
	```sh
	npm  run  dev
	```

## Basic Usage

### Registering a Hint
```lua
exports.progress_tracker:registerHint('handsUp', {
    header = {
        title = "Helping hand",
        description = "Description",
        icon = "fad fa-hands-helping"
    },
    action = {
        key = "control_handsup",
        text = "Hands Up"
    },
    progress = {
        title = "Putting hands up",
        max = 100,
        progress = 0
    },
    extra = {
        {
            title = 'Extra',
            description = 'Description',
            icon = 'fad fa-hands-helping'
        }
    }
})
```

### Showing an Hint

To set a hint as active, use the `setActive` export. 
```lua
exports.progress_tracker:setActive('handsUp')
```

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Shadcn-url]: https://ui.shadcn.com/
[Shadcn]:https://img.shields.io/badge/Shadcn-black?style=for-the-badge&logo=shadcnui

[Framer-motion-url]: https://motion.dev/
[Framer-motion]:https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer


[Font-awesome-url]: https://fontawesome.com/icons
[Font-awesome]:https://img.shields.io/badge/FontAwesome-black?style=for-the-badge&logo=fontawesome
