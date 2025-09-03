# Drawing Manager

A small project, made with :heart: by Rei Ebenezer.

The `Drawing Manager` is an Excalidraw clone with local file management integrated into it. 

## Setup

This is a [`Next.js`](https://nextjs.org) application. You can download the app by cloning the repository:

```sh
git clone https://github.com/Reiebenezer/drawing-manager.git
```

and then run `npm install` or `bun install`, depending on the package manager you're using. 

> Note that this requires you to have a runtime installed, such as Node or Bun. 

## Starting the App


### Development 
Run the following command to start the development server:

```sh
npm run dev
```

### Build
Building the application is as easy as calling the following commands: 

```sh
npm run build
```

and for previewing your build:
```sh
npm run start
```
### Standalone

You could also consider building a standalone version, via the following commands:

```sh
npm run build-standalone # for building
npm run start-standalone # for starting the server on the standalone build
```
> I recommend using the `standalone` build for long-term use. Only use the development server when you are planning to contribute to this project.


### Ports
This application defaults to using port `9000`. If you want to use a different port, change the port number in the `dev` and `start-standalone` scripts in `package.json`.

## File Management

Excalidraw files (.excalidraw) are automatically created in the `projects` directory on launch. You can add your own .excalidraw files from the web to this folder, then refresh the page. Your files will be automatically imported. 

> Don't forget to create a backup of your original .excalidraw file first to avoid any issues. This application is in **alpha**, and breaking changes may occur.

## Contributing

You can create a pull request of this repository, or raise an issue. Thank you very much! :heart: