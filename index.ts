import concurrently from 'concurrently'

concurrently([
  {
    name: 'server',
    command: 'bun run dev',
    cwd: 'apps/server',
    prefixColor: 'magenta'
  },
  {
    name: 'client',
    command: 'bun run dev',
    cwd: 'apps/client',
    prefixColor: 'green'
  }
])
