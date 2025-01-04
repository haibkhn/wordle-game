
export default {
  basePath: '/wordle-game/',
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
