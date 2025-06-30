import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import {useEffect, useRef} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    useEffect(() => {
        const video = document.getElementById('teamVideo');
        const section = document.querySelector('.mirco');

        if (!video || !section) {
            console.warn('Video oder Sektion nicht gefunden.');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().catch((e) =>
                            console.warn('Video konnte nicht abgespielt werden:', e)
                        );
                    } else {
                        video.pause();
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        observer.observe(section);

        return () => {
            observer.disconnect(); // clean up
        };
    }, []);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const bubblesRef = useRef(null);

    useEffect(() => {
        const container = bubblesRef.current;
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = Math.floor(Math.random() * 40 + 20); // 20–60px
            const top = Math.floor(Math.random() * 80); // 0–80%
            const delay = Math.random() * 10;
            const duration = 8 + Math.random() * 10; // 8–18s
            const opacity = 0.2 + Math.random() * 0.5;

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.top = `${top}%`;
            bubble.style.right = `-${size}px`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.background = `rgba(255, 255, 255, ${opacity})`;
            bubble.style.position = 'absolute';
            bubble.style.borderRadius = '50%';
            bubble.style.pointerEvents = 'none';
            bubble.style.zIndex = '0';

            container.appendChild(bubble);
        }
    }, []);
  return (
      <>
      <main>
        {/* Hero */}
        <section className="hero-image d-flex align-items-center justify-content-center  position-relative"
                 style={{
                     background: `url(${data.hero?.background}) no-repeat center bottom`,
                     backgroundSize: 'cover',
                     height: '580px',
                     width: '100%',
                     marginBottom: 0,
                 }}
        >
            <div className="bubbles position-absolute top-0 start-0 w-100 h-100 overflow-hidden" ref={bubblesRef}></div>
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

            <div className="pt-4"></div>
            <h2 className="text-center header-green fw-bold mb-5" data-aos="fade-up">
                {data.services?.heading || 'Unsere Dienstleistungen'}
                </h2>
          <div className="container text-center py-0">
            <div className="row g-4">
              {data.services?.items?.map((service, i) => (
                  <div className="col-6 col-md-4 col-lg-2" key={i}  data-aos="zoom-in" data-aos-delay={i * 50}>
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
        <section className="py-5" style={{ background: 'ivory' }}>
          <div className="container my-5 py-5 shadow">
              <div className="row g-4">
                <div className="col-md">
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
                  {data.accordion_image && (
                      <div className="col-md-6">
                          <div className="card p-3" style={{padding:'0!important'}}>
                            <img src={data.accordion_image} alt="Accordion Illustration" className="img-fluid rounded shadow"  style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '15px' }} />
                          </div>
                      </div>
                  )}
              </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-5" style={{ background: '#8BC379' }}>
          <div className="pt-4"></div>
          <div className="container text-center">
              <div className="row align-items-center">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                      <div className="row row-cols-4 g-2 justify-content-center px-3">
                          {data.team?.map((member, i) => (

                              <div className={member.media_type === 'video' ? 'mirco col' : 'col'} key={i}>
                                  {member.media_type === 'image' && (
                                    <img src={member.image} alt={member.alt} className="img-fluid mitarbeiter mitarbeiter-circle shadow" />
                                  )}
                                  {member.media_type === 'video' && (
                                      <video
                                          id="teamVideo"
                                          className="img-fluid mitarbeiter mitarbeiter-circle shadow"
                                          src={member.video}
                                          muted
                                          loop
                                          playsInline
                                          style={{ maxWidth: '145px', width:'100%', height: 'auto', borderRadius: '50%' }}
                                      />
                                  )}
                              </div>
                          ))}
                    </div>
                        </div>
                  <div className="col-lg-6 text-white px-4">
                      <h2 className="text-center fw-bold mb-5">Rufen Sie uns einfach an, wir helfen Ihnen gerne.</h2>
                      <p className="mb-0">Ihr Partikelfilter ist defekt? Kein Grund zur Sorge! GREENCAR holt ihn in nur
                          2 Stunden ab, reinigt ihn professionell – und liefert ihn innerhalb von <strong>48
                              Stunden</strong> zurück – komplett einbaufertig. Abholung, Reinigung und Rückversand –
                          alles inklusive. Unsere Mitarbeiter sind von <strong>08:00 bis 18:00 Uhr</strong> für Sie da.
                      </p>
                      <div className="w-100 pt-5"></div>
                      <h2 className="display-2 fw-bold" style={{lineHeight: '68px!important'}}>030 - 417 220 80</h2>
                      <div className="w-100 pt-5"></div>
                      <p>GREENCAR GMBH &bullet; Bessemerstraße 16 &bullet; 12103 Berlin &bullet; Deutschland</p>
                  </div>
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
          {data.about?.trim() && (
            <section className="py-5">
              <div className="container">
                <h2 className="fw-bold mb-4">Über GREENCAR</h2>
                <div dangerouslySetInnerHTML={{ __html: data.aboutHtml }} />
              </div>
            </section>
        )}

            {/* Contact Section */}
      </main>
    <footer className="py-5 mt-5" style={{background: 'beige'}}>
        <div className="container-fluid">
            <div className="row row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-8 g-5 justify-content-center align-items-center text-center">
                {data.footer?.map((item, i) => (
                    <div className="col" key={i}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <img src={item.logo} className={"img-fluid brand-icon"} alt={"Partner"}/>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    </footer>
</>
  );
}

