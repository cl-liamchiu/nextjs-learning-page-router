import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./products.module.scss";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchProducts } from "@/store/products-slice";
import { addToCart } from "@/store/cart-slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success(`${product.title} has been added to your cart!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Products</h1>
        <Link href="/homework/8/shopping-cart" className={styles.cartLink}>
          Go to Cart
        </Link>
      </div>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <Image
              src={product.thumbnail}
              alt={product.title}
              className={styles.productImage}
              width={200}
              height={200}
            />
            <h2 className={styles.productName}>{product.title}</h2>
            <p className={styles.productPrice}>Price: {product.price}</p>
            <button
              className={styles.addToCartButton}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductsPage;
