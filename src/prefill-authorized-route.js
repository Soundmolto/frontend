export function prefill_auth (auth_token) {
    return {
        'Authorization': `Bearer ${auth_token}`
    }
}