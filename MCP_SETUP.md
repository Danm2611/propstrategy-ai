# MCP Setup Instructions

## For Claude Desktop Users

The MCP (Model Context Protocol) servers need to be available when Claude starts a session. Here's how to ensure they work:

### Option 1: Use Project Config (Recommended)

1. The MCP configuration is already set up in `.claude/claude_desktop_config.json`
2. When starting a new Claude session:
   - Open this project folder in Claude Desktop
   - The MCPs should automatically load from the project config
   - Type `/mcp` to see available MCP tools

### Option 2: Global Config

If the project config doesn't work, copy the MCP config to your global Claude config:

```bash
# macOS
cp .claude/claude_desktop_config.json ~/Library/Application\ Support/Claude/

# Windows
# Copy to %APPDATA%\Claude\

# Linux  
# Copy to ~/.config/claude/
```

### Available MCP Commands

Once loaded, you should see these MCP tools:

- **Supabase MCP**:
  - `mcp__supabase__list-tables`
  - `mcp__supabase__query`
  - `mcp__supabase__insert`
  - `mcp__supabase__update`
  - `mcp__supabase__delete`
  
- **Digital Ocean MCP**:
  - `mcp__digitalocean__list-droplets`
  - `mcp__digitalocean__create-droplet`
  - etc.

### Troubleshooting

If MCP tools aren't showing:

1. Restart Claude Desktop completely
2. Check the developer console for errors (Cmd+Opt+I on Mac)
3. Ensure the MCP servers are installed:
   ```bash
   npx @supabase/mcp-server-supabase@latest --version
   npx @digitalocean/mcp --version
   ```

### Manual Supabase Setup (Fallback)

If MCP tools aren't available, you can still set up Supabase manually:

```bash
# Run the interactive setup
npx tsx scripts/setup-supabase.ts
```

This will guide you through:
1. Creating a Supabase project
2. Getting the connection string
3. Running migrations
4. Migrating existing data