<div align="center">
<img src="public/symfony-color-128.png" alt="logo"/>
</div>

# Symfony Profiler Chrome Extension

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Installation](#installation)
  - [Procedures](#procedures)
- [Usefull links](#links)
- [Tools](#tools)

## Intro <a name="intro"></a>

This chrome extension is here to help symfony developers during their development experience. It list all symfony http call(doc/httpRequest), and provides details and direct links to them. 


## Features <a name="features"></a>

- copy to clipboard as cUrl accessible through a simple button
- details request body/payload
- details request headers
- details response headers
- link to request profiler page


## Installation <a name="installation"></a>

### Procedures <a name="procedures"></a>
1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest** 
3. Run `yarn install` or `npm i` (check your node version >= 16.6, recommended >= 18)
4. Run `yarn dev` or `npm run dev`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `yarn build` or `npm run build`.


## Usefull links <a name="links"></a>

- chrome://inspect/#service-workers
- chrome://extensions/


## Tools <a name="tools"></a>

- [React 18](https://reactjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- HRR (Hot Rebuild & Refresh/Reload)

## Thanks To
 - [Jetbrains](https://jb.gg/OpenSourceSupport)
   - [Jackson Hong](https://www.linkedin.com/in/j-acks0n/)
 - [Jonghakseo's github](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
   - [Jonghakseo](https://nookpi.tistory.com/)

