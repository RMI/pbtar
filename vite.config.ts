import { defineConfig, Plugin, version as viteVersion } from 'vite';
import react from '@vitejs/plugin-react';
import { simpleGit } from 'simple-git';
import os from 'os';
import pkg from './package.json';

// Plugin to inject git information at build time
function gitInfoPlugin(): Plugin {
  return {
    name: 'vite-plugin-git-info',
    async config(_, { mode }) {
      const git = simpleGit();
      const sha = await git.revparse(['HEAD']);
      const status = await git.status();
      const isClean = status.isClean();
      const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
      
      return {
        define: {
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
          'import.meta.env.VITE_GIT_SHA': JSON.stringify(sha),
          'import.meta.env.VITE_GIT_CLEAN': JSON.stringify(isClean),
          'import.meta.env.VITE_GIT_BRANCH': JSON.stringify(branch),
          'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(mode),
          'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
          'import.meta.env.VITE_NODE_VERSION': JSON.stringify(process.version),
          'import.meta.env.VITE_VERSION': JSON.stringify(viteVersion),
          // Build machine information
          'import.meta.env.VITE_BUILD_MACHINE_NAME': JSON.stringify(os.hostname()),
          'import.meta.env.VITE_BUILD_OS': JSON.stringify(os.platform()),
          'import.meta.env.VITE_BUILD_OS_VERSION': JSON.stringify(os.release()),
          'import.meta.env.VITE_BUILD_ARCH': JSON.stringify(os.arch()),
        },
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), gitInfoPlugin()],
  server: {
    open: true,
    port: 3000,
  },
});
