import Image from "next/image";
import { Button, Icon } from "../../atoms";

const NavBar: React.FC = () => {
  return (
    <div>
      <div style={{ height: 50, width: "fit-content" }}>
        <Image
          src="/images/Emetra.png"
          alt="Logo"
          width={193}
          height={80}
          style={{ height: "100%", width: "auto" }}
        />
      </div>
      <div>
        <Button>
          <Icon name="DPI" />
          INICIO
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
