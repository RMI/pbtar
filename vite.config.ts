import { defineConfig, Plugin, version as viteVersion } from "vite";
import type { PluginContext, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import { simpleGit } from "simple-git";
import os from "os";
import { FileEntry } from "./src/utils/validateScenarios";
import {
  assembleScenarios,
  decideIncludeInvalid,
} from "./src/utils/loadScenarios";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import pkg from "./package.json";

// Safe wrapper for OS functions with proper typing
const getOsInfo = (): {
  hostname: string;
  platform: string;
  release: string;
  arch: string;
} => {
  const safeCall = (fn: () => string, defaultValue: string): string => {
    try {
      return fn();
    } catch {
      return defaultValue;
    }
  };

  return {
    hostname: safeCall(() => os.hostname(), "unknown"),
    platform: safeCall(() => os.platform(), "unknown"),
    release: safeCall(() => os.release(), "unknown"),
    arch: safeCall(() => os.arch(), "unknown"),
  } as const;
};

const getEnv = (key: string, defaultValue?: string): string => {
  const value = (process as { env: Record<string, string | undefined> }).env?.[
    key
  ];
  if (typeof value !== "string" || value === undefined || value.trim() === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Safe wrapper for git operations
const getGitInfo = async (): Promise<{
  sha: string;
  isClean: boolean | undefined;
  branch: string;
}> => {
  try {
    const git = simpleGit();
    const [sha, status, branch] = await Promise.all([
      git.revparse(["HEAD"]).catch(() => process.env.VITE_GIT_SHA || "unknown"),
      git.status().catch(() => ({
        isClean: () => process.env.VITE_GIT_CLEAN === "true",
      })),
      git
        .revparse(["--abbrev-ref", "HEAD"])
        .catch(() => process.env.VITE_GIT_BRANCH || "unknown"),
    ]);

    return {
      sha,
      isClean: status.isClean(),
      branch,
    };
  } catch {
    // Fallback to environment variables or defaults
    return {
      sha: getEnv("VITE_GIT_SHA", "unknown"),
      isClean: getEnv("VITE_GIT_CLEAN", "unknown"),
      branch: getEnv("VITE_GIT_BRANCH", "unknown"),
    };
  }
};

// Plugin to inject git information at build time
function buildInfoPlugin(): Plugin {
  return {
    name: "vite-plugin-build-info",
    async config(_, { mode }) {
      const gitInfo = await getGitInfo();
      const osInfo = getOsInfo();
      const pkgVersion = (pkg as { version: string | undefined }).version;

      return {
        define: {
          // Build Env
          "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkgVersion),
          "import.meta.env.VITE_NODE_VERSION": JSON.stringify(process.version),
          "import.meta.env.VITE_VERSION": JSON.stringify(viteVersion),
          "import.meta.env.VITE_ENVIRONMENT": JSON.stringify(mode),
          "import.meta.env.VITE_BUILD_TIME": JSON.stringify(
            new Date().toISOString(),
          ),

          //// Git information
          "import.meta.env.VITE_GIT_SHA": JSON.stringify(gitInfo.sha),
          "import.meta.env.VITE_GIT_CLEAN": JSON.stringify(
            gitInfo.isClean ? "true" : "false",
          ),
          "import.meta.env.VITE_GIT_BRANCH": JSON.stringify(gitInfo.branch),

          // Build machine information
          "import.meta.env.VITE_BUILD_MACHINE_NAME": JSON.stringify(
            osInfo.hostname,
          ),
          "import.meta.env.VITE_BUILD_OS": JSON.stringify(osInfo.platform),
          "import.meta.env.VITE_BUILD_OS_VERSION": JSON.stringify(
            osInfo.release,
          ),
          "import.meta.env.VITE_BUILD_ARCH": JSON.stringify(osInfo.arch),
        },
      };
    },
  };
}

function dataValidationPlugin(dir: string = "src/data") {
  return {
    name: "data-validation",
    apply: "build",
    enforce: "pre",
    async buildStart(this: PluginContext) {
      const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
      const entries: FileEntry[] = [];

      for (const name of names) {
        const raw = await fs.readFile(join(dir, name), "utf8");
        entries.push({
          name,
          data: JSON.parse(raw) as Scenario[] | unknown[],
        });
      }

      // Decide lenient vs strict
      const includeInvalid = decideIncludeInvalid();

      // Validate + assemble; surface warnings via Vite's logger
      assembleScenarios(entries, {
        includeInvalid,
        warn: (msg: string): void => {
          console.warn(msg);
        },
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    buildInfoPlugin(),
    dataValidationPlugin("src/data"),
    viteStaticCopy({
      targets: [{ src: "src/schema/schema.json", dest: "" }],
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      "/schema.json",
      (
        _req: IncomingMessage,
        res: ServerResponse,
        next: (err?: unknown) => void,
      ) => {
        readFile(resolve("src/schema/schema.json"), "utf8")
          .then((json) => {
            res.setHeader("Content-Type", "application/json");
            res.end(json);
          })
          .catch(next);
      },
    );
  },
});
