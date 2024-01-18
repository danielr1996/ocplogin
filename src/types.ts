export type Cluster = {
    name: string,
    url: string,
    token?: string,
    config?: KubeConfig,
    username?: string,
    password?: string,
}
export type KubeConfig = {
    apiVersion: 'v1'
    kind: 'Config',
    clusters: {
        cluster: {
            server: string
        },
        name: string
    }[],
    contexts: {
        context: {
            cluster: string,
            namespace: string,
            user: string,
        }
        name: string,
    }[],
    users: {
        name: string,
        user: {
            token: string
        }
    }[],
    currentContext: string,
    preferences: any
}

export class OCPError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name
    }
}

export class OCPAuthenticationError extends OCPError {
    user?: string;
    constructor(user?: string) {
        super(`Error authenticating user ${user}`);
        this.user = user;
    }
}
export class OCPUnknownError extends OCPError {
    details: any;
    constructor(details: any) {
        super(`unknown error`);
        this.details = details;
    }
}
export class MissingCredentialsError extends OCPError {
    constructor() {
        super(`Credentials missing, please run 'ocplogin login'`);
    }
}