---
name: foodlens-github-push
description: Use the required drodri-es GitHub account whenever an authorized workflow pushes commits, tags, or branches from the FoodLens repository.
---

# FoodLens GitHub Push

Apply this workflow only in the FoodLens repository and only when a push has
already been authorized. This skill does not grant permission to push.

Immediately before every `git push`:

1. Note the currently active GitHub account from `gh auth status`.
2. Run exactly:

   ```bash
   gh auth switch --hostname github.com --user drodri-es
   gh auth setup-git
   ```

3. Verify that `drodri-es` is the active account. If either authentication
   command or verification fails, do not attempt the push; report the blocker.
4. Perform the intended push without changing its previously authorized scope.
5. If another account was active before step 2, restore that account with
   `gh auth switch` and run `gh auth setup-git` again. Verify the restoration.

Never print tokens or the contents of GitHub credential files.
