# Cosmoscan

## デプロイ

### dev

```shell
firebase use staging
ng build
firebase deploy
```

### prod

```shell
firebase use default
ng build --prod
firebase deploy
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
