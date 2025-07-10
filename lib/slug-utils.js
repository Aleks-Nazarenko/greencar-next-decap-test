export function generateSlug(product) {
    return `${product.product_name} ${product.product_code}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

export function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\\-]/g, '')
        .replace(/-+/g, '-');
}
