# Pull Requests

When creating a pull-request, you should:

- **Open an issue first**: Confirm that the change or feature will be accepted
- **Lint your code**: Use `eslint` to clean up your code.
- **Squash multiple commits**: Squash multiple commits into a single commit via `git rebase -i`.
- **Reference the issue**: Ensure that your commit message references the issue.

# Running in development

Navigate to `app` folder and install dependencies.

```shell
> cd app
> yarn
```

Start local server

```shell
> yarn start
```