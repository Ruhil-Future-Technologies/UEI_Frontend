
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Quality Assurance and Code Standards

### Linting

Checks the entire project for linting errors based on ESLint rules. This ensures code consistency and prevents common issues.
Note: Always run the linter before committing code to ensure compliance with the project's coding standards.

cmd : `npm run lint:fix`

### Type-Checking

Runs TypeScript's type checker to catch any type errors or inconsistencies in your code. This is especially useful for maintaining type safety in large-scale applications.
Note: Always run the typecheck before committing code to ensure compliance with the project's coding standards.

cmd : `npm run typecheck`

### Testing

Launches the test runner in the interactive watch mode.
It’s recommended to ensure that every change you make is thoroughly tested. Every file or feature that you modify should have test cases that provide 100% coverage for the following:

-- Statements
-- Branches
-- Functions
-- Lines

cmd : `npm run test`
to update snapshots : `npm test -- -u`

This will generate a coverage report that you can find in the coverage/ folder as well as in your terminal.
Note: Every pull request should include updated or new test cases for the code changes.

### Code Formatting via Prettier

Fix : `npx prettier --write .`
check : `npx prettier --check .`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More
test
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
