import React from 'react';

const useFetchJson = () => {

    const fetchPromise = fetch("/warehouses.json").then((res) => res.json())
    return fetchPromise;
};

export default useFetchJson;