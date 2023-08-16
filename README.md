# StcStk

Something for theoretical computer science toolkit or for short Stcstk 
(pronounced "stick-stick" /stɪk'.stɪk/) is a web app to visualize some
concepts of theoretical computer science.

## Roadmap

- [ ] general UI
    - [ ] multi-view 
- [ ] Type 3 Languages
    - [ ] DFA visualization
    - [ ] NFA visualization 
    - [ ] DFA/NFA export & import 
    - [ ] NFA to DFA conversion
    - [ ] Regex to NFA conversion
    - [ ] Regex visualization 
    - [ ] Extend Regex
    - [ ] Type 3 Language to NFA conversion (and the other way around)
    - [ ] DFA optimization
- [ ] Type 2 Languages 
    - [ ] DPDA visualization 
    - [ ] PDA visualization
    - [ ] Type 2 language to PDA conversion
- [ ] Type 0 & 1 Languages 
    - [ ] TM visualization
    - [ ] Grammar identification
    - [ ] Grammar compatible identification (impossible mby, idk)
- [ ] performance optimizations
    - [ ] Wasm?

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
