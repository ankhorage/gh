---
'@ankhorage/repository': minor
---

Rename the standalone capability from `@ankhorage/gh` to `@ankhorage/repository`, consume the focused `RepositoryManifest` slice, persist it at `.ankhorage/repository.json`, expose a provider-neutral connection API and `repository.connect` capability, and isolate GitHub-specific implementation under `providers/github` and the `./github` provider subpath.
