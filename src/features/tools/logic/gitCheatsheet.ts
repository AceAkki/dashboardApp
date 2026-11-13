import type { CheatSection } from "./cheatsheet";

export const GIT_SECTIONS: CheatSection[] = [
  {
    title: "Setup",
    items: [
      { cmd: "git init", note: "Start a repo in this folder" },
      { cmd: "git clone <url>", note: "Copy a remote repo" },
      { cmd: 'git config --global user.name "Your Name"', note: "Name on your commits" },
      { cmd: 'git config --global user.email "you@example.com"', note: "Email on your commits" },
    ],
  },
  {
    title: "Stage & commit",
    items: [
      { cmd: "git status", note: "What changed" },
      { cmd: "git add -p", note: "Stage changes piece by piece" },
      { cmd: "git add .", note: "Stage everything" },
      { cmd: 'git commit -m "message"', note: "Save staged changes" },
      { cmd: "git commit --amend", note: "Edit the last commit" },
      { cmd: "git commit --amend --no-edit", note: "Add staged files to the last commit" },
    ],
  },
  {
    title: "Branches",
    items: [
      { cmd: "git branch", note: "List local branches" },
      { cmd: "git switch -c <name>", note: "Create and switch to a branch" },
      { cmd: "git switch <name>", note: "Switch branch" },
      { cmd: "git merge <name>", note: "Merge a branch into the current one" },
      { cmd: "git rebase <branch>", note: "Replay your commits on top of a branch" },
      { cmd: "git cherry-pick <hash>", note: "Copy one commit onto this branch" },
      { cmd: "git branch -d <name>", note: "Delete a merged branch" },
    ],
  },
  {
    title: "Remote",
    items: [
      { cmd: "git remote -v", note: "Show remote URLs" },
      { cmd: "git fetch --prune", note: "Download changes, drop deleted remote branches" },
      { cmd: "git pull --rebase", note: "Pull without a merge commit" },
      { cmd: "git push -u origin <branch>", note: "First push of a new branch" },
      { cmd: "git push --force-with-lease", note: "Safer force push" },
    ],
  },
  {
    title: "Undo",
    items: [
      { cmd: "git restore <file>", note: "Throw away changes in a file" },
      { cmd: "git restore --staged <file>", note: "Unstage a file, keep the changes" },
      { cmd: "git reset --soft HEAD~1", note: "Undo last commit, keep changes staged" },
      { cmd: "git reset --hard HEAD~1", note: "Undo last commit AND delete its changes" },
      { cmd: "git revert <hash>", note: "New commit that undoes an old one" },
      { cmd: "git reflog", note: "Find 'lost' commits after a bad reset" },
    ],
  },
  {
    title: "Stash",
    items: [
      { cmd: 'git stash push -m "message"', note: "Shelve changes for later" },
      { cmd: "git stash list", note: "See what is shelved" },
      { cmd: "git stash pop", note: "Bring back the latest stash" },
      { cmd: "git stash drop", note: "Delete the latest stash" },
    ],
  },
  {
    title: "Inspect",
    items: [
      { cmd: "git log --oneline --graph --decorate", note: "Compact history with branches" },
      { cmd: "git diff", note: "Unstaged changes" },
      { cmd: "git diff --staged", note: "Staged changes" },
      { cmd: "git show <hash>", note: "One commit in full" },
      { cmd: "git blame <file>", note: "Who last changed each line" },
      { cmd: "git bisect start", note: "Binary-search for the commit that broke it" },
    ],
  },
  {
    title: "Clean up & tags",
    items: [
      { cmd: "git clean -fd", note: "Delete untracked files and folders" },
      { cmd: "git branch --merged | xargs git branch -d", note: "Delete all merged branches" },
      { cmd: "git tag v1.0.0", note: "Tag the current commit" },
      { cmd: "git push --tags", note: "Push all tags" },
    ],
  },
];
