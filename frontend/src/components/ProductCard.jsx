// frontend/src/components/ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const placeholderImage = "https://via.placeholder.com/300x200.png?text=No+Image"; // Default placeholder

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/products/${product.prd_id}`} className="block">
        <div className="relative w-full h-48 sm:h-56"> {/* Fixed height container for image */}
          <Image
            src={product.image_url || placeholderImage}
            alt={product.name || "Product image"}
            layout="fill" // Fill the container
            objectFit="cover" // Cover the area, cropping if necessary
            className="transition-opacity duration-300 group-hover:opacity-90"
            onError={(e) => { e.target.srcset = placeholderImage; e.target.src = placeholderImage; }} // Fallback for broken images
          />
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        {product.category && (
          <p className="text-xs text-indigo-500 dark:text-indigo-400 uppercase font-semibold mb-1">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.prd_id}`}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate" title={product.name}>
            {product.name}
          </h3>
        </Link>
        {/* <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 truncate-2-lines h-10">
          {product.description || "No description available."}
        </p> */}
        <div className="flex items-center justify-between">
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-500">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          {/* Add to cart button can go here later */}
          {/* <button className="px-3 py-1.5 bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-indigo-600 transition-colors">
            Add to Cart
          </button> */}
        </div>
        <p className={`text-xs mt-2 ${product.stock_quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

// CSS for multi-line truncation (if needed, can be added to globals.css)
/*
.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
*/
