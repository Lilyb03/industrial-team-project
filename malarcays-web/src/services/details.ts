export function getDetails(account: number) {
    const apiCall = `https://api.malarcays.uk/balance?account=${account}`;
    // const apiCall = "";
    return fetch(apiCall)
        .then(data => data.json())
}