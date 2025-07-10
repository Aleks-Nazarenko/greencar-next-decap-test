import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";
import {slugify } from "@/lib/slug-utils";
import { useRouter} from "next/router";
import { getFooterData } from "@/lib/footer";
import Footer from "@/components/Footer";

export async function getStaticPaths() {
    const products = await getPkwAustauschfilter();
    const categories = [...new Set(products.map(p => slugify(p.category)))];
    return {
        paths: categories.map(c => ({ params: { category: c } })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const footer = await getFooterData();
    const products = await getPkwAustauschfilter();
    const productsFiltered = products.filter(p => slugify(p.category) === params.category);
    const categoryName = productsFiltered[0]?.category || params.category;
    const subCategories = [
        ...new Map(
            productsFiltered.map(p => [slugify(p.sub_category), p.sub_category])
        ).entries()
    ].map(([slug, label]) => ({ slug, label }));
    return { props: { category: params.category, subCategories, categoryName,footer } };
}

export default function SubCategoryList({ category, subCategories, categoryName, footer}) {
    const router = useRouter();
    const handleChange = (e) => {
        const selected = e.target.value;
        if (selected) {
            router.push(`/pkw-austauschfilter/${category}/${selected}`);
        }
    };
    return (
        <>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h1 className="mb-4 text-center">Subkategorien von {categoryName}</h1>
                        <div className="mb-5">
                            <select onChange={handleChange} className="form-select" defaultValue="">
                                <option value="">Bitte wählen...</option>
                                {subCategories.map((sub, i) => (
                                    <option key={i} value={sub.slug}>{sub.label}</option>
                                ))}
                            </select>
                        </div>
                        <ul className="list-group">
                            {subCategories.map((sub, i) => (
                                <li key={i} className="list-group-item">
                                    <a href={`/pkw-austauschfilter/${category}/${sub.slug}`} className="text-decoration-none">
                                        {sub.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer content={footer} />
        </>
    );
}
