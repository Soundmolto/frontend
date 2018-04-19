export function prefill_auth (auth_token) {
    let obj = {};
    if (null != auth_token) obj = { 'Authorization': `Bearer ${auth_token}` };
    return {...obj};
}