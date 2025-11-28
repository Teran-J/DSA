import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../api/services/productService';
import type { Product } from '../types/api';

export const ProductCatalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll(category || undefined);
            setProducts(data.products);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Cargando productos...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">Todas las categorías</option>
                    <option value="camisetas">Camisetas</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="polos">Polos</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                    <Link key={product.id} to={`/editor/${product.id}`} className="group">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                            <img
                                src={product.thumbnailUrl || 'https://via.placeholder.com/300'}
                                alt={product.name}
                                className="w-full h-full object-center object-cover group-hover:opacity-75"
                            />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
