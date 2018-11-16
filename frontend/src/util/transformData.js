const jsonToForm = function(obj) {
    const resultArr = [];
    Object.entries(obj).forEach((item) => {
        const [key, value] = item;
        resultArr.push(`${key}=${value}`);
    });
    return resultArr.join('&');
};

export default jsonToForm;
