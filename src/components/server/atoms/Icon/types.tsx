// Inclusión de archivos de íconos.
import Approve from "@public/icons/Approve.svg";
import Arrow from "@public/icons/Arrow.svg";
import Bus from "@public/icons/Bus.svg";
import Calendar from "@public/icons/Calendar.svg";
import Check from "@public/icons/Check.svg";
import Checked from "@public/icons/Checked.svg";
import Class from "@public/icons/Class.svg";
import Clock from "@public/icons/Clock.svg";
import Cross from "@public/icons/Cross.svg";
import Delete from "@public/icons/Delete.svg";
import Details from "@public/icons/Details.svg";
import Document from "@public/icons/Document.svg";
import Down from "@public/icons/Down.svg";
import Download from "@public/icons/Download.svg";
import DPI from "@public/icons/DPI.svg";
import Eye from "@public/icons/Eye.svg";
import EyeOff from "@public/icons/EyeOff.svg";
import Files from "@public/icons/Files.svg";
import Image from "@public/icons/Image.svg";
import Info from "@public/icons/Info.svg";
import Location from "@public/icons/Location.svg";
import Logout from "@public/icons/Logout.svg";
import Menu from "@public/icons/Menu.svg";
import Moto from "@public/icons/Moto.svg";
import Multa from "@public/icons/Multa.svg";
import Next from "@public/icons/Next.svg";
import Notification from "@public/icons/Notification.svg";
import Out from "@public/icons/Out.svg";
import PDF from "@public/icons/PDF.svg";
import PendingExam from "@public/icons/PendingExam.svg";
import Pickup from "@public/icons/Pickup.svg";
import Piloto from "@public/icons/Piloto.svg";
import Publicidad from "@public/icons/Publicidad.svg";
import Search_2 from "@public/icons/Search_2.svg";
import Search from "@public/icons/Search.svg";
import Tarjeton from "@public/icons/Tarjeton.svg";
import Taxi from "@public/icons/Taxi.svg";
import Unchecked from "@public/icons/Unchecked.svg";
import Up from "@public/icons/Up.svg";
import User from "@public/icons/User.svg";
import Vehiculo from "@public/icons/Vehiculo.svg";
import Upload from "@public/icons/Upload.svg";
import Back from "@public/icons/Back.svg";
import Camion from "@public/icons/Camion.svg";
import TucTuc from "@public/icons/TucTuc.svg";

/**
 * Definición de los nombres para los tipos de Íconos.
 */
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

/**
 * Mapeo de los íconos con sus respectivos nombres.
 */
const IconMap: Record<IconType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Camion: Camion,
  Approve: Approve,
  Arrow: Arrow,
  Bus: Bus,
  Calendar: Calendar,
  Check: Check,
  Checked: Checked,
  Class: Class,
  Clock: Clock,
  Cross: Cross,
  Delete: Delete,
  Details: Details,
  Document: Document,
  Down: Down,
  Download: Download,
  DPI: DPI,
  Eye: Eye,
  EyeOff: EyeOff,
  Files: Files,
  Image: Image,
  Info: Info,
  Location: Location,
  Logout: Logout,
  Menu: Menu,
  Moto: Moto,
  Multa: Multa,
  Next: Next,
  Notification: Notification,
  Out: Out,
  PDF: PDF,
  PendingExam: PendingExam,
  Pickup: Pickup,
  Piloto: Piloto,
  Publicidad: Publicidad,
  Search_2: Search_2,
  Search: Search,
  Tarjeton: Tarjeton,
  Taxi: Taxi,
  Unchecked: Unchecked,
  Up: Up,
  User: User,
  Vehiculo: Vehiculo,
  Upload: Upload,
  TucTuc: TucTuc,
  Back: Back,
};

export type { IconProps, IconType };
export { IconMap };
