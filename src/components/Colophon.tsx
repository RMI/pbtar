import React, { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface ColophonProps {
  className?: string;
}

interface SystemInfo {
  userAgent: string;
  screenResolution: string;
  connectionType: string;
  language: string;
  devicePixelRatio: string;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
  };
}

const Colophon: React.FC<ColophonProps> = ({ className = "" }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    userAgent: "Loading...",
    screenResolution: "Loading...",
    connectionType: "Loading...",
    language: "Loading...",
    devicePixelRatio: "Loading...",
  });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    const getConnectionInfo = () => {
      if ("connection" in navigator) {
        const conn = navigator as unknown as NetworkInformation;
        const effectiveType =
          conn.connection?.effectiveType ?? conn.effectiveType ?? "unknown";
        const downlink = conn.connection?.downlink ?? conn.downlink ?? 0;
        return `${effectiveType} (${downlink}Mbps)`;
      }
      return "Not available";
    };

    setSystemInfo({
      userAgent: navigator.userAgent,
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: getConnectionInfo(),
      language: navigator.language || "N/A",
      devicePixelRatio: `${window.devicePixelRatio}x`,
    });
  }, []);

  const formatInfoForCopy = () => {
    type EnvValue = string | boolean | undefined;

    const getEnvValue = (key: string, defaultValue: string = "N/A"): string => {
      const value = import.meta.env[key] as EnvValue;
      if (typeof value === "boolean") return String(value);
      return value?.toString() ?? defaultValue;
    };

    const sections = {
      "Build Info": {
        "App Version": getEnvValue("VITE_APP_VERSION"),
        "Git SHA": getEnvValue("VITE_GIT_SHA"),
        "Branch": getEnvValue("VITE_GIT_BRANCH"),
        "Working Directory Clean": String(getEnvValue("VITE_GIT_CLEAN")),
        "Environment": getEnvValue("VITE_ENVIRONMENT", "development"),
        "Build Time": getEnvValue("VITE_BUILD_TIME"),
        "Node Version": getEnvValue("VITE_NODE_VERSION"),
        "Vite Version": getEnvValue("VITE_VERSION"),
      },
      "Runtime Info": {
        "User Agent": systemInfo.userAgent,
        "Screen Resolution": systemInfo.screenResolution,
        "Device Pixel Ratio": systemInfo.devicePixelRatio,
        "Language": systemInfo.language,
        "Connection": systemInfo.connectionType,
      },
      "GitHub Build Info": {
        "Actor": getEnvValue("VITE_GITHUB_ACTOR"),
        "Event": getEnvValue("VITE_GITHUB_EVENT_NAME"),
        "Repository": getEnvValue("VITE_GITHUB_REPOSITORY"),
        "Ref": getEnvValue("VITE_GITHUB_REF"),
        "Merge SHA": getEnvValue("VITE_GITHUB_SHA"),
        "Head SHA": getEnvValue("VITE_GITHUB_HEAD_SHA"),
        "Workflow": getEnvValue("VITE_GITHUB_WORKFLOW"),
        "Workflow Ref": getEnvValue("VITE_GITHUB_WORKFLOW_REF"),
        "Workflow SHA": getEnvValue("VITE_GITHUB_WORKFLOW_SHA"),
        "Run ID": getEnvValue("VITE_GITHUB_RUN_ID"),
        "Run Number": getEnvValue("VITE_GITHUB_RUN_NUMBER"),
        "Run Attempt": getEnvValue("VITE_GITHUB_RUN_ATTEMPT"),
      },
      "Build Machine Info": {
        "Machine Name": getEnvValue("VITE_BUILD_MACHINE_NAME"),
        "OS": getEnvValue("VITE_BUILD_OS"),
        "OS Version": getEnvValue("VITE_BUILD_OS_VERSION"),
        "Architecture": getEnvValue("VITE_BUILD_ARCH"),
      },
    };

    return Object.entries(sections)
      .map(([section, data]) => {
        const items = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        return `### ${section} ###\n${items}`;
      })
      .join("\n\n");
  };

  const handleCopy = () => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(formatInfoForCopy());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        setCopyError(true);
        setTimeout(() => setCopyError(false), 2000);
      }
    })();
  };

  return (
    <details className={`text-sm text-rmigray-500 ${className}`}>
      <summary className="cursor-pointer hover:text-rmigray-700">
        Build and System Information
      </summary>
      <div className="mt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleCopy();
          }}
          className="mb-4 px-3 py-1.5 text-sm rounded border border-rmigray-300 hover:bg-rmigray-100 transition-colors inline-flex items-center gap-1.5"
          title="Copy all information"
        >
          {copied ? (
            <>
              <Check
                size={14}
                className="text-success-600"
              />
              <span className="text-success-800">Copied!</span>
            </>
          ) : copyError ? (
            <>
              <span className="text-error-600">Failed to copy</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>

        <div className="mb-3">
          <h4 className="font-medium mb-1">Build Info</h4>
          <ul className="list-none text-s">
            <li>App Version: {import.meta.env.VITE_APP_VERSION ?? "N/A"}</li>
            <li>Git SHA: {import.meta.env.VITE_GIT_SHA ?? "N/A"}</li>
            <li>Branch: {import.meta.env.VITE_GIT_BRANCH ?? "N/A"}</li>
            <li>
              Working Directory Clean: {String(import.meta.env.VITE_GIT_CLEAN)}
            </li>
            <li>
              Environment: {import.meta.env.VITE_ENVIRONMENT ?? "development"}
            </li>
            <li>Build Time: {import.meta.env.VITE_BUILD_TIME ?? "N/A"}</li>
            <li>Node Version: {import.meta.env.VITE_NODE_VERSION ?? "N/A"}</li>
            <li>Vite Version: {import.meta.env.VITE_VERSION ?? "N/A"}</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-medium mb-1">Runtime Info</h4>
          <ul className="list-none text-s">
            <li>User Agent: {systemInfo.userAgent}</li>
            <li>Screen Resolution: {systemInfo.screenResolution}</li>
            <li>Device Pixel Ratio: {systemInfo.devicePixelRatio}</li>
            <li>Language: {systemInfo.language}</li>
            <li>Connection: {systemInfo.connectionType}</li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-medium mb-1">GitHub Build Info</h4>
          <ul className="list-none text-s">
            <li>Actor: {import.meta.env.VITE_GITHUB_ACTOR ?? "N/A"}</li>
            <li>Event: {import.meta.env.VITE_GITHUB_EVENT_NAME ?? "N/A"}</li>
            <li>
              Repository: {import.meta.env.VITE_GITHUB_REPOSITORY ?? "N/A"}
            </li>
            <li>Ref: {import.meta.env.VITE_GITHUB_REF ?? "N/A"}</li>
            <li>Merge SHA: {import.meta.env.VITE_GITHUB_SHA ?? "N/A"}</li>
            <li>Head SHA: {import.meta.env.VITE_GITHUB_HEAD_SHA ?? "N/A"}</li>
            <li>Workflow: {import.meta.env.VITE_GITHUB_WORKFLOW ?? "N/A"}</li>
            <li>
              Workflow Ref: {import.meta.env.VITE_GITHUB_WORKFLOW_REF ?? "N/A"}
            </li>
            <li>
              Workflow SHA: {import.meta.env.VITE_GITHUB_WORKFLOW_SHA ?? "N/A"}
            </li>
            <li>Run ID: {import.meta.env.VITE_GITHUB_RUN_ID ?? "N/A"}</li>
            <li>
              Run Number: {import.meta.env.VITE_GITHUB_RUN_NUMBER ?? "N/A"}
            </li>
            <li>
              Run Attempt: {import.meta.env.VITE_GITHUB_RUN_ATTEMPT ?? "N/A"}
            </li>
          </ul>
        </div>

        <div className="mb-3">
          <h4 className="font-medium mb-1">Build Machine Info</h4>
          <ul className="list-none text-s">
            <li>
              Machine Name: {import.meta.env.VITE_BUILD_MACHINE_NAME ?? "N/A"}
            </li>
            <li>OS: {import.meta.env.VITE_BUILD_OS ?? "N/A"}</li>
            <li>
              OS Version: {import.meta.env.VITE_BUILD_OS_VERSION ?? "N/A"}
            </li>
            <li>Architecture: {import.meta.env.VITE_BUILD_ARCH ?? "N/A"}</li>
          </ul>
        </div>
      </div>
    </details>
  );
};

export default Colophon;
