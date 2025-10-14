import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./shopping-cart.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { removeFromCart, setQuantity } from "@/store/cart-slice";

const ShoppingCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(setQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.cartSection}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={80}
                height={80}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.title}</span>
                <span className={styles.itemPrice}>
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button
                  className={styles.quantityButton}
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.itemQuantity}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                  }
                />
                <button
                  className={styles.quantityButton}
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <span className={styles.itemTotal}>
                Total: $
                {Number.isNaN(item.price * item.quantity)
                  ? 0
                  : (item.price * item.quantity).toFixed(2)}
              </span>
              <div className={styles.itemActions}>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summaryTotal}>
          <span>Total Cost </span>
          <span>
            ${Number.isNaN(calculateTotal()) ? 0 : calculateTotal().toFixed(2)}
          </span>
        </div>
        <Link href="/homework/8/products" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCart;
