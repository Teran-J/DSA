import React, { useEffect, useState } from 'react';
import { designService } from '../api/services/designService';
import type { DesignWithRelations } from '../types/api';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const [designs, setDesigns] = useState<DesignWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDesigns();
    }, []);

    const loadDesigns = async () => {
        try {
            const data = await designService.getMyDesigns();
            setDesigns(data.designs);
        } catch (error) {
            console.error('Error loading designs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Cargando diseños...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Mis Diseños</h1>
                <Link to="/products" className="btn-primary">Nuevo Diseño</Link>
            </div>

            {designs.length === 0 ? (
                <div className="empty-state">
                    <p>No tienes diseños aún.</p>
                    <Link to="/products">¡Crea el primero!</Link>
                </div>
            ) : (
                <div className="designs-grid">
                    {designs.map((design) => (
                        <div key={design.id} className="design-card">
                            <div className="design-preview">
                                <img
                                    src={design.product.thumbnailUrl || 'https://via.placeholder.com/300'}
                                    alt={design.product.name}
                                    className="product-bg"
                                />
                                <img
                                    src={design.imageUrl}
                                    alt="Stamp"
                                    className="stamp-overlay"
                                    style={{
                                        transform: `
                      translate(${design.transforms.position.x}px, ${design.transforms.position.y}px)
                      rotate(${design.transforms.rotation.z}deg)
                      scale(${design.transforms.scale.x})
                    `
                                    }}
                                />
                            </div>
                            <div className="design-info">
                                <h3>{design.product.name}</h3>
                                <span className={`status-badge status-${design.status.toLowerCase()}`}>
                                    {design.status}
                                </span>
                                <p className="date">{new Date(design.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
