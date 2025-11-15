import { ShoppingCart, Heart, Star, Shield, Truck, Package } from 'lucide-react';

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
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-9xl">📦</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-20 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-green-500 transition">
                <div className="text-3xl">📦</div>
              </div>
            ))}
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

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.8) 127 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-green-600">
              ₹{product.price ? product.price.toLocaleString() : '0'}
            </span>
            <span className="text-xl text-gray-400 line-through">
              ₹{product.price ? (product.price * 1.2).toLocaleString() : '0'}
            </span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              20% OFF
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'No description available. This product offers reliable power backup solutions for your home or office needs.'}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Warranty: 2 Years</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Certified Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">In Stock</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onAddToCart}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
            </button>
          </div>

          {/* Additional Info */}
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