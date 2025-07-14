/**
 * Tipos de variantes de texto.
 *
 * @typedef {"Large" | "Medium" | "Small"} TextVariant
 */

type TextVariant = "Large" | "Medium" | "Small";

/**
 * Propiedades del componente Text.
 *
 * @interface TextProps
 * @extends {React.HTMLAttributes<HTMLParagraphElement>}
 * @property {TextVariant} [variant] - La variante del texto.
 */
interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
}

export type { TextProps, TextVariant };
