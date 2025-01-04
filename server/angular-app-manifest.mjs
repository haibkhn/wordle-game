
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/wordle-game/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/wordle-game"
  }
],
  assets: {
    'index.csr.html': {size: 526, hash: '21b0c474c02502e3d5f058fcec9cbbe219b41e6aa775bf377e70c078fec72ed5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1043, hash: '5d2d061c690308f79d6ed4ddb1d54f6e749891ad4ca47abe232e2c40e086cd66', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 17894, hash: 'c0e472d7e1698d7c331ea4c5fe6917f9d6e46897d6fa1796e52a75dab7db228e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
