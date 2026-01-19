
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/admin"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 2056, hash: '45b846f477a232a9ffbe01a383d8cf83a9c54a120229d8e557ff6f2a419626e3', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 953, hash: '34d53439535fa7f9e04e95b06ad1dba6a48283435b10ee0c263734af17af8ce9', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IXCXXKII.css': {size: 18993, hash: 'y8bjvpopuWs', text: () => import('./assets-chunks/styles-IXCXXKII_css.mjs').then(m => m.default)}
  },
};
