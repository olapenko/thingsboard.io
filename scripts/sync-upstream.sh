#!/usr/bin/env bash
# Upstream sync for the fork, as LAB.md describes it:
#
#   main  <- upstream/main   (fast-forward only: main is a read-only mirror)
#   handoff rebased onto main (the deliverable stays main + one commit per layer)
#   lab     merges handoff    (the sandbox takes handoff in, never the other way)
#
# Each branch is updated in the worktree that has it checked out, so nothing switches branches in a
# shared folder. Every step is idempotent: if the rebase or the merge stops on a conflict, resolve it
# in that worktree, finish it (`git rebase --continue` / `git commit`), and run this again; the steps
# already done are no-ops.
#
# Usage:  scripts/sync-upstream.sh [--push]
#   --push   afterwards push main and lab, and handoff with --force-with-lease (its history moved).
#
# Needs the `upstream` remote (thingsboard/thingsboard.io). main must be checked out (the main folder);
# handoff and lab use their worktrees, or a temporary one when theirs is on another branch. Stop rebasing handoff once a layer is under review upstream — from then on merge main into
# it instead, or the open PR loses its commit.

set -euo pipefail

UPSTREAM_REMOTE=${UPSTREAM_REMOTE:-upstream}
ORIGIN_REMOTE=${ORIGIN_REMOTE:-origin}
PUSH=0
for arg in "$@"; do
	case "$arg" in
		--push) PUSH=1 ;;
		-h | --help) sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
		*) echo "unknown argument: $arg" >&2; exit 2 ;;
	esac
done

say() { printf '\033[1m%s\033[0m\n' "$*"; }
die() { printf 'sync-upstream: %s\n' "$*" >&2; exit 1; }

# The worktree that has a branch checked out, from any worktree of the repo.
worktree_of() {
	git worktree list --porcelain | awk -v want="refs/heads/$1" '
		/^worktree / { w = substr($0, 10) }
		/^branch / && $2 == want { print w; exit }'
}

require_clean() {
	[ -z "$(git -C "$1" status --porcelain)" ] || die "$2's worktree at $1 has uncommitted changes; commit or stash them first"
}

git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1 \
	|| die "no '$UPSTREAM_REMOTE' remote; add it: git remote add $UPSTREAM_REMOTE https://github.com/thingsboard/thingsboard.io.git"

# A branch nobody has checked out (its worktree is on another branch today) gets a temporary worktree
# for the duration of the run, removed on the way out.
TEMP_WTS=()
cleanup() { for wt in "${TEMP_WTS[@]-}"; do [ -n "$wt" ] && git worktree remove --force "$wt" >/dev/null 2>&1 || true; done; }
trap cleanup EXIT
worktree_for() {
	local wt; wt=$(worktree_of "$1")
	if [ -z "$wt" ]; then
		wt=$(mktemp -d "${TMPDIR:-/tmp}/sync-$1.XXXXXX")
		git worktree add --quiet "$wt" "$1" >/dev/null || die "could not check out $1 in a temporary worktree"
		TEMP_WTS+=("$wt")
		printf 'note: %s is not checked out anywhere; using a temporary worktree\n' "$1" >&2
	fi
	printf '%s' "$wt"
}

MAIN_WT=$(worktree_of main); [ -n "$MAIN_WT" ] || die "main is not checked out in any worktree"
HANDOFF_WT=$(worktree_for handoff)
LAB_WT=$(worktree_for lab)

# A rebase or merge left half-done is finished by hand, not by this script.
for wt in "$HANDOFF_WT" "$LAB_WT"; do
	gitdir=$(git -C "$wt" rev-parse --git-dir)
	[ ! -d "$gitdir/rebase-merge" ] && [ ! -d "$gitdir/rebase-apply" ] || die "a rebase is in progress in $wt; finish it, then run this again"
	[ ! -f "$gitdir/MERGE_HEAD" ] || die "a merge is in progress in $wt; commit it, then run this again"
done
require_clean "$MAIN_WT" main
require_clean "$HANDOFF_WT" handoff
require_clean "$LAB_WT" lab

say "Fetching $UPSTREAM_REMOTE and $ORIGIN_REMOTE"
git fetch --quiet "$UPSTREAM_REMOTE" main
git fetch --quiet --prune "$ORIGIN_REMOTE"

before_main=$(git rev-parse main)
say "main <- $UPSTREAM_REMOTE/main (fast-forward)"
git -C "$MAIN_WT" merge --ff-only --quiet "$UPSTREAM_REMOTE/main"
new_on_main=$(git rev-list --count "$before_main..main")

say "handoff: rebase onto main"
layers=$(git rev-list --count main..handoff)
git -C "$HANDOFF_WT" rebase --quiet main \
	|| die "the rebase of handoff stopped on a conflict in $HANDOFF_WT; resolve, 'git rebase --continue', then run this again"

say "lab: merge handoff"
git -C "$LAB_WT" merge --quiet --no-edit handoff \
	|| die "the merge into lab stopped on a conflict in $LAB_WT; resolve, commit, then run this again"

printf '\n'
printf '  main     %s  (+%s from upstream)\n' "$(git rev-parse --short main)" "$new_on_main"
printf '  handoff  %s  (%s layer commits on main)\n' "$(git rev-parse --short handoff)" "$layers"
printf '  lab      %s\n' "$(git rev-parse --short lab)"

if [ "$PUSH" = 1 ]; then
	say "Pushing"
	git push --quiet "$ORIGIN_REMOTE" main
	git push --quiet --force-with-lease "$ORIGIN_REMOTE" handoff
	git push --quiet "$ORIGIN_REMOTE" lab
else
	printf '\nNot pushed. To push: %s --push   (handoff goes with --force-with-lease)\n' "$0"
fi
