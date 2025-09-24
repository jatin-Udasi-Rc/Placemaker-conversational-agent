'use client';

import { ExternalLink, Package, Truck, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  availability: boolean;
  unit_of_measure: string;
  keywords: string[];
  delivery_options: string[];
  categories: Array<Array<{ name: string; id: string }>>;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatDeliveryOptions = (options: string[]) => {
    return options?.map(option => {
      switch (option) {
        case 'courier':
          return 'Courier Delivery';
        case 'clickAndCollect':
          return 'Click & Collect';
        default:
          return option;
      }
    }).join(', ');
  };

  const getCategoryPath = (categories: Array<Array<{ name: string; id: string }>>) => {
    if (categories && categories.length > 0) {
      // Get the first category array that's not the root
      const categoryArray = categories.find(cat => cat.length > 0 && cat[0].name !== 'root');
      if (categoryArray) {
        return categoryArray.map(cat => cat.name).join(' > ');
      }
    }
    return 'General'; // Default category
  };

  return (
    <div className="bg-white border min-w-40 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${product.image_url ? 'hidden' : ''}`}>
          <Package className="w-16 h-16 text-gray-400" />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-2">
          {getCategoryPath(product.categories)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Keywords */}
        {product.keywords && product.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Availability & Delivery */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle 
              className={`w-4 h-4 ${product.availability ? 'text-green-500' : 'text-red-500'}`} 
            />
            <span className={`text-xs ${product.availability ? 'text-green-700' : 'text-red-700'}`}>
              {product.availability ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">
              {formatDeliveryOptions(product.delivery_options)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-accent hover:bg-[#0099D4] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[40px]"
        >
          <span className="whitespace-nowrap">View Product</span>
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
        </a>
      </div>
    </div>
  );
}
