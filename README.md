## Documentations:
1. <a href="https://firebase.google.com/docs/web/setup?authuser=0">Add Firebase to your JavaScript Project</a>
2. <a href="https://firebase.google.com/docs/database/">Firebase Realtime Database</a>
3. <a href="https://firebase.google.com/docs/database/web/start">Installation & Setup in JavaScript</a>
4. <a href="https://firebase.google.com/docs/auth/web/password-auth">Authenticate with Firebase using Password-Based Accounts using Javascript</a>
5. <a href="https://firebase.google.com/docs/auth/web/google-signin">Authenticate Using Google Sign-In with JavaScript</a>

## Notes:
### Forum:
1. The major ingredients of a forum are the threads, the posts and the users.
2. A thread is a stream of posts 

### Application Structure:
1. The src directory contains our application's code.
2. Main.js is the application's entry file.
3. When start building an application it is usually handy to work with a local file or mockup before hitting an API or another source.
4. If the browser tries to reload the page, this shouldn't happen in a Single Page Application.
5. It's recommended to use camelCase names when using CSS Modules.
6. It's recommended to place the global styles in the root component's style tag insted of importing it in the HTML head tag as you would normally do.
7. The class selector is way faster than the element selector, because it is more specific.
8. Keep the logic that alters the state in the parent component.

### Vue:
1. Each component is a Vue instance.
9. Each Vue.set is an individual state change.
10. Create and Update things are usually all together.
11. The benefits of using higher-order functions are that the code is reusable and wirte less.
13. The created hook is a great time to fire an AJAX call.
14. The mounted hook is similar to JQuery's ready function.
15. We should fetch only the data we need.
16. A set of rules is called a preset.
17. Whenever we need to run code on every page we can use the root instance that lives in the main.js file.
18. It's recommended to prefix all properties of a mixin and use the mixin name as the prefix.
19. To use the Firebase CLI, we have to install it globally.  
20. Using environment variables is very practical for using different databases or API keys.
21. Route protection is essential in any application that allows users to authenticate.
22. Route components (the ones passed to the router configuration).
23. Create a generic action.
24. Create a generic mutation.

### Vue-Router:
1. Route protection is essential in any application.
2. A navigation guard acts as a middleware that can protect a route component.
3. A common need is to protect specific routes from guests.
4. Component-less routes are routes that don't use a component.

### Vuex:
1. Highly recommend using namespaced modules from the early stages of application
2. Single Source of Truth.
3. Useful Library of Actions, Mutations, Getters.
4. It's a best practice to have our actions call mutations which update our state directly.

### Form:
1. Wrap form's data in a form object.
