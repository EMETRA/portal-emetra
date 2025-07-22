import React from "react";

type IconType =
  | "Camion"
  | "Approve"
  | "Arrow"
  | "Bus"
  | "Calendar"
  | "Check"
  | "Checked"
  | "Class"
  | "Clock"
  | "Cross"
  | "Delete"
  | "Details"
  | "Document"
  | "Down"
  | "Download"
  | "DPI"
  | "Eye"
  | "EyeOff"
  | "Files"
  | "Image"
  | "Info"
  | "Location"
  | "Logout"
  | "Menu"
  | "Moto"
  | "Multa"
  | "Next"
  | "Notification"
  | "Out"
  | "PDF"
  | "PendingExam"
  | "Pickup"
  | "Piloto"
  | "Publicidad"
  | "Search_2"
  | "Search"
  | "Tarjeton"
  | "Taxi"
  | "Unchecked"
  | "Up"
  | "User"
  | "Vehiculo"
  | "Upload"
  | "TucTuc"
  | "Back";

/**
 * Interface para las propiedades de los íconos.
 * */
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  name: IconType;
}

export type { IconProps, IconType };
