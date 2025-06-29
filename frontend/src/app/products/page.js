// frontend/src/app/products/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, getCategories } from '../../services/api';
import ProductCard from '../../components/ProductCard'; // Adjust path as needed
import Link from 'next/link';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12; // Or get from API if configurable

  // Filter and Search state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fetchProductsData = useCallback(async (page, category, search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(page, productsPerPage, category, search);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalProducts(data.total || 0);
      setCurrentPage(data.current_page || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || 'Failed to fetch products.');
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  }, [productsPerPage]); // productsPerPage is stable

  useEffect(() => {
    // Initialize from URL params
    const urlPage = parseInt(searchParams.get('page')) || 1;
    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';

    setCurrentPage(urlPage);
    setSelectedCategory(urlCategory);
    setSearchTerm(urlSearch);

    fetchProductsData(urlPage, urlCategory, urlSearch);
  }, [searchParams, fetchProductsData]); // fetchProductsData is memoized

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Optionally set an error state for categories
      }
    };
    fetchCategoriesData();
  }, []);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on filter change
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 on new search
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Our Products
        </h1>

        {/* Filters and Search */}
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Category
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}> {/* Filter by category name */}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <form onSubmit={handleSearchSubmit} className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div className="sm:col-span-2">
                <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Products
                </label>
                <input
                  id="search-term"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors text-sm h-[42px]"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading products...</p>
            {/* You can add a spinner SVG or component here */}
          </div>
        )}
        {error && (
          <div className="text-center py-10">
            <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700 dark:text-gray-300">No products found matching your criteria.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {/* Page numbers (simplified for brevity) */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  // Limit number of page buttons shown for many pages
                  .filter(pageNumber => totalPages <= 5 || Math.abs(pageNumber - currentPage) < 2 || pageNumber === 1 || pageNumber === totalPages)
                  .map((pageNumber, index, arr) => (
                    <React.Fragment key={pageNumber}>
                      {index > 0 && arr[index-1] !== pageNumber -1 && pageNumber !== 1 && <span className="text-gray-500 dark:text-gray-400">...</span>}
                      <button
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 border text-sm font-medium rounded-md
                          ${currentPage === pageNumber
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        {pageNumber}
                      </button>
                    </React.Fragment>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Showing {products.length} of {totalProducts} products. Page {currentPage} of {totalPages}.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
