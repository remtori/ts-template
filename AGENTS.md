# Project rules for agent

- ALWAYS install package via cli like `pnpm add <packageName>`, do not guess a package version then fill its in `package.json`, applicable to all package manager (e.g cargo) in the project.

- If we edit drizzle schema then rerun `pnpm db:generate`, do not write migration manually

- ALWAYS do plain no extension import like `import x from './x'` instead of `import x from './x.js'`
