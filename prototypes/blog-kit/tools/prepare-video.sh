#!/usr/bin/env bash
# Optimise a screen recording for the blog .video component.
#
#   tools/prepare-video.sh <input.mov|mp4> <out-dir/name> [max-width] [crop]
#
#   max-width  default 1600 — 2x the 800px article column, so the clip stays sharp on retina
#   crop       optional ffmpeg crop "w:h:x:y" to cut the clip to the app window (drop the
#              desktop wallpaper around a macOS window recording)
#
# Produces:  name.mp4 (H.264, no audio, faststart), name.webm (VP9, smaller for Chrome/Firefox),
#            name.webp or name.jpg (poster = first frame). Prints the sizes at the end.
#
# What the recording should look like before it gets here:
#   - a window or the content area only, no cursor dance, no notifications
#   - a loop point: end on the same screen the clip starts on, so `loop` does not jump
#   - 5–20 s; 30 fps is enough for UI, 60 only adds bytes
#   - 2x capture (retina) of the area you want shown at 1x in the post
set -euo pipefail

in="${1:?input video}"
out="${2:?output path without extension}"
maxw="${3:-1600}"
crop="${4:-}"

vf="scale='min(${maxw},iw)':-2:flags=lanczos,fps=30,format=yuv420p"
if [[ -n "$crop" ]]; then vf="crop=${crop},${vf}"; fi

# H.264: plays everywhere (Safari included). crf 26 is visually lossless for UI at 2x.
ffmpeg -v error -y -i "$in" -an -vf "$vf" \
	-c:v libx264 -profile:v high -preset slow -crf 26 -movflags +faststart -pix_fmt yuv420p \
	"${out}.mp4"

# VP9: typically 30–40 % smaller; listed first in <source> so capable browsers prefer it.
ffmpeg -v error -y -i "$in" -an -vf "$vf" \
	-c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 \
	"${out}.webm"

# Poster: the first frame, so the page is complete before the video loads. WebP when this
# ffmpeg has libwebp, otherwise a JPEG (Homebrew's default ffmpeg build ships without it).
if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
	ffmpeg -v error -y -i "${out}.mp4" -frames:v 1 -c:v libwebp -quality 85 "${out}.webp"; poster="${out}.webp"
else
	ffmpeg -v error -y -i "${out}.mp4" -frames:v 1 -q:v 6 "${out}.jpg"; poster="${out}.jpg"
fi

dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "${out}.mp4")
echo "dimensions: ${dims}   (use as width/height on <video>)"
ls -la "${out}.mp4" "${out}.webm" "$poster" | awk '{printf "%-40s %6.0f KB\n", $NF, $5/1024}'
