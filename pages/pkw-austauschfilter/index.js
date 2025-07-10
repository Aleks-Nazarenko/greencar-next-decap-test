import { getPkwAustauschfilter} from "@/lib/pkw-austauschfilter-data";
import { slugify} from '@/lib/slug-utils';
import { useRouter } from "next/router";
import {getFooterData} from "@/lib/footer";
import Footer from "@/components/Footer";
export async function getStaticProps() {
    const footer = await getFooterData();
    const products = await getPkwAustauschfilter();
    const categories = [...new Set(products.map(p => slugify(p.category)))];
    return { props: { categories, footer } };
}

export default function CategoryList({ categories, footer}) {
    const router = useRouter();
    const handleChange = (e) => {
        const selected = e.target.value;
        if (selected) {
            router.push(`/pkw-austauschfilter/${slugify(selected)}`);
        }
    };
    return (
        <>
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1>Kategorien</h1>
                    <div className="mb-5">
                        <select onChange={handleChange} className="form-select" defaultValue="">
                            <option value="">Bitte wählen...</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <ul className={"list-group"}>
                        {categories.map((cat, i) => (
                            <li key={i} className="list-group-item">
                                <a className="text-decoration-none" href={`/pkw-austauschfilter/${slugify(cat)}`}>{cat}</a>
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
