import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { getCategories, getProducts, getAvailableServices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DUMMY_IMG = "https://placehold.co/120x80?text=Image";

const Dashboard = () => {
  const { accessToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    Promise.all([
      getCategories(),
      getProducts(accessToken),
      getAvailableServices(accessToken)
    ])
      .then(([catRes, prodRes, servRes]) => {
        setCategories(catRes.categories || []);
        setProducts(prodRes.products || []);
        setServices(servRes.services || []);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return (
    <div className={styles.dashboard}>
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1>Welcome to Electrify</h1>
          <p>Your one-stop UPS e-commerce platform for products & services.</p>
        </div>
      </section>

      {loading && <div className={styles.loading}>Loading...</div>}
      {err && <div className={styles.error}>{err}</div>}

      {!loading && !err && (
        <>
          {/* Categories */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Categories</h2>
            <div className={styles.categories}>
              {categories.map(cat => (
                <div className={styles.categoryCard} key={cat.category_id}>
                  <img src={DUMMY_IMG} alt={cat.name} className={styles.cardImg} />
                  <div>
                    <div className={styles.cardTitle}>{cat.name}</div>
                    <div className={styles.cardDesc}>{cat.description}</div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <div>No categories found.</div>}
            </div>
          </section>

          {/* Products */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Products</h2>
            <div className={styles.products}>
              {products.map(prod => (
                <div className={styles.productCard} key={prod.product_id}>
                  <img src={DUMMY_IMG} alt={prod.name} className={styles.cardImg} />
                  <div>
                    <div className={styles.cardTitle}>{prod.name}</div>
                    <div className={styles.cardDesc}>{prod.description}</div>
                    <div className={styles.cardPrice}>₹{prod.price}</div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div>No products found.</div>}
            </div>
          </section>

          {/* Services */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.services}>
              {services.map(serv => (
                <div className={styles.serviceCard} key={serv.service_id}>
                  <img src={DUMMY_IMG} alt={serv.service_name} className={styles.cardImg} />
                  <div>
                    <div className={styles.cardTitle}>{serv.service_name}</div>
                    <div className={styles.cardPrice}>₹{serv.price}</div>
                  </div>
                </div>
              ))}
              {services.length === 0 && <div>No services found.</div>}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
