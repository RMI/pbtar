import { defineConfig, Plugin, version as viteVersion } from 'vite';
import react from '@vitejs/plugin-react';
import { simpleGit } from 'simple-git';
import os from 'os';
import pkg from './package.json';

// Safe wrapper for OS functions with proper typing
const getOsInfo = () => {
  const safeCall = <T>(fn: () => T, defaultValue: T): T => {
    try {
      return fn();
    } catch {
      return defaultValue;
    }
  };

  return {
    hostname: safeCall(() => os.hostname(), 'unknown'),
    platform: safeCall(() => os.platform(), 'unknown'),
    release: safeCall(() => os.release(), 'unknown'),
    arch: safeCall(() => os.arch(), 'unknown')
  } as const;
};

// Safe wrapper for git operations
const getGitInfo = async () => {
  try {
    const git = simpleGit();
    const [sha, status, branch] = await Promise.all([
      git.revparse(['HEAD']).catch(() => process.env.VITE_GIT_SHA || 'unknown'),
      git.status().catch(() => ({ isClean: () => process.env.VITE_GIT_CLEAN === 'true' })),
      git.revparse(['--abbrev-ref', 'HEAD']).catch(() => process.env.VITE_GIT_BRANCH || 'unknown')
    ]);

    return {
      sha,
      isClean: status.isClean(),
      branch
    };
  } catch (error) {
    // Fallback to environment variables or defaults
    return {
      sha: process.env.VITE_GIT_SHA || 'unknown',
      isClean: process.env.VITE_GIT_CLEAN === 'unknown',
      branch: process.env.VITE_GIT_BRANCH || 'unknown'
    };
  }
};

// Plugin to inject git information at build time
function gitInfoPlugin(): Plugin {
  return {
    name: 'vite-plugin-git-info',
    async config(_, { mode }) {
      const gitInfo = await getGitInfo();
      const osInfo = getOsInfo();
      const pkgVersion = pkg?.version ?? 'unknown';
      
      return {
        define: {
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkgVersion),
          'import.meta.env.VITE_GIT_SHA': JSON.stringify(gitInfo.sha),
          'import.meta.env.VITE_GIT_CLEAN': JSON.stringify(gitInfo.isClean ? 'true' : 'false'),
          'import.meta.env.VITE_GIT_BRANCH': JSON.stringify(gitInfo.branch),
          'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(mode),
          'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
          'import.meta.env.VITE_NODE_VERSION': JSON.stringify(process.version),
          'import.meta.env.VITE_VERSION': JSON.stringify(viteVersion),
          // Build machine information
          'import.meta.env.VITE_BUILD_MACHINE_NAME': JSON.stringify(osInfo.hostname),
          'import.meta.env.VITE_BUILD_OS': JSON.stringify(osInfo.platform),
          'import.meta.env.VITE_BUILD_OS_VERSION': JSON.stringify(osInfo.release),
          'import.meta.env.VITE_BUILD_ARCH': JSON.stringify(osInfo.arch),
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
