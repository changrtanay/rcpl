import summaryApi from '../common'; 

const categoryProducts = async (category) => {

    const dataResponse = await fetch(summaryApi.categoryProducts.url, {
        method: summaryApi.categoryProducts.method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
    });

    const dataApi = await dataResponse.json();
    return dataApi;
};

export default categoryProducts;