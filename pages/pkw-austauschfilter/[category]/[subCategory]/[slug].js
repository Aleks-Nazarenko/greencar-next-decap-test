import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";
import { generateSlug } from '@/lib/slug-utils';

export async function getStaticPaths() {
    const products = await getPkwAustauschfilter();
    const paths = products.map(p => ({
        params: {
            category: p.category.toLowerCase(),
            subCategory: p.sub_category.toLowerCase(),
            slug: generateSlug(p)
        }
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const products = await getPkwAustauschfilter();
    const product = products.find(p =>
        p.category.toLowerCase() === params.category &&
        p.sub_category.toLowerCase() === params.subCategory &&
        generateSlug(p) === params.slug
    );
    return { props: { product } };
}

export default function ProductPage({ product }) {
    const imageList = (product.images || '').split(',').map(img => img.trim()).filter(Boolean);
    return (
        <div className="container">
            <h1>{product.product_name}</h1>
            <div className="row mb-4">
                {imageList.map((img, i) => (
                    <div key={i} className="col-md-4">
                        <img src={`/uploads/${img}`} alt={`${product.product_name} ${i}`} className="img-fluid rounded shadow" />
                    </div>
                ))}
            </div>
            <p>Produktnummer: {product.product_code}</p>
            <p>Preis: {product.product_price} €</p>
            <p>Einbaupreis: {product.einbau_price} €</p>
            <p>Modelle: {product.modell_liste}</p>
            <p>Norm: {product.euronorm2_liste}</p>
        </div>
    );
}
