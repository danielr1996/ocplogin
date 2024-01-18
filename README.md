# ocplogin

## Usage
> You need to initially login with ocp login, this will only update your token

1. Download ocplogin from [github](https://github.com/danielr1996/ocplogin/releases) and put it on your `PATH`

2. Define your clusters in `~/.ocplogin/clusters.json`
```shell
# 
cat <<EOF > ~/.ocplogin/clusters.json
[
  {
    "name": "mycluster",
    "url": "https://oauth-openshift.apps.mycluster.example.com"
  }
]
EOF
```

3. Generate a new encryption key (used to encrypt your credentials, stored in `~/.ocplogin/encryptionkey.json`
> Don't share this key with anyone, because it allows to decrypt your credentials

```shell
ocplogin generatekey
```

4. Provide your credentials, they will be encrypted and stored in `~/.ocplogin/credentials.json`
```shell
ocplogin login
```

5. Fetch new tokens with:
```shell
ocplogin
```

## Development
```shell
deno compile --output build/ocplogin -A src/index.ts
```