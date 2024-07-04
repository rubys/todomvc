# Express • [TodoMVC](http://todomvc.com), adapted for [fly.io](https://fly.io/)

This is a fork of [jaredhanson/todos-express-sqlite](https://github.com/jaredhanson/todos-express-sqlite), with the following modifications:

* `db.js` is modified to use postgresql instead of sqlite3
* `bin/www` is modified to reflect new project name in debug statement

With these changes multiple replicas of this application can be deployed, even
in multiple regions.


# Deployment

```
git clone https://github.com/rubys/todos-express-postgresql.git -o todomvc
cd todomvc
fly launch
```

If you visit this application, you will see a standard todo list.

To create additional machines, run:

```
fly machine clone
```

This will prompt you for a machine to clone, pick any one.

Notes: 

* [fly machine clone](https://fly.io/docs/flyctl/machine-clone/) accepts a `--region` option.  Feel free to create todo lists [around the world](https://fly.io/docs/reference/regions/#fly-io-regions).
* By default, all machines will be configured to
  [automatically stop and start](https://fly.io/docs/apps/autostart-stop/).