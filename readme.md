Aurelia bundle task
=======

Copy the bundle.js file into `build/tasks`

It will add the `bundle` and `bundle-app` task

The `bundle` task will create the aurelia.js bundle which includes all the aurelia components and core-js.

The `bundle-app` task will create the app-bundle.js which contains all your app files and dependencies. (the modules already available in the aurelia bundle will not be included)


There is also an `unbundle task` that will remove the bundles and make jspm use separate files again.
