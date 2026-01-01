# Changesets

This directory holds changeset files that describe changes to be released.

## Adding a changeset

```bash
pnpm changeset
```

Follow the prompts to describe your changes.

## Releasing

```bash
# Version packages based on changesets
pnpm version

# Publish to npm
pnpm release
```
