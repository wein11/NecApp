import CardSwap, { Card } from './CardSwap';

// Pila de productos: cada tarjeta es una foto o captura real con su nombre.
export default function ProductStack({ items, label }) {
  return (
    <CardSwap
      width={460}
      height={340}
      cardDistance={50}
      verticalDistance={56}
      delay={4200}
      theme="necapp"
      cardRadius={0}
      dim={0.45}
      ariaLabel={label}
    >
      {items.map((item) => (
        <Card key={item.title}>
          <a className="stack-card" href={item.href} draggable={false}>
            <span className="stack-head">
              <span className="stack-title">{item.title}</span>
              <span className="stack-tag">{item.tag}</span>
            </span>
            <span className="stack-media">
              <img src={item.image} alt={item.alt} draggable={false} loading="lazy" />
            </span>
          </a>
        </Card>
      ))}
    </CardSwap>
  );
}
