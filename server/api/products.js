exports.getProductsPromise = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
          [{
            id: 1,
            name: "Laptop",
            price: "120k",
          },]
       );
    }, 4000);
  });

exports.getProductsDetails = (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
          {
            id: id,
            name: "Laptop",
            price: "120k",
          },
        ],
      );
    }, 4000);
  });
