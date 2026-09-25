.PHONY: help install storybook storybook-build typecheck lint test check-stories check changeset release-version

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pnpm install

# --- Storybook ---

storybook: ## Start DS Storybook dev server (http://localhost:6007)
	pnpm run storybook

storybook-build: ## Build DS Storybook as static site (storybook-static/)
	pnpm run build-storybook

# --- Checks ---

typecheck: ## Run TypeScript typecheck
	pnpm run typecheck

lint: ## Run ESLint
	pnpm run lint

test: ## Run unit tests (vitest)
	pnpm run test

check-stories: ## Verify every component has a sibling <Component>.stories.tsx
	pnpm run check:stories

check: typecheck lint check-stories test ## Run all checks (typecheck, lint, story coverage, tests)

# --- Release ---

changeset: ## Add a changeset for the pending change
	pnpm run changeset

release-version: ## Consume changesets: bump version + CHANGELOG (then commit, tag, push)
	pnpm run release:version
