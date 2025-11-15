import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, getProducts, getAvailableServices } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";

// Dummy image fallback
const DUMMY_IMG = "https://placehold.co/120x80?text=Image";

// Utility: debounce
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Summary row
function SummaryRow({ categories, productsCount, services }) {
  return (
    <div className={styles.summaryRow}>
      <div className={styles.summaryItem}>
        <span className={styles.summaryCount}>{categories.length}</span>
        <span>Categories</span>
      </div>
      <div className={styles.summaryItem}>
        <span className={styles.summaryCount}>{productsCount}</span>
        <span>Products</span>
      </div>
      <div className={styles.summaryItem}>
        <span className={styles.summaryCount}>{services.length}</span>
        <span>Services</span>
      </div>
    </div>
  );
}

// Category panel with expand/collapse and search
function CategoriesPanel({
  categories,
  expanded,
  onToggle,
  search,
  setSearch,
  loading,
  error,
  onRetry,
}) {
  return (
    <aside className={styles.categoriesPanel} aria-label="Categories">
      <div className={styles.categoriesHeader}>
        <span>Categories</span>
        <button
          className={styles.retryBtn}
          style={{ display: error ? "inline-block" : "none" }}
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
      <input
        className={styles.searchInput}
        type="search"
        placeholder="Search categories"
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Search categories"
      />
      {loading && (
        <div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.categorySkeleton} />
          ))}
        </div>
      )}
      {error && <div className={styles.errorText}>{error}</div>}
      {!loading && !error && (
        <ul className={styles.categoryList}>
          {categories.map(cat => (
            <li key={cat.category_id}>
              <button
                className={styles.categoryBtn}
                aria-expanded={expanded === cat.category_id}
                aria-controls={`cat-panel-${cat.category_id}`}
                onClick={() => onToggle(cat.category_id)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") onToggle(cat.category_id);
                }}
              >
                <span>{cat.name}</span>
                <span className={styles.chevron}>
                  {expanded === cat.category_id ? "▼" : "▶"}
                </span>
              </button>
            </li>
          ))}
          {categories.length === 0 && <li>No categories found.</li>}
        </ul>
      )}
    </aside>
  );
}

