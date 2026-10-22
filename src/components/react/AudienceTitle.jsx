import RotatingText from './RotatingText';

// "Para hospitales / universidades / ..." con la palabra sobre un bloque turquesa.
export default function AudienceTitle({ lead, words, id }) {
  return (
    <h2 id={id} className="audience-title">
      <span className="audience-lead">{lead}</span>
      <RotatingText
        texts={words}
        effect="slide"
        direction="up"
        highlight
        highlightColor="#039e8a"
        staggerFrom="last"
        staggerDuration={0.02}
        splitLevelClassName="audience-split"
        rotationInterval={2400}
      />
    </h2>
  );
}
