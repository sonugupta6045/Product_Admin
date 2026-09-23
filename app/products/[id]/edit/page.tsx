'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchProduct } from '@/lib/api/products';
import { Product } from '@/types';
import ProductForm from '@/components/ProductForm';
import AsyncState from '@/components/AsyncState';

export default function EditProductPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const id = parseInt(rawId, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  function load() {
    if (isNaN(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetchProduct(id, controller.signal)
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'CanceledError') return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (
          err instanceof Error &&
          (err.message.includes('404') || err.message.includes('not found'))
        ) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [rawId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="text-gray-500">No product with ID {rawId} exists.</p>
        <Link href="/products" className="btn-primary">← Back to products</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/products" className="btn-ghost px-2" aria-label="Back">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
          {product && (
            <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{product.title}</p>
          )}
        </div>
      </div>

      <div className="card">
        <AsyncState
          loading={loading}
          error={error}
          empty={false}
          onRetry={load}
          skeletonRows={6}
        >
          {product && <ProductForm product={product} />}
        </AsyncState>
      </div>
    </div>
  );
}
