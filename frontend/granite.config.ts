// @apps-in-toss/web-framework

export default {
  appName: 'komjirak-bible',
  brand: {
    displayName: '말씀필사',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/5277/5d9b8f52-2eba-4b03-93df-e77bb3241c73.png'
  },
  webViewProps: {
    type: 'partner'
  },
  outdir: 'dist',
  web: {
    commands: {
      dev: 'vite',
      build: 'npm run build'
    }
  }
};
