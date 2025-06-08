# PropStrategy AI Project

## Available MCP Tools

This project has the following MCP servers configured:

### Supabase MCP
- **Command**: `@supabase/mcp-server-supabase`
- **Access Token**: Available in `.claude/claude_desktop_config.json`
- **Usage**: Database operations, table management, data queries

### Digital Ocean MCP  
- **Command**: `@digitalocean/mcp`
- **API Token**: Available in config
- **Usage**: Deployment, server management

### Other MCPs
- **brave-search**: Web searching
- **desktop-commander**: Desktop control
- **puppeteer**: Browser automation
- **github**: GitHub operations

## Database Migration Status

Currently using SQLite locally. Need to migrate to Supabase:
1. The Prisma schema is already updated for PostgreSQL
2. Migration scripts are ready in `/scripts`
3. Supabase MCP is configured but needs new session to access

## Next Steps

To complete Supabase setup:
1. Start a new Claude session with this project
2. The Supabase MCP tools should be available
3. Use Supabase MCP to create tables and migrate data

## Important Files

- `.claude/claude_desktop_config.json` - MCP configuration
- `prisma/schema.prisma` - Database schema (PostgreSQL ready)
- `scripts/migrate-to-supabase.ts` - Data migration script
- `scripts/setup-supabase.ts` - Interactive setup script