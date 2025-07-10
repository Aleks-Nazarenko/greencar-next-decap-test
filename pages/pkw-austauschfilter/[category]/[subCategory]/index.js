import { getPkwAustauschfilter } from "@/lib/pkw-austauschfilter-data";
import { generateSlug } from '@/lib/slug-utils';
import { slugify} from "@/lib/slug-utils";
import {getFooterData} from "@/lib/footer";
import Footer from "@/components/Footer";
export async function getStaticPaths() {
    const products = await getPkwAustauschfilter();
    const paths = products.map(p => ({
        params: {
            category: slugify(p.category),
            subCategory: slugify(p.sub_category)  //kein check, muss also existieren, sonst error
        }
    }));
    const uniquePaths = Array.from(new Set(paths.map(p => JSON.stringify(p)))).map(s => JSON.parse(s));
    return { paths: uniquePaths, fallback: false };
}

export async function getStaticProps({ params }) {
    const footer = await getFooterData();
    const products = await getPkwAustauschfilter();
    const list = products.filter(p =>
        slugify(p.category) === params.category &&
        slugify(p.sub_category) === params.subCategory
    );
    const categoryName = list[0]?.category || params.category;
    const subCategoryName = list[0]?.sub_category || params.subCategory;
    return { props: { products: list, category: params.category, subCategory: params.subCategory,categoryName, subCategoryName, footer } };
}

export default function ProductList({ products, category, subCategory,categoryName, subCategoryName,footer }) {

    return (
        <>
            <div className="container">
                <h1>Produkte in {categoryName} {subCategoryName}</h1>
                <div className="row">
                    {products.map(p => {
                        const [firstImage] = (p.images || '').split(',');
                        return (
                            <div key={p.product_code} className="col-md-4">
                                <div className="card mb-4">
                                    {firstImage && <img src={`/uploads/${firstImage.trim()}`} className="card-img-top" alt={p.product_name} />}
                                    <div className="card-body">
                                        <h5 className="card-title">{p.product_name}</h5>
                                        <p className="card-text">{p.product_price} €</p>
                                        <a href={`/pkw-austauschfilter/${category}/${subCategory}/${generateSlug(p)}`} className="btn btn-primary">Details</a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer content={footer} />
        </>
    );
}
