// frontend/src/app/products/[prd_id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // To get route params like prd_id
import Image from 'next/image';
import Link from 'next/link';
import { getProductByPrdId } from '../../../services/api'; // Adjust path as needed
// import { useAuth } from '../../../contexts/AuthContext'; // If needed for cart functionality later

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // For add to cart quantity

  const params = useParams(); // Hook to access route parameters
  const prd_id = params.prd_id; // Get the prd_id from the URL

  // const { isAuthenticated } = useAuth(); // For "Add to Cart" logic later

  useEffect(() => {
    if (prd_id) {
      setLoading(true);
      setError(null);
      getProductByPrdId(prd_id)
        .then(data => {
          setProduct(data);
        })
        .catch(err => {
          console.error("Error fetching product details:", err);
          setError(err.message || 'Failed to fetch product details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [prd_id]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change)); // Ensure quantity is at least 1
  };

  const handleAddToCart = () => {
    // if (!isAuthenticated) {
    //   router.push('/login?redirect=/products/' + prd_id); // Redirect to login if not authenticated
    //   return;
    // }
    // TODO: Implement add to cart logic (e.g., update context, call API)
    console.log(`Add to cart: ${quantity} of ${product.name}`);
    // Show feedback to user (e.g., toast notification)
  };

  const placeholderImage = "https://via.placeholder.com/600x400.png?text=No+Image";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading product details...</p>
        {/* Optional: Spinner component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="text-xl text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
        <Link href="/products" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Product not found.</p>
        <Link href="/products" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
            Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2 relative h-64 md:h-auto"> {/* Min height for mobile, auto for larger */}
            <Image
              src={product.image_url || placeholderImage}
              alt={product.name}
              layout="fill"
              objectFit="contain" // Or "cover", depending on desired image display
              className="transition-transform duration-300 ease-in-out hover:scale-105"
              onError={(e) => { e.target.srcset = placeholderImage; e.target.src = placeholderImage; }}
            />
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {product.category && (
                <Link href={`/products?category=${encodeURIComponent(product.category.name)}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-1 inline-block">
                  {product.category.name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
                {product.description || "No detailed description available for this product."}
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-500 mb-6">
                ${parseFloat(product.price).toFixed(2)}
              </p>
              <p className={`text-sm mb-4 ${product.stock_quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} available in stock` : 'Currently out of stock'}
              </p>
            </div>

            {/* Action Area: Quantity and Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="mt-auto"> {/* Pushes to the bottom if content above is short */}
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</label>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Ensure valid number
                    className="w-12 text-center border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    min="1"
                    max={product.stock_quantity} // Optionally set max based on stock
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity} // Disable if quantity reaches stock
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out text-lg"
                >
                  Add to Cart
                </button>
              </div>
            )}
             <div className="mt-6 text-center">
                <Link href="/products" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    &larr; Back to all products
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
