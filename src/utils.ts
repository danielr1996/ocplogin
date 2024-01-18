const compose2 = (f: any, g: any) => async (...args: any[]) => f(await g(...args))
export const pipe = (...fns: any[]) => fns.reduceRight(compose2)
