import React from "react";
import clsx from "clsx";

type Props = {
  "label": string;
  "children": React.ReactNode;
  "className"?: string;
  "buttonClassName"?: string;
  "data-testid"?: string;
};

export default function FilterDropdown({
  label,
  children,
  className,
  buttonClassName,
  "data-testid": dataTestId,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("relative inline-block", className)}
      data-testid={dataTestId}
    >
      <button
        type="button"
        className={clsx(
          "rounded border px-3 py-1 text-sm bg-white hover:bg-gray-50",
          buttonClassName,
        )}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute z-20 mt-2 w-[22rem] rounded-xl border bg-white p-3 shadow-xl"
        >
          {children}
        </div>
      )}
    </div>
  );
}
