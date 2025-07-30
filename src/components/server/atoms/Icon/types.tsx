// Inclusión de archivos de íconos.
import Approve from "@/assets/icons/Approve.svg";
import Arrow from "@/assets/icons/Arrow.svg";
import Bus from "@/assets/icons/Bus.svg";
import Calendar from "@/assets/icons/Calendar.svg";
import Check from "@/assets/icons/Check.svg";
import Checked from "@/assets/icons/Checked.svg";
import Class from "@/assets/icons/Class.svg";
import Clock from "@/assets/icons/Clock.svg";
import Cross from "@/assets/icons/Cross.svg";
import Delete from "@/assets/icons/Delete.svg";
import Details from "@/assets/icons/Details.svg";
import Document from "@/assets/icons/Document.svg";
import Down from "@/assets/icons/Down.svg";
import Download from "@/assets/icons/Download.svg";
import DPI from "@/assets/icons/DPI.svg";
import Eye from "@/assets/icons/Eye.svg";
import EyeOff from "@/assets/icons/EyeOff.svg";
import Files from "@/assets/icons/Files.svg";
import Image from "@/assets/icons/Image.svg";
import Info from "@/assets/icons/Info.svg";
import Location from "@/assets/icons/Location.svg";
import Logout from "@/assets/icons/Logout.svg";
import Menu from "@/assets/icons/Menu.svg";
import Moto from "@/assets/icons/Moto.svg";
import Multa from "@/assets/icons/Multa.svg";
import Next from "@/assets/icons/Next.svg";
import Notification from "@/assets/icons/Notification.svg";
import Out from "@/assets/icons/Out.svg";
import PDF from "@/assets/icons/PDF.svg";
import PendingExam from "@/assets/icons/PendingExam.svg";
import Pickup from "@/assets/icons/Pickup.svg";
import Piloto from "@/assets/icons/Piloto.svg";
import Publicidad from "@/assets/icons/Publicidad.svg";
import Search_2 from "@/assets/icons/Search_2.svg";
import Search from "@/assets/icons/Search.svg";
import Tarjeton from "@/assets/icons/Tarjeton.svg";
import Taxi from "@/assets/icons/Taxi.svg";
import Unchecked from "@/assets/icons/Unchecked.svg";
import Up from "@/assets/icons/Up.svg";
import User from "@/assets/icons/User.svg";
import Vehiculo from "@/assets/icons/Vehiculo.svg";
import Upload from "@/assets/icons/Upload.svg";
import Back from "@/assets/icons/Back.svg";
import Camion from "@/assets/icons/Camion.svg";
import TucTuc from "@/assets/icons/TucTuc.svg";
import Left from "@/assets/icons/left.svg";
import Right from "@/assets/icons/right.svg";

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
  | "Back"
  | "left"
  | "right";

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
  left: Left,
  right: Right
};

export type { IconProps, IconType };
export { IconMap };
