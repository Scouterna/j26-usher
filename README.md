# Usher - An application picket

## Local development

```bash
# Copy environment configuration file
cp .env.example .env

# Open and fill out the file
code .env

# Install dependencies using PNPM
pnpm install

# Start the development server
pnpm dev
```

## Exposed routes and API

The app exposes the following routes:

- `/` - A grid showing all applications the user has access to.
- `/embed` - An iframe that should be embedded on a web page in a hidden
  fashion. Posts a message to the parent frame with a list of applications the
  user has access to.
- `/embed/clients` - API endpoint used by the embed frame to retrieve
  applications accessible to the user.

## Configuration

All configuration is done through environment variables. Please see
`.env.example` for an overview of all options.

## Setting up Keycloak

For any client to show up in Usher it must fullfill one of two criteria:
1. Have "Always display in UI" enabled. This will make the client show up for
   all users, even those who are not logged in.
2. The current user must have at least one client-specific role assigned to
   them.
