import { EnvironmentInfo } from '@vivocha/public-types/dist/bot';

/**
 * Return a Vivocha environment from the the specific request HTTP headers
 * @param headers - Object, the HTTP headers as coming from a HTTP request
 */
export function getVvcEnvironment(headers: any): EnvironmentInfo {
    const { 'x-vvc-host': host, 'x-vvc-acct': acct, 'x-vvc-hmac': hmac } = headers;
    const vvcHeaders = { host, acct, hmac };
    const omitBy = (obj, fn) =>
        Object.keys(obj)
            .filter(k => !fn(obj[k], k))
            .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
    return omitBy(vvcHeaders, v => v === undefined);
}