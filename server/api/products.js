exports.getProductsPromise = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        products: [
          {
            id: 1,
            name: "Laptop",
            price: "120k",
          },
        ],
      });
    }, 4000);
  });