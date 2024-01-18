# ocplogin

## Usage
> You need to initially login with ocp login, this will only update your token

Define your clusters in `~/.ocplogin/clusters.json`
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

Generate a new encryption key (used to encrypt your credentials, stored in `~/.ocplogin/encryptionkey.json`
> Don't share this key with anyone, because it allows to decrypt your credentials

```shell
ocplogin generatekey
```

Provide your credentials, they will be encrypted and stored in `~/.ocplogin/credentials.json`
```shell
ocplogin login
```

Fetch new tokens with:
```shell
ocplogin
```

## Development
```shell
deno compile --output build/ocplogin -A src/index.ts
```