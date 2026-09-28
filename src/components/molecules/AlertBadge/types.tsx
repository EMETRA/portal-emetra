type AlertBadgeColor = 
    | "blue"
    | "yellow"
    | "green"
    | "red"
    | "gray";

type AlertBadgeAlign = 
    | "left"
    | "center"
    | "right";

export interface AlertBadgeProps {
  children: React.ReactNode;
  color?: AlertBadgeColor;
  align?: AlertBadgeAlign;
  className?: string;
};