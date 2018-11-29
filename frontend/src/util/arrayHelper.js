const breakException = new Error('Break!');

function deleteObjFromArr(arr, pairs) {
    for (let i = arr.length - 1; i >= 0; i -= 1) {
        const curr = arr[i];
        try {
            Object.entries(pairs).forEach(([key, value]) => {
                if (curr[key] !== value) {
                    throw breakException;
                }
            });
            arr.splice(i, 1);
        } catch (e) {
            if (e !== breakException) { throw e; }
        }
    }
}

export default deleteObjFromArr;
