import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";
import { generateSlug } from '@/lib/slug-utils';
import { slugify } from "@/lib/slug-utils";
import { getFooterData } from "@/lib/footer";
import Footer from "@/components/Footer";

export async function getStaticPaths() {
    const products = await getPkwAustauschfilter();
    const paths = products.map(p => ({
        params: {
            category: slugify(p.category),
            subCategory: slugify(p.sub_category),
            slug: generateSlug(p)
        }
    }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const footer = await getFooterData();
    const products = await getPkwAustauschfilter();
    const product = products.find(p =>
        slugify(p.category) === params.category &&
        slugify(p.sub_category) === params.subCategory &&
        generateSlug(p) === params.slug
    );
    return { props: { product,footer } };
}

export default function ProductPage({ product, footer }) {
    const imageList = (product.images || '').split(',').map(img => img.trim()).filter(Boolean);
    return (
        <>
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
            <Footer content={footer} />
        </>
    );
}
