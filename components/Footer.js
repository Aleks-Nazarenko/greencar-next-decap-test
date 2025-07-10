

export default function Footer({ content }) {
    if (!content || !content.partners) return null;

    return (
        <footer className="py-5 mt-5" style={{ background: 'beige' }}>
            <div className="container-fluid">
                <div className="row row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-8 g-5 justify-content-center align-items-center text-center">
                    {content.partners.map((item, i) => (
                        <div className="col" key={i}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={item.logo}
                                    className="img-fluid brand-icon"
                                    alt={`Partner ${i + 1}`}
                                />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
// This component reads the footer content from a markdown file and displays partner logos.
