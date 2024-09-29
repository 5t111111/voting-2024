# Voting 2024

簡易投票システム 2024 年度版。

Dev Container で開いてください。

以下で開発サーバーを起動します。

```bash
cd app
deno task start
```

## 管理用 API

```bash
curl -H 'Authorization: Bearer very-very-very-secret' http://localhost:8000/api/admin/get-all-results
```
