---
'@ankhorage/repository': minor
---

Rename the standalone capability from `@ankhorage/gh` to `@ankhorage/repository`, consume the focused `RepositoryManifest` slice, expose a provider-neutral connection API, move GitHub-specific APIs to the `./github` provider subpath, and rename the Ankh capability to `repository.connect`.
