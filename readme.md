# Express • [TodoMVC](http://todomvc.com), adapted for [fly.io](https://fly.io/)

This is a fork of [jaredhanson/todos-express-sqlite](https://github.com/jaredhanson/todos-express-sqlite), with the following modifications:

* adds WebSocket support.  Launch todo lists in multiple tabs/windows/browsers; changes made in one are reflected in all.
* replaced Sqlite3 with PostgreSQL for the database.
* adds Redis support for coordinating WebSocket updates.

With these changes multiple replicas of this application can be deployed, even in multiple regions.


# Deployment

In an empty directory, run:

```
fly launch --from https://github.com/rubys/todomvc.git
```

If you visit this application, you will see a standard todo list.

To create additional machines in other regions, run:

```
fly scale count 3 --region dfw,waw,syd
```

Note: By default, all machines will be configured to [automatically stop and start](https://fly.io/docs/apps/autostart-stop/).
