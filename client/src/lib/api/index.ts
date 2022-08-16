const baseUrl: String = import.meta.env.APP_SERVER_BASE_URL ?? '';

export const getUrls = async () => {
    let res = await fetch(
        baseUrl + '/urls',
        {
            method: 'GET',
            mode: 'cors'
        }
    );
    return await res.json();
}

export const shorten = async (originalUrl: String, shortName?: String) => {
    let res = await fetch(baseUrl + '/urls', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                originalUrl: originalUrl,
                shortName: shortName
            })
        });
        return await res.json();
}

export const getUsageData = async(id: String) => {
    let res = await fetch(
        baseUrl + '/urls/' + id + '/usage',
        {
            method: 'GET',
            mode: 'cors'
        }
    );
    return await res.json();
}