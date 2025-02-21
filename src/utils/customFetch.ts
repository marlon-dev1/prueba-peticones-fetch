export const customFetch = async (url: string, method = 'GET') => {
    const data = await fetch(url, { method, headers: { 'app-id': '63473330c1927d386ca6a3a5' } })
        .then((response) => response.json())
        .then((fetchData) => {
            return fetchData;
        });

    return data;
};
