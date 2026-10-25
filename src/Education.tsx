import { useCallback, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Download,
  FileText,
  Flower2,
} from "lucide-react";
import { Modal } from "./Booking";
import { articles, resources } from "./education-content";
import "./education.css";

type Article = (typeof articles)[number];

export default function Education() {
  const [article, setArticle] = useState<Article | null>(null);
  const closeArticle = useCallback(() => setArticle(null), []);

  return (
    <>
      <section
        id="blog"
        className="cg-education cg-container"
        aria-labelledby="cg-education-heading"
      >
        <div className="cg-section-heading cg-reveal">
          <div>
            <span className="cg-eyebrow">INFORMACIÓN PARA DECIDIR</span>
            <h2 id="cg-education-heading">
              Educación para <em>tu salud.</em>
            </h2>
          </div>
          <p>
            Una lectura cercana.
            <br />
            Un espacio para tus preguntas.
          </p>
        </div>
        <div className="cg-education-grid">
          {articles.map((item) => (
            <article className="cg-education-card" key={item.id}>
              <button
                className="cg-education-image-button"
                onClick={() => setArticle(item)}
                aria-label={`Leer artículo: ${item.title}`}
              >
                <img src={item.image} alt={item.imageAlt} loading="lazy" />
                <span className="cg-education-open" aria-hidden="true">
                  <ArrowUpRight size={22} />
                </span>
              </button>
              <div className="cg-education-card-copy">
                <span className="cg-education-category">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.intro}</p>
                <button
                  className="cg-text-link"
                  onClick={() => setArticle(item)}
                >
                  Leer artículo <ArrowUpRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="recursos"
        className="cg-education-resources cg-container"
        aria-labelledby="cg-resources-heading"
      >
        <div className="cg-section-heading cg-reveal">
          <div>
            <span className="cg-eyebrow">PARA GUARDAR Y CONSULTAR</span>
            <h2 id="cg-resources-heading">
              Pequeñas guías.
              <br />
              <em>Más claridad.</em>
            </h2>
          </div>
          <p>
            Llévalas contigo.
            <br />
            Compártelas en tu próxima consulta.
          </p>
        </div>
        <div className="cg-education-resource-grid">
          {resources.map((item) => (
            <article className="cg-education-resource" key={item.id}>
              <img src={item.image} alt={item.imageAlt} loading="lazy" />
              <div className="cg-education-resource-copy">
                <span className="cg-education-format">
                  <FileText size={14} /> PDF · {item.pages} páginas
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a
                  className="cg-text-link"
                  href={item.file}
                  download={item.filename}
                >
                  Descargar guía <Download size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="cg-education-note">
          <BookOpen size={16} /> Material educativo general para preparar tus
          preguntas. No reemplaza una atención profesional individual.
        </p>
      </section>

      {article && (
        <Modal
          onClose={closeArticle}
          title={article.title}
          className="cg-education-modal"
        >
          <span className="cg-education-category">
            <Flower2 size={15} /> {article.category}
          </span>
          <h2>{article.title}</h2>
          <p className="cg-education-article-intro">{article.intro}</p>
          <img
            className="cg-education-article-image"
            src={article.image}
            alt={article.imageAlt}
          />
          <div className="cg-education-article-body">
            {article.sections.map((section) => (
              <section key={section.title}>
                <h3>{section.title}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <p className="cg-education-article-note">
            Contenido educativo de Matrona Guía. La orientación individual
            depende de tus antecedentes y del motivo de consulta.
          </p>
          <button className="button full-width" onClick={closeArticle}>
            Volver a las lecturas
          </button>
        </Modal>
      )}
    </>
  );
}
