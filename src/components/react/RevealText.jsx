import ScrollReveal from './ScrollReveal';

// Texto que se ilumina palabra por palabra a medida que se baja.
export default function RevealText({ text, className = '' }) {
  return (
    <ScrollReveal
      as="p"
      mode="scrub"
      splitBy="words"
      effect="fade"
      baseOpacity={0.15}
      baseRotation={0}
      enableBlur={false}
      highlightColor="#039e8a"
      containerClassName={className}
      rotationEnd="bottom 70%"
      wordAnimationEnd="bottom 70%"
    >
      {text}
    </ScrollReveal>
  );
}
