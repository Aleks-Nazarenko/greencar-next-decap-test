export function generateSlug(product) {
    return `${product.product_name} ${product.product_code}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}
