import TextType from './TextType';

// Título del hero: la primera línea queda fija y la segunda se escribe sola.
export default function HeroTitle({ prefix, lines, id }) {
  return (
    <TextType
      as="h1"
      id={id}
      className="hero-title"
      prefix={prefix}
      text={lines}
      typingSpeed={70}
      deletingSpeed={35}
      pauseDuration={2600}
      deleteMode="select"
      typeEffect="fade"
      cursorStyle="bar"
      cursorColor="#039e8a"
      cursorGlide
      showCursor
    />
  );
}
