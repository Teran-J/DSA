import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/services/productService';
import { uploadService } from '../api/services/uploadService';
import { designService } from '../api/services/designService';
import type { Product, Transforms } from '../types/api';

export const DesignEditor: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [stampUrl, setStampUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Transforms state (2D visualizer mapping to 3D structure)
    const [transforms, setTransforms] = useState<Transforms>({
        position: { x: 0, y: 0, z: 0.1 }, // z is layer order in 2D
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
    });

    useEffect(() => {
        if (productId) {
            loadProduct(parseInt(productId));
        }
    }, [productId]);

    const loadProduct = async (id: number) => {
        try {
            const data = await productService.getById(id);
            setProduct(data);
            if (data.availableColors.length > 0) {
                setSelectedColor(data.availableColors[0]);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const { url } = await uploadService.uploadImage(file);
            setStampUrl(url);
        } catch (error) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveDesign = async () => {
        if (!product || !stampUrl) return;

        try {
            await designService.create({
                productId: product.id,
                color: selectedColor,
                imageUrl: stampUrl,
                transforms: transforms,
            });
            navigate('/dashboard');
        } catch (error) {
            alert('Error saving design');
        }
    };

    // 2D Manipulation Handlers
    const handlePositionChange = (axis: 'x' | 'y', value: number) => {
        setTransforms(prev => ({
            ...prev,
            position: { ...prev.position, [axis]: value }
        }));
    };

    const handleScaleChange = (value: number) => {
        setTransforms(prev => ({
            ...prev,
            scale: { x: value, y: value, z: 1 }
        }));
    };

    const handleRotationChange = (value: number) => {
        setTransforms(prev => ({
            ...prev,
            rotation: { ...prev.rotation, z: value }
        }));
    };

    if (loading || !product) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                {/* Visualizer Area */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden h-[500px] flex items-center justify-center border border-gray-200">
                    {/* Base Product Image */}
                    <img
                        src={product.baseModelUrl} // In a real app, this would change based on color
                        alt="Product Base"
                        className="max-h-full max-w-full object-contain"
                    />

                    {/* Stamp Overlay */}
                    {stampUrl && (
                        <div
                            className="absolute"
                            style={{
                                transform: `
                  translate(${transforms.position.x}px, ${transforms.position.y}px)
                  rotate(${transforms.rotation.z}deg)
                  scale(${transforms.scale.x})
                `,
                                cursor: 'move'
                            }}
                        >
                            <img
                                src={stampUrl}
                                alt="Stamp"
                                className="w-32 h-32 object-contain" // Base size
                            />
                        </div>
                    )}
                </div>

                {/* Controls Area */}
                <div className="mt-8 lg:mt-0">
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <p className="text-xl text-gray-900 mt-2">${product.price}</p>

                    {/* Color Selection */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900">Color</h3>
                        <div className="mt-2 flex items-center space-x-3">
                            {product.availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`
                    w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                  `}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Upload */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-gray-900">Estampado</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo...</p>}
                    </div>

                    {/* Transforms Controls */}
                    {stampUrl && (
                        <div className="mt-8 space-y-4">
                            <h3 className="text-sm font-medium text-gray-900">Ajustes</h3>

                            <div>
                                <label className="text-xs text-gray-500">Escala</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={transforms.scale.x}
                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500">Rotación</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={transforms.rotation.z}
                                    onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500">Posición X</label>
                                    <input
                                        type="range"
                                        min="-200"
                                        max="200"
                                        value={transforms.position.x}
                                        onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Posición Y</label>
                                    <input
                                        type="range"
                                        min="-200"
                                        max="200"
                                        value={transforms.position.y}
                                        onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10">
                        <button
                            onClick={handleSaveDesign}
                            disabled={!stampUrl}
                            className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Guardar Diseño
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
