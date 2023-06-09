import { defineStore } from "pinia";
import { v4 as uuid4 } from "uuid";
import type { Cart, Product, DisplayCart } from "../types/interfaces";
import productData from "../../products.json";

interface State {
  cart: Cart | {};
  displayCart: DisplayCart[] | [];
}

export const useCartStore = defineStore("cart", {
  state: () => ({ cart: {}, displayCart: [] } as State),

  getters: {},

  actions: {
    // load cart instance
    loadCartInstance() {
      const cs = localStorage.getItem("cart");
      if (!cs) this.cart = {};
      else this.cart = JSON.parse(cs);
    },

    // add product to cart
    addToCart(product: Product) {
      const cs = localStorage.getItem("cart");

      let isAdded = false;

      if (!cs)
        this.cart = {
          cid: uuid4(),
          products: [product]
        };
      else {
        const cartLocalStorage = JSON.parse(cs);
        cartLocalStorage.products = cartLocalStorage.products.map((ci: Product) => {
          if (ci.id == product.id) {
            isAdded = true;
            return { id: ci.id, qty: ci.qty + 1 };
          }

          return { id: ci.id, qty: ci.qty };
        });

        if (!isAdded) cartLocalStorage.products.push({ id: product.id, qty: product.qty });

        this.cart = cartLocalStorage;
      }

      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // remove product from cart
    removeFromCart(id: number) {
      (this.cart as Cart).products = (this.cart as Cart).products.filter((ci) => ci.id != id);
      this.displayCartLoad();
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // display cart
    displayCartLoad() {
      this.displayCart = (this.cart as Cart).products.map((ci) => {
        const requiredProduct = productData.filter((p) => p.id == ci.id);
        // if (requiredProduct[0].stock >= ci.qty)
        return {
          id: ci.id,
          name: requiredProduct[0].name,
          price: requiredProduct[0].price,
          qty: ci.qty,
          currency: requiredProduct[0].currency,
          inStock: requiredProduct[0].stock >= ci.qty ? true : false,
          color: requiredProduct[0].color
        };
      });
    }
  }
});
