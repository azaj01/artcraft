import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { getModelCreatorIconPath } from "../../lib/omni-gen-hooks";
import { CopyPromptButton } from "./CopyPromptButton";
import { derivePendingStatus } from "./pending-status";
import type { PendingCardProps } from "./PendingCard";

export const PendingRow = memo(function PendingRow({
  modelId,
  modelLabel,
  prompt,
  progress,
  estimatedTimeLeftMs,
  batchCount,
}: PendingCardProps) {
  const { progressPercent, timeLabel } = derivePendingStatus(
    progress,
    estimatedTimeLeftMs,
  );
  const iconPath = getModelCreatorIconPath(modelId);

  return (
    <div className="flex items-center gap-3 rounded-lg px-2.5 py-2">
      {/* Thumbnail placeholder */}
      <div className="relative size-[100px] shrink-0 overflow-hidden rounded-md bg-white/[0.03] leading-none">
        <div className="animate-shimmer h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faSpinnerThird}
            className="animate-spin text-2xl text-white/25"
          />
        </div>
      </div>

      {/* Prompt + model + progress */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          {prompt.trim() ? (
            <p className="line-clamp-3 min-w-0 flex-1 text-sm leading-snug text-white/90">
              {prompt}
            </p>
          ) : (
            // A just-enqueued job's prompt may not be resolved yet — show a
            // placeholder rather than an empty line with a stray copy button.
            <p className="min-w-0 flex-1 text-sm italic text-white/40">
              Generating…
            </p>
          )}
          {prompt.trim() && <CopyPromptButton text={prompt} />}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
          <img
            src={iconPath}
            alt=""
            className="h-3 w-3 shrink-0 icon-auto-contrast"
          />
          <span className="truncate">{modelLabel}</span>
          {batchCount != null && batchCount > 1 && (
            <>
              <span className="text-white/25">·</span>
              <span className="shrink-0">{batchCount} videos</span>
            </>
          )}
        </div>
        {(progressPercent != null || timeLabel) && (
          <div className="mt-1.5 flex items-center gap-2">
            {progressPercent != null && (
              <div className="h-1 max-w-xs flex-1 rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-primary-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
            {progressPercent != null && (
              <span className="shrink-0 text-xs tabular-nums text-white/50">
                {progressPercent}%
              </span>
            )}
            {timeLabel && (
              <span className="shrink-0 text-[11px] text-white/35">
                {timeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
