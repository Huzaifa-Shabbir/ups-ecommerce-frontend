import { ShoppingCart, Heart, Shield, Truck, Package, Star } from 'lucide-react';

const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const categoryName = typeof product.category === 'object' 
    ? product.category?.name 
    : product.category;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'Product')}&size=600&background=27ae60&color=fff&bold=true`;
                }}
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name || 'Product')}&size=600&background=27ae60&color=fff&bold=true`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Category Badge */}
          {categoryName && (
            <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {categoryName}
            </span>
          )}

          {/* Product Name */}
          <h2 className="text-3xl font-bold text-gray-900">
            {product.name || 'Unnamed Product'}
          </h2>

          {/* Price */}
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-green-600">
              ₹{product.price ? product.price.toLocaleString() : '0'}
            </span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-600" />
            <span className={`text-sm font-medium ${(product.Quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(product.Quantity || 0) > 0 ? `${product.Quantity} units in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onAddToCart}
              disabled={(product.Quantity || 0) === 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{(product.Quantity || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="bg-green-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <Shield className="w-4 h-4" />
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <Truck className="w-4 h-4" />
              <span>Free Shipping on orders above ₹5000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="mt-8 border-t pt-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Truck className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
            <p className="text-sm text-gray-600">Get your order within 3-5 business days</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
            <p className="text-sm text-gray-600">100% secure payment gateway</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <Package className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
            <p className="text-sm text-gray-600">7-day return policy for all products</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailModal;