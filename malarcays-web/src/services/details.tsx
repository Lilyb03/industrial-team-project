export function getDetails(){
    //const apiCall = "https://api.malarcays.uk/balance?account=91";
    const apiCall = "";
    return fetch(apiCall)
    .then(data=> data.json())
}