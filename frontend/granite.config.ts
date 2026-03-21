// @apps-in-toss/web-framework

export default {
  appName: 'komjirak-bible',
  brand: {
    displayName: '말씀필사'
  },
  webViewProps: {
    type: 'web'
  },
  outdir: 'dist',
  web: {
    commands: {
      build: 'npm run build'
    }
  }
};
