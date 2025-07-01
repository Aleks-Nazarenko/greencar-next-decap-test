import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";

export async function getStaticPaths() {
    const products = await getPkwAustauschfilter();
    const categories = [...new Set(products.map(p => p.category.toLowerCase()))];
    return {
        paths: categories.map(c => ({ params: { category: c } })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    const products = await getPkwAustauschfilter();
    const subCategories = [...new Set(
        products.filter(p => p.category.toLowerCase() === params.category)
            .map(p => p.sub_category)
    )];
    return { props: { category: params.category, subCategories } };
}

export default function SubCategoryList({ category, subCategories }) {
    return (
        <div className="container">
            <h1>Subkategorien von {category}</h1>
            <ul>
                {subCategories.map((sub, i) => (
                    <li key={i}><a href={`/pkw-austauschfilter/${category}/${sub.toLowerCase()}`}>{sub}</a></li>
                ))}
            </ul>
        </div>
    );
}
