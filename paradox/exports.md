# Public API

## connectGitHubRepositoryAsync

Kind: `function`
Module: `src/connection/services/connectGitHubRepositoryAsync.ts`
Source: `src/connection/services/connectGitHubRepositoryAsync.ts:27:1`

### Signatures

- `(options?: GitHubRepositoryConnectionOptions, dependencies?: GitHubRepositoryConnectionDependencies) => Promise<GitHubRepositoryConnectionResult>`
  - dependencies: `GitHubRepositoryConnectionDependencies` (optional)
  - options: `GitHubRepositoryConnectionOptions` (optional)
  - returns: `Promise<GitHubRepositoryConnectionResult>`

## GitHubRepositoryConnectionFailure

Kind: `type`
Module: `src/connection/definitions/GitHubRepositoryConnectionResult.ts`
Source: `src/connection/definitions/GitHubRepositoryConnectionResult.ts:18:1`

### Members

| Name       | Kind     | Type                                              | Required | Description |
| ---------- | -------- | ------------------------------------------------- | -------- | ----------- |
| code       | property | `string`                                          | yes      |             |
| message    | property | `string`                                          | yes      |             |
| repository | property | `GitHubRepositoryConnectionIdentity \| undefined` | no       |             |
| stage      | property | `string`                                          | yes      |             |
| status     | property | `GitHubRepositoryConnectionFailureKind`           | yes      |             |

## GitHubRepositoryConnectionOptions

Kind: `type`
Module: `src/connection/definitions/GitHubRepositoryConnectionOptions.ts`
Source: `src/connection/definitions/GitHubRepositoryConnectionOptions.ts:6:1`

### Members

| Name        | Kind     | Type                                      | Required | Description |
| ----------- | -------- | ----------------------------------------- | -------- | ----------- |
| name        | property | `string \| undefined`                     | no       |             |
| owner       | property | `string \| undefined`                     | no       |             |
| projectPath | property | `string \| undefined`                     | no       |             |
| visibility  | property | `GitHubRepositoryVisibility \| undefined` | no       |             |

## GitHubRepositoryConnectionResult

Kind: `unknown`
Module: `src/connection/definitions/GitHubRepositoryConnectionResult.ts`
Source: `src/connection/definitions/GitHubRepositoryConnectionResult.ts:26:1`

## GitHubRepositoryConnectionStatus

Kind: `unknown`
Module: `src/connection/definitions/GitHubRepositoryConnectionResult.ts`
Source: `src/connection/definitions/GitHubRepositoryConnectionResult.ts:1:1`

## GitHubRepositoryVisibility

Kind: `unknown`
Module: `src/connection/definitions/GitHubRepositoryVisibility.ts`
Source: `src/connection/definitions/GitHubRepositoryVisibility.ts:1:1`