// Products grid for a category
function ProductsGrid({
  category,
  productsQuery,
  onRetry,
  search,
  setSearch,
  page,
  setPage,
  hasMore,
}) {
  return (
    <section
      className={styles.productsSection}
      aria-labelledby={`cat-header-${category.category_id}`}
    >
      <div className={styles.productsHeader}>
        <h2 id={`cat-header-${category.category_id}`}>
          {category.name}{" "}
          <span className={styles.productsCount}>
            ({productsQuery.data?.products?.length || 0})
          </span>
        </h2>
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search products"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label={`Search products in ${category.name}`}
        />
      </div>
      {productsQuery.isLoading && (
        <div className={styles.productsGrid}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.productSkeleton} />
          ))}
        </div>
      )}
      {productsQuery.isError && (
        <div className={styles.errorText}>
          {productsQuery.error.message}
          <button className={styles.retryBtn} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      {productsQuery.isSuccess && (
        <>
          <div className={styles.productsGrid}>
            {productsQuery.data.products.length === 0 && (
              <div className={styles.emptyState}>No products found.</div>
            )}
            {productsQuery.data.products.map(prod => (
              <div className={styles.productCard} key={prod.product_id}>
                <img
                  src={prod.image_url || DUMMY_IMG}
                  alt={prod.name}
                  className={styles.cardImg}
                />
                <div>
                  <div className={styles.cardTitle}>{prod.name}</div>
                  <div className={styles.cardDesc}>{prod.description}</div>
                  <div className={styles.cardPrice}>₹{prod.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.paginationRow}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className={styles.pageNum}>Page {page}</span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

// Services section
function ServicesSection({ servicesQuery, onRetry }) {
  return (
    <section className={styles.servicesSection} aria-label="Services">
      <h2>Services</h2>
      {servicesQuery.isLoading && (
        <div className={styles.servicesGrid}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.serviceSkeleton} />
          ))}
        </div>
      )}
      {servicesQuery.isError && (
        <div className={styles.errorText}>
          {servicesQuery.error.message}
          <button className={styles.retryBtn} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      {servicesQuery.isSuccess && (
        <div className={styles.servicesGrid}>
          {servicesQuery.data.services.length === 0 && (
            <div className={styles.emptyState}>No services found.</div>
          )}
          {servicesQuery.data.services.map(serv => (
            <div className={styles.serviceCard} key={serv.service_id}>
              <img
                src={serv.image_url || DUMMY_IMG}
                alt={serv.service_name}
                className={styles.cardImg}
              />
              <div>
                <div className={styles.cardTitle}>{serv.service_name}</div>
                <div className={styles.cardPrice}>₹{serv.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Main Dashboard
const Dashboard = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  // Categories state
  const [expandedCat, setExpandedCat] = useState(null);
  const [catSearch, setCatSearch] = useState("");
  const debouncedCatSearch = useDebounce(catSearch, 300);

  // Per-category search and page state
  const [catProductSearch, setCatProductSearch] = useState({});
  const [catProductPage, setCatProductPage] = useState({});

  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ["categories", debouncedCatSearch],
    queryFn: async () => {
      const res = await getCategories();
      if (debouncedCatSearch)
        res.categories = res.categories.filter(cat =>
          cat.name.toLowerCase().includes(debouncedCatSearch.toLowerCase())
        );
      return res.categories;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch services
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => getAvailableServices(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch products for expanded category only (lazy loading)
  const expandedCategory = useMemo(
    () =>
      categoriesQuery.data?.find(cat => cat.category_id === expandedCat) || null,
    [categoriesQuery.data, expandedCat]
  );
  const expandedCatSearch = catProductSearch[expandedCat] || "";
  const expandedCatPage = catProductPage[expandedCat] || 1;

  const productsQuery = useQuery({
    queryKey: [
      "products",
      expandedCat,
      expandedCatSearch,
      expandedCatPage,
      accessToken,
    ],
    queryFn: async () => {
      if (!expandedCat) return { products: [], total: 0, page: 1, limit: 12 };
      const params = new URLSearchParams({
        categoryId: expandedCat,
        search: expandedCatSearch,
        page: expandedCatPage,
        limit: 8,
      });
      const res = await getProducts(accessToken, params.toString());
      return res;
    },
    enabled: !!expandedCat,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // Count all products (for summary row)
  const allProductsCount = queryClient.getQueryData(["allProductsCount"]) || 0;
  useEffect(() => {
    if (categoriesQuery.data && accessToken) {
      // Prefetch all products count (not paginated, just for summary)
      getProducts(accessToken).then(res => {
        queryClient.setQueryData(["allProductsCount"], res.products.length);
      });
    }
  }, [categoriesQuery.data, accessToken, queryClient]);

  // Handlers
  const handleExpand = useCallback(
    catId => setExpandedCat(expandedCat === catId ? null : catId),
    [expandedCat]
  );
  const handleCatProductSearch = useCallback(
    (catId, val) =>
      setCatProductSearch(prev => ({ ...prev, [catId]: val })),
    []
  );
  const handleCatProductPage = useCallback(
    (catId, val) =>
      setCatProductPage(prev => ({ ...prev, [catId]: val })),
    []
  );

  // Fallback UI for loading/error
  if (categoriesQuery.isLoading || servicesQuery.isLoading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading dashboard...</div>;
  }
  if (categoriesQuery.isError) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        Failed to load categories. <button onClick={() => categoriesQuery.refetch()}>Retry</button>
      </div>
    );
  }
  if (servicesQuery.isError) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        Failed to load services. <button onClick={() => servicesQuery.refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <SummaryRow
        categories={categoriesQuery.data || []}
        productsCount={allProductsCount}
        services={servicesQuery.data?.services || []}
      />
      <div className={styles.dashboardMain}>
        <CategoriesPanel
          categories={categoriesQuery.data || []}
          expanded={expandedCat}
          onToggle={handleExpand}
          search={catSearch}
          setSearch={setCatSearch}
          loading={categoriesQuery.isLoading}
          error={categoriesQuery.isError ? categoriesQuery.error.message : null}
          onRetry={() => categoriesQuery.refetch()}
        />
        <main className={styles.productsMain}>
          {expandedCategory ? (
            <ProductsGrid
              category={expandedCategory}
              productsQuery={productsQuery}
              onRetry={() => productsQuery.refetch()}
              search={catProductSearch[expandedCat] || ""}
              setSearch={val => handleCatProductSearch(expandedCat, val)}
              page={catProductPage[expandedCat] || 1}
              setPage={val => handleCatProductPage(expandedCat, val)}
              hasMore={
                productsQuery.data &&
                productsQuery.data.products.length === 8
              }
            />
          ) : (
            <div className={styles.emptyState}>
              Select a category to view products.
            </div>
          )}
          <ServicesSection
            servicesQuery={servicesQuery}
            onRetry={() => servicesQuery.refetch()}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
