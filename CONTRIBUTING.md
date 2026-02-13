# 👨🏼‍💻 Contributing

I would love your help to improve this project! Here are a few ways to contribute, and some guidelines to help you along the way.

## 🐛 Issues

If you come across any bugs or something that doesn't seem right, please [open an issue](https://github.com/codiume/orbit/issues). Also, if you have an idea for the project, open an issue to start the discussion.

When possible, please include a link to a `git` repository or a CodeSandbox which illustrates the problem you're facing. This is especially important when you find a bug.

## 🔃 Pull requests

Yes, I accept pull requests! You can submit a pull request to fix a bug, implement a feature, add tests, or improve the documentation.

## Working on your first Pull Request?

You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request)

## 🦋 Changesets

We use the [Changesets](https://github.com/changesets/changesets) library to manage versioning in this project. As part of your pull request (PR) submission, it is essential to include a corresponding changeset detailing the modifications made. Changesets help us keep track of version updates and ensure transparent communication regarding changes introduced to the codebase.

To include a changeset in your PR:

1. Create a changeset using the following command within your project directory:

   ```bash
   pnpm changeset
   ```

2. Follow the prompts to describe the changes introduced in your PR. Ensure the changeset adheres to our contribution guidelines.

3. Commit the changeset file(s) along with your code changes.

Including changesets in your PR demonstrates transparency and facilitates smoother version management. PRs lacking corresponding changesets may be subject to additional review or may not be merged until changesets are provided.

For more information on using Changesets, refer to the official documentation.
