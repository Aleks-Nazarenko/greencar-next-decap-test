import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";

export async function getStaticProps() {
    const products = await getPkwAustauschfilter();
    const categories = [...new Set(products.map(p => p.category))];
    return { props: { categories } };
}

export default function CategoryList({ categories }) {
    return (
        <div className="container">
            <h1>Kategorien</h1>
            <ul>
                {categories.map((cat, i) => (
                    <li key={i}><a href={`/pkw-austauschfilter/${cat.toLowerCase()}`}>{cat}</a></li>
                ))}
            </ul>
        </div>
    );
}
