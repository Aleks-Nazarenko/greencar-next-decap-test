import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'content/startseite.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);

  // You can process markdown if needed here (e.g. FAQ answers or about)
  const processedAbout = await remark().use(html).process(data.about || '');
  const aboutHtml = processedAbout.toString();

  const processedFaq = await Promise.all(
      (data.faq || []).map(async (item) => {
        const processed = await remark().use(html).process(item.answer || '');
        return {
          ...item,
          answerHtml: processed.toString(),
        };
      })
  );

  return {
    props: {
      data: {
        ...data,
        faq: processedFaq,
        aboutHtml,
      },
    },
  };
}

export default function Home({ data }) {
  return (
      <main>
        {/* Hero */}
        <section className="hero-image d-flex align-items-center justify-content-center"
                 style={{
                     background: `url(${data.hero?.background}) no-repeat center bottom`,
                     backgroundSize: 'cover',
                     height: '580px',
                     width: '100%',
                     marginBottom: 0,
                 }}
        >
          <div className="text-center px-3 position-relative" style={{ color: 'LightYellow' }}>
            <h1 className="display-1 fw-bold text-shadow" style={{ color: '#45CA25' }}>
              {data.hero?.heading}
            </h1>
            <p className="fs-3 fw-semibold text-shadow mt-4">{data.hero?.subtext1}</p>
              <p className="fs-3 fw-semibold text-shadow mt-0">{data.hero?.subtext2}</p>
          </div>
        </section>

        {/* Cards */}
        <section className="pb-4" style={{ background: 'linear-gradient(to right, LightYellow, white, LightYellow)' }}>
          <div className="container py-5">
            <div className="row g-4">
              {data.cards?.map((card, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="card p-3 shadow text-center">
                      <div className="card-body">
                        <h3 className="card-title mb-4">{card.title}</h3>
                        <p className="card-text">{card.description}</p>
                        <a href={card.link} className="btn btn-primary">
                          {card.button}
                        </a>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-5 bg-white">
          <div className="container text-center">
            <div className="row g-4">
              {data.services?.map((service, i) => (
                  <div className="col-6 col-md-4 col-lg-2" key={i}>
                    <div className="rounded-circle shadow p-3 mx-auto" style={{ width: 120, height: 120 }}>
                      <img src={service.icon} alt={service.name} style={{ maxWidth: 90, maxHeight: 90 }} />
                    </div>
                    <h6 className="mt-3 icon-label">{service.name}</h6>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="accordion" id="faqAccordion">
              {data.faq?.map((item, i) => (
                  <div className="accordion-item" key={i}>
                    <h2 className="accordion-header" id={`heading${i}`}>
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${i}`}>
                        {item.question}
                      </button>
                    </h2>
                    <div id={`collapse${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-5" style={{ background: '#8BC379' }}>
          <div className="container text-center">
            <div className="row justify-content-center">
              {data.team?.map((member, i) => (
                  <div className="col-4 col-md-2" key={i}>
                    <img src={member.image} alt={member.alt} className="img-fluid rounded-circle shadow" />
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="ratio ratio-16x9 shadow" dangerouslySetInnerHTML={{ __html: data.map_embed }} />
          </div>
        </section>

        {/* About Section */}
        <section className="py-5">
          <div className="container">
            <h2 className="fw-bold mb-4">Über GREENCAR</h2>
            <div dangerouslySetInnerHTML={{ __html: data.aboutHtml }} />
          </div>
        </section>
      </main>
  );
}

